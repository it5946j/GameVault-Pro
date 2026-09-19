// ─────────────────────────────────────────────
// GameVault API Proxy
// ─────────────────────────────────────────────
// This is the ONLY place the RAWG API key is ever read. The frontend
// (src/api/rawg.js) calls these routes via relative /api/* paths and never
// sees the key. Set RAWG_API_KEY in server/.env (see .env.example).
// ─────────────────────────────────────────────
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

// dotenv.config() with no path defaults to reading ".env" from
// process.cwd(), which is the project root when run via `npm run server`
// — not this server/ directory. Resolve it relative to this file instead
// so `server/.env` (as the README instructs) is always the one that loads.
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env") });

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
app.get("/api/games/:id/stores", (req, res) => proxyToRawg(`/games/${req.params.id}/stores`, req.query, res));
app.get("/api/stores", (req, res) => proxyToRawg("/stores", req.query, res));
app.get("/api/genres", (req, res) => proxyToRawg("/genres", req.query, res));
app.get("/api/platforms/lists/parents", (req, res) => proxyToRawg("/platforms/lists/parents", req.query, res));

app.get("/api/health", (_req, res) => res.json({ ok: true, hasKey: Boolean(RAWG_API_KEY) }));

app.listen(PORT, () => {
  console.log(`GameVault API proxy running on http://localhost:${PORT}`);
});
