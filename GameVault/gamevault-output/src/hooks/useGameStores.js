import { useEffect, useState } from "react";
import { fetchGameStores, fetchStores } from "../api/rawg";

let storeNameCachePromise = null;
function loadStoreNames() {
  if (!storeNameCachePromise) {
    storeNameCachePromise = fetchStores()
      .then((res) => {
        const map = {};
        (res?.results || []).forEach((s) => { map[s.id] = s.name; });
        return map;
      })
      .catch(() => ({}));
  }
  return storeNameCachePromise;
}

function steamSearchUrl(title) {
  return `https://store.steampowered.com/search/?term=${encodeURIComponent(title)}`;
}

/**
 * Resolves real, clickable links to where a game can actually be bought or
 * played (Steam, Epic, GOG, PlayStation, Xbox, itch.io, ...), using RAWG's
 * per-game stores endpoint. GameVault never hosts or streams any game
 * itself, so this is the only way a "Play"/"Buy" button can be real. Falls
 * back to a Steam search for the title so every game gets a working link,
 * even ones RAWG has no direct store URL for.
 */
export function useGameStores(game) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!game?.id) return;
    let cancelled = false;
    setLoading(true);

    Promise.all([fetchGameStores(game.id).catch(() => null), loadStoreNames()])
      .then(([storesRes, nameMap]) => {
        if (cancelled) return;
        const results = storesRes?.results || [];
        const resolved = results
          .filter((s) => s.url)
          .map((s) => ({ name: nameMap[s.store_id] || "Store", url: s.url }));

        setLinks(resolved.length ? resolved : [{ name: "Search on Steam", url: steamSearchUrl(game.title) }]);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [game?.id, game?.title]);

  return { links, loading };
}

export default useGameStores;
