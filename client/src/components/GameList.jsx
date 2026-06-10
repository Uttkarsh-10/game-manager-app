import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteGame(id) {
  const response = await fetch(`http://localhost:3000/api/games/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete game");
  }

  // Handle empty DELETE response
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function GameList({ games }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteGame,

    onSuccess: () => {
      console.log("Game deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["games"],
      });
    },

    onError: (error) => {
      console.error("Delete failed:", error.message);
    },
  });

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this game?"
    );

    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="games-grid">
      {games.map((game) => (
        <div key={game.id} className="game-card">
          <h3>{game.name}</h3>
          <p>{game.platform}</p>
          <p>{game.genre}</p>

          <div className="button-group">
            <Link to={`/update/${game.id}/edit`}>
              <button>Edit</button>
            </Link>

            <button
              onClick={() => handleDelete(game.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GameList;