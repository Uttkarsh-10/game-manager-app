import { useQuery } from "@tanstack/react-query";
import GameList from "../components/GameList";

async function fetchGames() {
  const response = await fetch("http://localhost:3000/api/games");

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  return response.json();
}

function Home() {
  const {
    data: games,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["games"],
    queryFn: fetchGames,
  });

  if (isLoading) {
    return <div>Loading games...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="page-container">
      <h1>Welcome to Game Manager</h1>
      <p>Manage your game collection with ease</p>

      <div
        className="bg-card"
        style={{
          marginTop: "1rem",
          padding: "1rem",
        }}
      >
        <GameList games={games} />
      </div>
    </div>
  );
}

export default Home;