// ─────────────────────────────────────────────
// INTERNET ARCHIVE CLASSICS
// ─────────────────────────────────────────────
// Thousands of DOS games and arcade machines that the Internet Archive runs in
// the browser. Search goes through our own proxy (server/index.js); playing is
// the Archive's official embedded player. We never host or copy the games.
// ─────────────────────────────────────────────
import axios from "axios";

const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || "/api", timeout: 15000 });

export const COLLECTIONS = [
  { key: "all", label: "All classics" },
  { key: "dos", label: "DOS games" },
  { key: "arcade", label: "Arcade machines" },
];

export const coverUrl = (id) => `https://archive.org/services/img/${encodeURIComponent(id)}`;
export const embedUrl = (id) => `https://archive.org/embed/${encodeURIComponent(id)}`;
export const detailsUrl = (id) => `https://archive.org/details/${encodeURIComponent(id)}`;

export async function searchClassics({ collection = "all", q = "", page = 1, rows = 24, sort = "downloads desc", exact = false } = {}) {
  const { data } = await client.get("/archive/search", {
    params: { collection, q: q || undefined, page, rows, sort, exact: exact ? 1 : undefined },
  });
  return data; // { count, results: [{ id, title, year, downloads }] }
}

const norm = (t = "") => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Best Archive match for a game title, or null. Only accepts a clean title match. */
export async function findClassicByTitle(title) {
  try {
    const { results } = await searchClassics({ q: title, exact: true, rows: 10 });
    const want = norm(title);
    return results.find((r) => norm(r.title) === want) || results.find((r) => norm(r.title).startsWith(want)) || null;
  } catch {
    return null;
  }
}
