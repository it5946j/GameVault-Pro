export const GENRE_META = {
  Action:     { color: "#EF4444", bg: "#7F1D1D", icon: "⚡", emoji: "⚡" },
  RPG:        { color: "#8B5CF6", bg: "#3B0764", icon: "🗡️", emoji: "🗡️" },
  Strategy:   { color: "#0EA5E9", bg: "#082F49", icon: "♟️", emoji: "♟️" },
  Puzzle:     { color: "#10B981", bg: "#064E3B", icon: "🧩", emoji: "🧩" },
  Sports:     { color: "#F59E0B", bg: "#451A03", icon: "🏆", emoji: "🏆" },
  Racing:     { color: "#F97316", bg: "#431407", icon: "🏎️", emoji: "🏎️" },
  Adventure:  { color: "#22C55E", bg: "#052E16", icon: "🗺️", emoji: "🗺️" },
  Simulation: { color: "#06B6D4", bg: "#083344", icon: "🏙️", emoji: "🏙️" },
  Fighting:   { color: "#DC2626", bg: "#450A0A", icon: "🥊", emoji: "🥊" },
  Horror:     { color: "#A855F7", bg: "#2E1065", icon: "👻", emoji: "👻" },
  Shooter:    { color: "#3B82F6", bg: "#1E3A5F", icon: "🎯", emoji: "🎯" },
  Platform:   { color: "#EC4899", bg: "#500724", icon: "🎮", emoji: "🎮" },
  Casual:     { color: "#FACC15", bg: "#422006", icon: "🎲", emoji: "🎲" },
  Family:     { color: "#34D399", bg: "#022C22", icon: "👪", emoji: "👪" },
  Indie:      { color: "#F472B6", bg: "#4A044E", icon: "✨", emoji: "✨" },
  Arcade:     { color: "#FB7185", bg: "#4C0519", icon: "🕹️", emoji: "🕹️" },
  Massively_Multiplayer: { color: "#38BDF8", bg: "#0C4A6E", icon: "🌐", emoji: "🌐" },
};

export const GENRES_ALL = ["All", ...Object.keys(GENRE_META)];
export const TIERS = ["All Tiers", "Basic (Free)", "Pro", "Ultimate"];

export default GENRE_META;
