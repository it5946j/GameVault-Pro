import { createSnake, createBreakout, createPong, createSkyhop, createDefender } from "./engines";

/** The built-in, genuinely playable GameVault Originals. */
export const ORIGINALS = [
  {
    key: "star-defender", name: "Star Defender", create: createDefender,
    tagline: "Hold the line against the swarm.", genres: ["Action", "Shooter"],
    controls: "← → / A D or move the mouse / finger to steer. Your ship fires automatically.",
    colors: ["#0b3d91", "#66c0f4"],
  },
  {
    key: "snake", name: "Neon Snake", create: createSnake,
    tagline: "Eat, grow, don't crash.", genres: ["Arcade", "Casual"],
    controls: "Arrow keys / WASD, or swipe on touch screens.",
    colors: ["#1b4d1b", "#a4d007"],
  },
  {
    key: "breakout", name: "Brick Vault", create: createBreakout,
    tagline: "Smash every brick in the vault.", genres: ["Puzzle", "Arcade"],
    controls: "← → / A D or move the mouse to steer the paddle. Space or click to launch.",
    colors: ["#5b1a6e", "#ff9f43"],
  },
  {
    key: "pong", name: "Vault Pong", create: createPong,
    tagline: "Beat the CPU. Miss five and you're out.", genres: ["Sports", "Fighting"],
    controls: "↑ ↓ / W S or move the mouse / finger to move your paddle.",
    colors: ["#7a1f1f", "#66c0f4"],
  },
  {
    key: "skyhop", name: "Skyhop", create: createSkyhop,
    tagline: "Tap to hop through the gaps.", genres: ["Platform", "Adventure"],
    controls: "Space / ↑ / click / tap to flap.",
    colors: ["#0b1f33", "#feca57"],
  },
];

const BY_KEY = Object.fromEntries(ORIGINALS.map((g) => [g.key, g]));

export const getOriginal = (key) => BY_KEY[key] || null;

// Genre -> best-matching built-in game. Anything unmatched is picked from the
// game id so a given title always launches the same game.
const GENRE_TO_KEY = {
  Action: "star-defender", Shooter: "star-defender", RPG: "star-defender", Horror: "star-defender", Massively_Multiplayer: "star-defender",
  Arcade: "snake", Casual: "snake", Simulation: "snake", Strategy: "snake",
  Puzzle: "breakout", Indie: "breakout", Family: "breakout",
  Sports: "pong", Fighting: "pong",
  Platform: "skyhop", Adventure: "skyhop", Racing: "skyhop",
};

export function originalForGame(game) {
  return BY_KEY[GENRE_TO_KEY[game?.genre]] || ORIGINALS[(game?.id || 0) % ORIGINALS.length];
}
