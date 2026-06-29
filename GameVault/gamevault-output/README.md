# GameVault

A multi-page gaming platform: live game data from the RAWG API, GSAP/Framer
Motion/Lenis animation, and a proper component architecture — built as a
phased restructure of the original single-file `GameVault.jsx` prototype.

## ⚠️ Status: Phase 1 (Premium Foundation)

This is **not** the full 40k–70k line platform described in the original
brief — it's the first real, working increment. What's built and what isn't:

**Done (Phase 1):**
- Full `src/` restructure (components, pages, hooks, contexts, animations, api, utils)
- Live RAWG API data (trending, library browse, search, genre/sort filters, game detail + screenshots)
- Express backend proxy so your RAWG key never reaches the browser
- GSAP entrance animations, Lenis inertia smooth-scroll, Framer Motion micro-interactions
- Cinematic homepage hero (nebula background, particles, aurora, mouse glow, parallax controller glyph)
- React Router multi-page routing (Home, Library, Game detail, Plans, Checkout, plus stub pages)

**Not built yet (later phases) — these pages render an honest "coming soon" placeholder, not fake data:**
- Marketplace (buy/sell/upload/reviews)
- Authentication (Google/Discord/Steam/GitHub/email)
- Dashboard, Profile, Settings (depend on auth)
- Stripe payments (Checkout page is a non-functional placeholder)
- Three.js / React Three Fiber 3D hero scene (current hero uses CSS/SVG for the cinematic effect; true R3F is a planned upgrade)
- Admin dashboard

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Get a RAWG API key
Sign up free at **https://rawg.io/apidocs** and copy your key.

### 3. Configure the backend proxy
```bash
cp server/.env.example server/.env
```
Open `server/.env` and paste your key:
```
RAWG_API_KEY=your_real_key_here
```
**Never commit `server/.env`** — it's already in `.gitignore`. The key only
ever lives on the server; the frontend calls `/api/*` and never sees it.

### 4. Run both the frontend and backend together
```bash
npm run dev:all
```
This starts the Express proxy on `:8080` and the Vite dev server on `:5173`
(which proxies `/api/*` to the backend — see `vite.config.js`).

Open **http://localhost:5173**.

Running them separately also works:
```bash
npm run server   # Express proxy, :8080
npm run dev       # Vite dev server, :5173
```

### 5. Verify the key is wired up
Visit `http://localhost:8080/api/health` — it should return `{"ok":true,"hasKey":true}`.
If `hasKey` is `false`, double check `server/.env`.

## Production build
```bash
npm run build      # outputs static frontend to dist/
npm run preview    # preview the production build locally
```
For a real deployment, run `server/index.js` as a long-lived Node process
(e.g. on Render, Railway, Fly.io, or a VPS) and serve `dist/` from the same
domain/path so the frontend's relative `/api/*` calls keep working — or set
`VITE_API_BASE_URL` to point at wherever the proxy is hosted.

## Project structure
```
src/
├── animations/     # GSAP, Lenis, scroll effects, parallax
├── api/            # RAWG client (talks to OUR backend, never RAWG directly)
├── components/     # Navbar, Hero, Featured, GameCard, GameModal, Footer, etc.
├── contexts/        # Shared search/filter state
├── data/            # Genre metadata, subscription plans
├── hooks/           # useGameList, useDebounce, useLiveCounter
├── pages/           # Home, Library, Game, Plans, Checkout, + Phase 2/3 stubs
├── styles/          # Theme tokens, global CSS
└── utils/           # RAWG -> app data mapper, formatters
server/
└── index.js         # Express proxy holding the RAWG key server-side
```

## Next steps (Phase 2 candidates)
- Marketplace (buy/sell/upload, reviews & ratings) — needs a real backend + DB, not just RAWG
- Auth (Firebase or Supabase, multi-provider sign-in)
- Stripe subscriptions wired into Checkout
- True React Three Fiber hero scene
- User dashboard backed by real entitlement data (replacing the placeholder tier-by-id logic in `utils/mapRawgGame.js`)
