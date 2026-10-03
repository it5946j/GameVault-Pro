// ─────────────────────────────────────────────
// RAWG -> APP GAME MODEL MAPPER
// ─────────────────────────────────────────────
// The original GameVault.jsx components (GameCard, FeaturedCard, GameModal,
// LibrarySection filters) were all written against a specific shape:
//   { id, title, genre, desc, rating, players, tags, isNew, isHot, isFeatured }
//
// Rather than rewrite every component to know about RAWG's response shape,
// we map RAWG games onto that exact same shape here, once. This keeps the
// UI layer data-source-agnostic — swapping RAWG for another provider later
// only means changing this file and src/api/rawg.js.
//
// ─────────────────────────────────────────────

const GENRE_SLUG_TO_LABEL = {
  action: "Action",
  rpg: "RPG",
  strategy: "Strategy",
  puzzle: "Puzzle",
  sports: "Sports",
  racing: "Racing",
  adventure: "Adventure",
  simulation: "Simulation",
  fighting: "Fighting",
  horror: "Horror" /* not a real RAWG genre slug but kept for safety */,
  shooter: "Shooter",
  platformer: "Platform",
  casual: "Casual",
  family: "Family",
  indie: "Indie",
  arcade: "Arcade",
  "massively-multiplayer": "Massively_Multiplayer",
};

function primaryGenreLabel(rawgGenres = []) {
  if (!rawgGenres.length) return "Action";
  const slug = rawgGenres[0].slug;
  return GENRE_SLUG_TO_LABEL[slug] || rawgGenres[0].name || "Action";
}

export function mapRawgGame(g) {
  const rating = g.rating && g.rating > 0 ? g.rating : (g.metacritic ? g.metacritic / 20 : 4.0);
  const players = g.added || g.ratings_count || 0;
  const releasedRecently =
    g.released && new Date(g.released) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 60);

  return {
    id: g.id,
    title: g.name,
    genre: primaryGenreLabel(g.genres),
    desc: g.description_raw
      ? g.description_raw.slice(0, 220)
      : `${g.name} — ${(g.genres || []).map((x) => x.name).join(", ") || "an exciting title"} on ${(g.platforms || [])
          .slice(0, 3)
          .map((p) => p.platform?.name)
          .filter(Boolean)
          .join(", ") || "multiple platforms"}.`,
    rating: Math.min(5, Math.round(rating * 10) / 10),
    players,
    background_image: g.background_image,
    released: g.released,
    metacritic: g.metacritic,
    platforms: (g.platforms || []).map((p) => p.platform?.name).filter(Boolean),
    genres: (g.genres || []).map((x) => x.name),
    tags: (g.tags || []).filter((t) => !t.language || t.language === "eng").slice(0, 8).map((t) => t.name),
    shots: (g.short_screenshots || []).slice(1, 5).map((s) => s.image),
    descFull: g.description_raw || "",
    developers: (g.developers || []).map((d) => d.name),
    publishers: (g.publishers || []).map((d) => d.name),
    esrb: g.esrb_rating?.name || null,
    website: g.website || null,
    isNew: !!releasedRecently,
    isHot: players > 8000,
    isFeatured: !!g.metacritic && g.metacritic >= 85,
  };
}

export function mapRawgList(rawgResponse) {
  const results = rawgResponse?.results || [];
  return results.map(mapRawgGame);
}

export default mapRawgGame;
