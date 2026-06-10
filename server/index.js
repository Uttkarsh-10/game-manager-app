import express from "express";
import cors from "cors";
import { games } from "./fakeDB.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Get all games
app.get("/api/games", (req, res) => {
  res.json(games);
});

// Get a single game by ID
app.get("/api/games/:id", (req, res) => {
  const id = Number(req.params.id);

  const game = games.find((g) => g.id === id);

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  res.json(game);
});

// Create a new game
app.post("/api/games", (req, res) => {
  const { gameName, platform, genre } = req.body;

  if (!gameName || !platform || !genre) {
    return res.status(400).json({
      error: "Game name, platform, and genre are required",
    });
  }

  const newGame = {
    id: games.length > 0 ? games[games.length - 1].id + 1 : 1,
    name: gameName,
    platform,
    genre,
  };

  games.push(newGame);

  res.status(201).json(newGame);
});

// Update a game
app.put("/api/games/:id", (req, res) => {
  const id = Number(req.params.id);
  const { gameName, platform, genre } = req.body;

  const game = games.find((g) => g.id === Number(id));

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  game.name = gameName || game.name;
  game.platform = platform || game.platform;
  game.genre = genre || game.genre;

  res.json(game);
});

// Delete a game
app.delete("/api/games/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = games.findIndex((g) => g.id === Number(id));

  if (index === -1) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  const deletedGame = games.splice(index, 1);

  res.json({
    message: "Game deleted successfully",
    game: deletedGame[0],
  });
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});