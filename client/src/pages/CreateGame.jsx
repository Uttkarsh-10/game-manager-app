import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function CreateGame() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // API call
  const addGame = async (gameData) => {
    const response = await fetch("http://localhost:3000/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      throw new Error("Failed to add game");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: addGame,

    onSuccess: async () => {
      // Refresh cached games
      await queryClient.invalidateQueries({
        queryKey: ["games"],
      });

      // Clear form
      reset();

      // Go back to home page
      navigate("/");
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="page-container">
      <h2>Create New Game</h2>

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
          {mutation.isPending ? "Adding..." : "Add Game"}
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

export default CreateGame;