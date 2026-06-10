import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";

async function fetchGameById(id) {
  const response = await fetch(
    `http://localhost:3000/api/games/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch game details");
  }

  return response.json();
}

function UpdateGame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch existing game
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["game", id],
    queryFn: () => fetchGameById(id),
  });

  // Populate form when data loads
  useEffect(() => {
    if (data) {
      reset({
        gameName: data.name,
        platform: data.platform,
        genre: data.genre,
      });
    }
  }, [data, reset]);

  // Update game API
  const updateGame = async (updatedGame) => {
    const response = await fetch(
      `http://localhost:3000/api/games/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedGame),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update game");
    }

    return response.json();
  };

  // Mutation
  const mutation = useMutation({
    mutationFn: updateGame,

    onSuccess: async () => {
      // Refresh game list
      await queryClient.invalidateQueries({
        queryKey: ["games"],
      });

      // Refresh individual game cache
      await queryClient.invalidateQueries({
        queryKey: ["game", id],
      });

      // Redirect home
      navigate("/");
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Loading game details...</div>;
  }

  if (isError) {
    return (
      <div style={{ color: "red" }}>
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>Update Game</h2>

      <form
        className="form-container bg-card"
        onSubmit={handleSubmit(onSubmit)}
        style={{
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        {/* Game Name */}
        <label htmlFor="gameName">Game Name</label>
        <input
          id="gameName"
          type="text"
          placeholder="Marvel's Spider-Man"
          {...register("gameName", {
            required: "Game name is required",
          })}
        />

        {errors.gameName && (
          <p style={{ color: "red" }}>
            {errors.gameName.message}
          </p>
        )}

        {/* Platform */}
        <label htmlFor="platform">Platform</label>
        <input
          id="platform"
          type="text"
          placeholder="PC, PS5, Xbox"
          {...register("platform", {
            required: "Platform is required",
          })}
        />

        {errors.platform && (
          <p style={{ color: "red" }}>
            {errors.platform.message}
          </p>
        )}

        {/* Genre */}
        <label htmlFor="genre">Genre</label>
        <input
          id="genre"
          type="text"
          placeholder="Action, RPG, Sports"
          {...register("genre", {
            required: "Genre is required",
          })}
        />

        {errors.genre && (
          <p style={{ color: "red" }}>
            {errors.genre.message}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "Updating..."
            : "Update Game"}
        </button>

        {mutation.isError && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {mutation.error.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default UpdateGame;