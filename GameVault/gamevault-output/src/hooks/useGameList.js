import { useState, useEffect, useCallback, useRef } from "react";
import { mapRawgList } from "../utils/mapRawgGame";

/**
 * Generic hook for any "fetch a page of games" API function (fetchTrending,
 * fetchPopular, searchGames, etc). Handles loading / error / pagination and
 * maps RAWG's response shape onto the app's internal game model.
 *
 * @param {(page:number, pageSize:number) => Promise<any>} fetcher
 * @param {Array} deps - dependency array; hook re-fetches from page 1 when these change
 * @param {number} pageSize
 */
export function useGameList(fetcher, deps = [], pageSize = 24) {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const load = useCallback(
    async (pageToLoad, replace) => {
      const myRequest = ++requestId.current;
      setLoading(true);
      setError(null);
      try {
        const res = await fetcher(pageToLoad, pageSize);
        if (myRequest !== requestId.current) return; // stale response, ignore
        const mapped = mapRawgList(res);
        setGames((prev) => (replace ? mapped : [...prev, ...mapped]));
        setHasMore(Boolean(res?.next));
      } catch (e) {
        if (myRequest !== requestId.current) return;
        setError(e?.message || "Failed to load games");
      } finally {
        if (myRequest === requestId.current) setLoading(false);
      }
    },
    [fetcher, pageSize]
  );

  // Re-fetch from page 1 whenever deps change (e.g. search term, genre filter)
  useEffect(() => {
    setPage(1);
    load(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const next = page + 1;
    setPage(next);
    load(next, false);
  }, [page, loading, hasMore, load]);

  return { games, loading, error, hasMore, loadMore, page };
}

export default useGameList;
