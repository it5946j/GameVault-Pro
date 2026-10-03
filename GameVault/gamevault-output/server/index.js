// ─────────────────────────────────────────────
// GameVault API Proxy
// ─────────────────────────────────────────────
// This is the ONLY place the RAWG API key is ever read. The frontend
// (src/api/rawg.js) calls these routes via relative /api/* paths and never
// sees the key. Set RAWG_API_KEY in server/.env (see .env.example).
// ─────────────────────────────────────────────
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = "https://api.rawg.io/api";

if (!RAWG_API_KEY) {
  console.warn(
    "\n⚠️  RAWG_API_KEY is not set. Create server/.env (copy server/.env.example) and add your key.\n" +
      "   Game data endpoints will return errors until this is set.\n"
  );
}

app.use(cors());
app.use(express.json());

// Simple request logger
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

/**
 * Generic forwarder: builds a RAWG URL from the incoming path + query,
 * attaches the key server-side, and pipes the JSON response back.
 */
async function proxyToRawg(rawgPath, query, res) {
  if (!RAWG_API_KEY) {
    return res.status(500).json({ error: "Server is missing RAWG_API_KEY. See server/.env.example." });
  }
  try {
    const params = new URLSearchParams({ ...query, key: RAWG_API_KEY });
    const url = `${RAWG_BASE_URL}${rawgPath}?${params.toString()}`;
    const rawgRes = await fetch(url);
    const data = await rawgRes.json();
    if (!rawgRes.ok) {
      return res.status(rawgRes.status).json({ error: data?.detail || "RAWG API error" });
    }
    res.json(data);
  } catch (err) {
    console.error("RAWG proxy error:", err.message);
    res.status(502).json({ error: "Failed to reach RAWG API" });
  }
}

app.get("/api/games", (req, res) => proxyToRawg("/games", req.query, res));
app.get("/api/games/:id", (req, res) => proxyToRawg(`/games/${req.params.id}`, req.query, res));
app.get("/api/games/:id/screenshots", (req, res) => proxyToRawg(`/games/${req.params.id}/screenshots`, req.query, res));
app.get("/api/games/:id/movies", (req, res) => proxyToRawg(`/games/${req.params.id}/movies`, req.query, res));
app.get("/api/genres", (req, res) => proxyToRawg("/genres", req.query, res));
app.get("/api/platforms/lists/parents", (req, res) => proxyToRawg("/platforms/lists/parents", req.query, res));

// ─── Internet Archive classics (no key needed) ───────────────
// The Archive hosts thousands of DOS games and arcade machines that run in the
// browser through its own emulator. We only search its catalogue here; the
// frontend embeds the Archive's player (https://archive.org/embed/<id>).
const ARCHIVE_COLLECTIONS = {
  dos: "softwarelibrary_msdos_games",
  arcade: "internetarcade",
};

app.get("/api/archive/search", async (req, res) => {
  const { collection = "all", q = "", exact, page = "1", rows = "24", sort = "downloads desc" } = req.query;
  const ids = collection === "all" ? Object.values(ARCHIVE_COLLECTIONS) : [ARCHIVE_COLLECTIONS[collection]].filter(Boolean);
  if (!ids.length) return res.status(400).json({ error: "Unknown collection" });

  // Strip query syntax characters so user input can't alter the search expression.
  const text = String(q).replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  let query = `collection:(${ids.join(" OR ")}) AND mediatype:software`;
  if (text) query += exact ? ` AND title:"${text}"` : ` AND title:(${text})`;

  const params = new URLSearchParams({
    q: query,
    rows: String(Math.min(Number(rows) || 24, 60)),
    page: String(Math.max(Number(page) || 1, 1)),
    output: "json",
  });
  ["identifier", "title", "year", "downloads"].forEach((f) => params.append("fl[]", f));
  params.append("sort[]", ["downloads desc", "titleSorter asc", "date desc"].includes(sort) ? sort : "downloads desc");

  try {
    const r = await fetch(`https://archive.org/advancedsearch.php?${params.toString()}`);
    if (!r.ok) return res.status(502).json({ error: "Internet Archive search failed" });
    const data = await r.json();
    res.json({
      count: data?.response?.numFound || 0,
      results: (data?.response?.docs || []).map((d) => ({
        id: d.identifier,
        title: Array.isArray(d.title) ? d.title[0] : d.title,
        year: d.year ? String(d.year).slice(0, 4) : null,
        downloads: d.downloads || 0,
      })),
    });
  } catch (err) {
    console.error("Archive proxy error:", err.message);
    res.status(502).json({ error: "Failed to reach the Internet Archive" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true, hasKey: Boolean(RAWG_API_KEY) }));

app.listen(PORT, () => {
  console.log(`GameVault API proxy running on http://localhost:${PORT}`);
});
