// ─────────────────────────────────────────────
// RAWG -> APP GAME MODEL MAPPER
// ─────────────────────────────────────────────
// The original GameVault.jsx components (GameCard, FeaturedCard, GameModal,
// LibrarySection filters) were all written against a specific shape:
//   { id, title, genre, desc, tier, rating, players, tags, isNew, isHot, isFeatured }
//
// Rather than rewrite every component to know about RAWG's response shape,
// we map RAWG games onto that exact same shape here, once. This keeps the
// UI layer data-source-agnostic — swapping RAWG for another provider later
// only means changing this file and src/api/rawg.js.
//
// "tier" (Basic/Pro/Ultimate) and subscription gating are a GameVault-only
// business concept that RAWG has no concept of, so we derive a deterministic
// pseudo-tier from each game's id so the existing paywall UI keeps working
// in Phase 1. This will be replaced by real backend entitlement data once
// the marketplace/subscription system (Phase 2+) is live.
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

function deterministicTier(id) {
  // Stable 0/1/2 split so the same game always renders the same tier
  // across renders/pages without needing extra state.
  return id % 3;
}

// Steam-style storefront pricing is another GameVault-only concept RAWG has
// no data for, so — same approach as tier — we derive a stable price/sale
// deterministically from each game's id and quality score. This keeps price
// tags consistent for a given game across the Home shelves, Library grid,
// and Marketplace store front without needing a real pricing backend.
const PRICE_LADDER = [4.99, 9.99, 14.99, 19.99, 24.99, 29.99, 34.99, 39.99, 49.99, 59.99];
const DISCOUNT_LADDER = [10, 15, 20, 25, 33, 40, 50, 60, 67, 75];

function deterministicPricing(id, metacritic, rating) {
  if (id % 11 === 0) {
    return { price: 0, originalPrice: 0, discount: 0, isFree: true };
  }
  const qualityScore = metacritic || (rating ? rating * 20 : 70);
  const ladderIndex = Math.max(
    0,
    Math.min(PRICE_LADDER.length - 1, Math.floor((qualityScore / 100) * PRICE_LADDER.length * 0.7) + (id % 4))
  );
  const originalPrice = PRICE_LADDER[ladderIndex];
  const onSale = id % 4 === 0;
  const discount = onSale ? DISCOUNT_LADDER[id % DISCOUNT_LADDER.length] : 0;
  const price = onSale ? Math.round(originalPrice * (1 - discount / 100) * 100) / 100 : originalPrice;
  return { price, originalPrice, discount, isFree: false };
}

export function mapRawgGame(g) {
  const rating = g.rating && g.rating > 0 ? g.rating : (g.metacritic ? g.metacritic / 20 : 4.0);
  const players = g.added || g.ratings_count || 0;
  const releasedRecently =
    g.released && new Date(g.released) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 60);
  const pricing = deterministicPricing(g.id, g.metacritic, rating);

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
    tier: deterministicTier(g.id),
    rating: Math.min(5, Math.round(rating * 10) / 10),
    players,
    background_image: g.background_image,
    released: g.released,
    metacritic: g.metacritic,
    platforms: (g.platforms || []).map((p) => p.platform?.name).filter(Boolean),
    tags: [],
    isNew: !!releasedRecently,
    isHot: players > 8000,
    isFeatured: !!g.metacritic && g.metacritic >= 85,
    ...pricing,
  };
}

export function mapRawgList(rawgResponse) {
  const results = rawgResponse?.results || [];
  return results.map(mapRawgGame);
}

export default mapRawgGame;
