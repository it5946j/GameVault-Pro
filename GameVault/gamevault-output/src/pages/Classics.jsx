import { useEffect, useRef, useState, useCallback } from "react";
import { COLLECTIONS, searchClassics } from "../api/archive";
import { useDebounce } from "../hooks/useDebounce";
import ClassicCard from "../components/Arcade/ClassicCard";
import { CapSkeleton } from "../components/Common/Skeletons";

const PAGE = 24;
const SORTS = [
  { value: "downloads desc", label: "Most played" },
  { value: "titleSorter asc", label: "Name" },
  { value: "date desc", label: "Newest upload" },
];

export default function Classics() {
  const [collection, setCollection] = useState("all");
  const [sort, setSort] = useState("downloads desc");
  const [query, setQuery] = useState("");
  const q = useDebounce(query, 400);
  const [games, setGames] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const req = useRef(0);

  const load = useCallback(async (p, replace) => {
    const mine = ++req.current;
    setLoading(true);
    setError(null);
    try {
      const res = await searchClassics({ collection, q, sort, page: p, rows: PAGE });
      if (mine !== req.current) return;
      setGames((prev) => (replace ? res.results : [...prev, ...res.results]));
      setTotal(res.count);
      setPage(p);
    } catch (e) {
      if (mine === req.current) setError(e?.message || "Failed to load classics");
    } finally {
      if (mine === req.current) setLoading(false);
    }
  }, [collection, q, sort]);

  useEffect(() => { load(1, true); }, [load]);

  const hasMore = games.length < total;

  return (
    <div className="store-wrap wide">
      <div className="sec-title" style={{ marginTop: 20 }}>
        Classic games — play instantly in your browser
      </div>
      <p style={{ color: "#8f98a0", fontSize: 12, marginBottom: 10 }}>
        {total > 0 ? `${total.toLocaleString()} free games. ` : ""}Powered by the Internet Archive's in-browser emulators — no download, no account.
      </p>

      <div className="sort-bar" style={{ flexWrap: "wrap", gap: 8 }}>
        <div className="tabs-head" style={{ background: "none", flex: "0 1 auto" }}>
          {COLLECTIONS.map((c) => (
            <button key={c.key} className={collection === c.key ? "on" : ""} style={{ padding: "6px 14px" }} onClick={() => setCollection(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            className="classic-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classics…"
            aria-label="Search classic games"
          />
          <label>
            Sort by{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      {error && <p style={{ padding: 20, color: "#c15755" }}>Couldn't load classics: {error}</p>}

      {loading && games.length === 0 ? (
        <CapSkeleton count={8} />
      ) : games.length === 0 && !error ? (
        <p style={{ padding: "60px 0", textAlign: "center", color: "#8f98a0" }}>No classics match your search.</p>
      ) : (
        <>
          <div className="cap-grid classic-grid">
            {games.map((g) => <ClassicCard key={g.id} game={g} />)}
          </div>
          {hasMore && (
            <button className="load-more" onClick={() => load(page + 1, false)} disabled={loading}>
              {loading ? "Loading…" : "Show more games"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
