import { useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { GENRES_ALL, TIERS } from "../data/genreMeta";
import { useGameFilters } from "../contexts/GameFilterContext";
import { useGameList } from "../hooks/useGameList";
import { useDebounce } from "../hooks/useDebounce";
import { fetchGames } from "../api/rawg";
import PriceBox from "../components/Common/PriceBox";
import { RowSkeleton } from "../components/Common/Skeletons";
import { reviewLabel, steamDate } from "../utils/format";

// Maps our UI sort labels onto RAWG's `ordering` query param.
const SORT_TO_ORDERING = {
  hot: "-added",
  new: "-released",
  rating: "-rating",
  az: "name",
};

export default function Library() {
  const { search, genre, setGenre, tierFilter, setTierFilter, sort, setSort } = useGameFilters();
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
  const visibleGames = useMemo(
    () => (tierFilter === 0 ? games : games.filter((g) => g.tier === tierFilter - 1)),
    [games, tierFilter]
  );

  const heading = debouncedSearch.trim()
    ? `Search results for "${debouncedSearch.trim()}"`
    : genre !== "All"
      ? `${genre.replace("_", " ")} games`
      : "All games";

  return (
    <div className="store-wrap wide">
      <div className="search-layout">
        <div style={{ minWidth: 0 }}>
          <div className="sort-bar">
            <span>{heading}{!loading && ` — ${visibleGames.length} shown`}</span>
            <label>
              Sort by{" "}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="hot">Trending</option>
                <option value="new">Release date</option>
                <option value="rating">User reviews</option>
                <option value="az">Name</option>
              </select>
            </label>
          </div>

          {error && <p style={{ padding: 20, color: "#c15755" }}>Couldn't load games: {error}</p>}

          {loading && games.length === 0 ? (
            <RowSkeleton count={14} />
          ) : visibleGames.length === 0 && !error ? (
            <p style={{ padding: "60px 0", textAlign: "center", color: "#8f98a0" }}>No results match your search.</p>
          ) : (
            <>
              {visibleGames.map((g) => {
                const review = reviewLabel(g.rating);
                return (
                  <Link key={g.id} to={`/game/${g.id}`} className="result">
                    <div className="thumb" style={g.background_image ? { backgroundImage: `url(${g.background_image})` } : undefined} />
                    <div style={{ minWidth: 0 }}>
                      <div className="t">{g.title}</div>
                      <div className="sub">{g.genres.slice(0, 3).join(", ")}</div>
                      <div className="plats">{g.platforms.slice(0, 4).join(" · ")}</div>
                    </div>
                    <div className="right">
                      <div className="rel">{steamDate(g.released)}</div>
                      <div className="rev" style={{ color: review.color }}>{review.text}</div>
                      <PriceBox tier={g.tier} />
                    </div>
                  </Link>
                );
              })}
              {hasMore && (
                <button className="load-more" onClick={loadMore} disabled={loading}>
                  {loading ? "Loading…" : "Show more results"}
                </button>
              )}
            </>
          )}
        </div>

        <aside>
          <div className="filter-box">
            <h4>Narrow by plan</h4>
            <div className="opts">
              {TIERS.map((t, i) => (
                <button key={t} className={tierFilter === i ? "on" : ""} onClick={() => setTierFilter(i)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="filter-box">
            <h4>Narrow by genre</h4>
            <div className="opts">
              {GENRES_ALL.map((g) => (
                <button key={g} className={genre === g ? "on" : ""} onClick={() => setGenre(g)}>{g.replace("_", " ")}</button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
