import { useCallback, useMemo, useRef, useState } from "react";
import { Flame, Sparkles, TrendingUp, Clock, Tag, Store as StoreIcon, X } from "lucide-react";
import { theme as T } from "../styles/theme";
import { GENRE_META, GENRES_ALL } from "../data/genreMeta";
import { SORT_TO_ORDERING, SORT_OPTIONS } from "../data/sortOptions";
import { fetchGames, fetchPopular, fetchNewReleases, fetchTrending, fetchUpcoming } from "../api/rawg";
import { useGameList } from "../hooks/useGameList";
import { useDebounce } from "../hooks/useDebounce";
import StoreBanner from "../components/Store/StoreBanner";
import GameShelf from "../components/Shelf/GameShelf";
import GameCard from "../components/GameCard/GameCard";
import GameModal from "../components/GameModal/GameModal";
import { GameGridSkeleton } from "../components/Loading/Loading";

const onlyDiscounted = (games) =>
  games.filter((g) => g.discount > 0).sort((a, b) => b.discount - a.discount).slice(0, 14);

/**
 * The store front — Steam's homepage, translated to GameVault. A rotating
 * hero banner, a stack of curated shelves (deals, top sellers, new
 * releases, trending, upcoming), a genre quick-jump row, and — like the
 * real Steam store — an endless, filterable, infinitely-loading grid of
 * every game in the catalog underneath it all.
 */
export default function Marketplace() {
  const gridSectionRef = useRef(null);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("hot");
  const debouncedSearch = useDebounce(search, 400);
  const [selectedGame, setSelectedGame] = useState(null);

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

  const jumpToGrid = (nextGenre) => {
    setGenre(nextGenre);
    gridSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const genreEntries = useMemo(() => Object.entries(GENRE_META), []);

  return (
    <section style={{ padding: "100px 24px 80px", maxWidth: 1280, margin: "0 auto" }}>
      {/* Hero */}
      <StoreBanner />

      {/* Genre quick jump */}
      <div style={{
        display: "flex", gap: 10, overflowX: "auto", padding: "24px 0 40px",
        scrollbarWidth: "none",
      }} className="mp-genre-row">
        {genreEntries.map(([name, meta]) => (
          <button
            key={name}
            onClick={() => jumpToGrid(name)}
            style={{
              flexShrink: 0,
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 20,
              border: `1px solid ${genre === name ? meta.color : T.border}`,
              background: genre === name ? `${meta.color}22` : T.surface,
              color: genre === name ? meta.color : T.textSec,
              fontSize: 12.5, fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "border-color 0.2s, color 0.2s",
            }}
          >
            <span>{meta.emoji}</span> {name.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Curated shelves */}
      <GameShelf
        title="Special Offers"
        eyebrow="LIMITED-TIME DEALS"
        icon={Tag}
        accentColor={T.green}
        fetcher={fetchPopular}
        pageSize={48}
        postProcess={onlyDiscounted}
        viewAllTo="/library"
      />
      <GameShelf
        title="Top Sellers"
        eyebrow="MOST POPULAR"
        icon={Flame}
        accentColor={T.orange}
        fetcher={fetchPopular}
        pageSize={16}
        viewAllTo="/library"
      />
      <GameShelf
        title="New Releases"
        eyebrow="JUST LAUNCHED"
        icon={Sparkles}
        accentColor={T.cyan}
        fetcher={fetchNewReleases}
        pageSize={16}
        viewAllTo="/library"
      />
      <GameShelf
        title="Trending Now"
        eyebrow="ON THE RISE"
        icon={TrendingUp}
        accentColor={T.purple}
        fetcher={fetchTrending}
        pageSize={16}
        viewAllTo="/library"
      />
      <GameShelf
        title="Coming Soon"
        eyebrow="UPCOMING"
        icon={Clock}
        accentColor={T.pink}
        fetcher={fetchUpcoming}
        pageSize={16}
        viewAllTo="/library"
      />

      {/* Full catalog */}
      <div ref={gridSectionRef} style={{ paddingTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, display: "flex", alignItems: "center", gap: 8 }}>
            <StoreIcon size={20} color={T.cyan} />
            Browse the Store
          </h2>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the store…"
            style={{
              padding: "8px 12px", borderRadius: 8,
              border: `1px solid ${T.border}`, background: T.surface,
              color: T.text, fontSize: 13, outline: "none", minWidth: 200,
            }}
          />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, cursor: "pointer", outline: "none" }}
          >
            {GENRES_ALL.map((g) => (
              <option key={g} value={g}>{g.replace("_", " ")}</option>
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
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 12px", borderRadius: 8,
                border: `1px solid ${GENRE_META[genre]?.color || T.cyan}44`,
                background: `${GENRE_META[genre]?.bg || "#082F49"}88`,
                color: GENRE_META[genre]?.color || T.cyan,
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              {genre} <X size={12} />
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
        ) : games.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: T.textMuted }}>
            <StoreIcon size={48} style={{ margin: "0 auto 16px", display: "block", opacity: 0.3 }} />
            <p style={{ fontSize: 16 }}>No games found. Try different filters.</p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 14 }}>
              {games.map((g) => (
                <GameCard key={g.id} game={g} onClick={setSelectedGame} />
              ))}
            </div>
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <button
                  onClick={loadMore}
                  disabled={loading}
                  style={{
                    padding: "12px 40px", borderRadius: 10,
                    border: `1px solid ${T.border}`, background: T.surface,
                    color: T.text, fontSize: 14, fontWeight: 600,
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
      </div>

      {selectedGame && <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />}

      <style>{`.mp-genre-row::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
