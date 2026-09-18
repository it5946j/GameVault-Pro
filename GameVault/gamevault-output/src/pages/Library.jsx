import { useMemo, useState, useCallback } from "react";
import { Gamepad2, X } from "lucide-react";
import { theme as T } from "../styles/theme";
import { GENRES_ALL, TIERS, GENRE_META } from "../data/genreMeta";
import { useGameFilters } from "../contexts/GameFilterContext";
import { useGameList } from "../hooks/useGameList";
import { useDebounce } from "../hooks/useDebounce";
import { fetchGames } from "../api/rawg";
import GameCard from "../components/GameCard/GameCard";
import GameModal from "../components/GameModal/GameModal";
import { GameGridSkeleton } from "../components/Loading/Loading";
import { SORT_TO_ORDERING, SORT_OPTIONS } from "../data/sortOptions";

export default function Library() {
  const { search, setSearch, genre, setGenre, tierFilter, setTierFilter, sort, setSort } = useGameFilters();
  const [selectedGame, setSelectedGame] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  const genreSlug = genre !== "All" ? genre.toLowerCase().replace("_", "-") : undefined;

  const fetcher = useCallback(
    (page, pageSize) =>
      fetchGames({
        page,
        page_size: pageSize,
        ordering: SORT_TO_ORDERING[sort] || "-added",
        search: debouncedSearch.trim() || undefined,
        genres: genreSlug,
      }),
    [sort, debouncedSearch, genreSlug]
  );

  const { games, loading, error, hasMore, loadMore } = useGameList(fetcher, [debouncedSearch, genre, sort], 24);

  // Tier is a GameVault-only concept (see mapRawgGame.js), so it's filtered
  // client-side over whatever page of RAWG results we currently have.
  const visibleGames = useMemo(() => {
    if (tierFilter === 0) return games;
    return games.filter((g) => g.tier === tierFilter - 1);
  }, [games, tierFilter]);

  return (
    <section style={{ padding: "40px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, display: "flex", alignItems: "center", gap: 8 }}>
          <Gamepad2 size={20} color={T.cyan} />
          Game Library
        </h2>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, cursor: "pointer", outline: "none" }}
        >
          {GENRES_ALL.map((g) => (
            <option key={g} value={g}>
              {g.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(Number(e.target.value))}
          style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, cursor: "pointer", outline: "none" }}
        >
          {TIERS.map((t, i) => (
            <option key={i} value={i}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, cursor: "pointer", outline: "none" }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {genre !== "All" && (
          <button
            onClick={() => setGenre("All")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 12px",
              borderRadius: 8,
              border: `1px solid ${GENRE_META[genre]?.color || T.cyan}44`,
              background: `${GENRE_META[genre]?.bg || "#082F49"}88`,
              color: GENRE_META[genre]?.color || T.cyan,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {genre} <X size={12} />
          </button>
        )}
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.textSec, fontSize: 12, cursor: "pointer" }}
          >
            "{search}" <X size={12} />
          </button>
        )}
      </div>

      {error && (
        <div style={{ textAlign: "center", padding: "40px 0", color: T.red }}>
          <p style={{ fontSize: 14 }}>Couldn't load games: {error}</p>
        </div>
      )}

      {loading && games.length === 0 ? (
        <GameGridSkeleton count={24} />
      ) : visibleGames.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: T.textMuted }}>
          <Gamepad2 size={48} style={{ margin: "0 auto 16px", display: "block", opacity: 0.3 }} />
          <p style={{ fontSize: 16 }}>No games found. Try different filters.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 14 }}>
            {visibleGames.map((g) => (
              <GameCard key={g.id} game={g} onClick={setSelectedGame} />
            ))}
          </div>
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button
                onClick={loadMore}
                disabled={loading}
                style={{
                  padding: "12px 40px",
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  background: T.surface,
                  color: T.text,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "default" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Loading…" : "Load More Games"}
              </button>
            </div>
          )}
        </>
      )}

      {selectedGame && <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />}
    </section>
  );
}
