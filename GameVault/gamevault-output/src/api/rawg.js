// ─────────────────────────────────────────────
// RAWG API CLIENT
// ─────────────────────────────────────────────
// IMPORTANT: This module never talks to api.rawg.io directly, and it never
// holds an API key. All requests go to OUR OWN backend (server/index.js),
// which attaches the RAWG key server-side. This keeps the key out of the
// browser bundle and out of devtools network tab.
//
// In dev, Vite proxies /api/* -> http://localhost:8080 (see vite.config.js).
// In production, deploy server/index.js behind the same domain/path so
// relative /api calls keep working, or set VITE_API_BASE_URL.
// ─────────────────────────────────────────────
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
});

// Small in-memory cache so paging/back-and-forth navigation between
// Home <-> Library doesn't re-fetch identical queries within a session.
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

async function cachedGet(path, params = {}) {
  const key = path + JSON.stringify(params);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.time < CACHE_TTL_MS) {
    return hit.data;
  }
  const { data } = await client.get(path, { params });
  cache.set(key, { data, time: Date.now() });
  return data;
}

/**
 * Generic paged game list fetcher.
 * @param {object} params - RAWG-style query params (ordering, genres, search, page, page_size, dates)
 */
export async function fetchGames(params = {}) {
  return cachedGet("/games", params);
}

export async function fetchTrending(page = 1, pageSize = 24) {
  // RAWG has no literal "trending" endpoint; "added" descending over the
  // last few months is the closest proxy and is what most RAWG-powered
  // sites use for a trending rail.
  const now = new Date();
  const past = new Date(now);
  past.setMonth(past.getMonth() - 3);
  return fetchGames({
    ordering: "-added",
    dates: `${past.toISOString().slice(0, 10)},${now.toISOString().slice(0, 10)}`,
    page,
    page_size: pageSize,
  });
}

export async function fetchNewReleases(page = 1, pageSize = 24) {
  const now = new Date();
  const past = new Date(now);
  past.setMonth(past.getMonth() - 1);
  return fetchGames({
    ordering: "-released",
    dates: `${past.toISOString().slice(0, 10)},${now.toISOString().slice(0, 10)}`,
    page,
    page_size: pageSize,
  });
}

export async function fetchPopular(page = 1, pageSize = 24) {
  return fetchGames({ ordering: "-rating", page, page_size: pageSize });
}

export async function fetchUpcoming(page = 1, pageSize = 24) {
  const now = new Date();
  const future = new Date(now);
  future.setMonth(future.getMonth() + 4);
  return fetchGames({
    ordering: "released",
    dates: `${now.toISOString().slice(0, 10)},${future.toISOString().slice(0, 10)}`,
    page,
    page_size: pageSize,
  });
}

export async function searchGames(query, page = 1, pageSize = 24) {
  if (!query?.trim()) return fetchPopular(page, pageSize);
  return fetchGames({ search: query.trim(), page, page_size: pageSize });
}

export async function fetchGameDetail(id) {
  return cachedGet(`/games/${id}`);
}

export async function fetchGameScreenshots(id) {
  return cachedGet(`/games/${id}/screenshots`);
}

export async function fetchGameTrailers(id) {
  return cachedGet(`/games/${id}/movies`);
}

// Real, per-game links to where it's actually sold/playable (Steam, Epic,
// GOG, PlayStation, Xbox, itch.io, ...). This is what makes "Play"/"Buy"
// buttons actually go somewhere real instead of doing nothing — GameVault
// doesn't host or stream any game itself, it links out to the real store.
export async function fetchGameStores(id) {
  return cachedGet(`/games/${id}/stores`);
}

// The full list of RAWG-known storefronts (id -> name/domain), needed to
// label the per-game store links above since that endpoint only returns
// numeric store_id + url.
export async function fetchStores() {
  return cachedGet("/stores");
}

export async function fetchGenres() {
  return cachedGet("/genres");
}

export async function fetchPlatforms() {
  return cachedGet("/platforms/lists/parents");
}

export default {
  fetchGames,
  fetchTrending,
  fetchNewReleases,
  fetchPopular,
  fetchUpcoming,
  searchGames,
  fetchGameDetail,
  fetchGameScreenshots,
  fetchGameTrailers,
  fetchGameStores,
  fetchStores,
  fetchGenres,
  fetchPlatforms,
};
