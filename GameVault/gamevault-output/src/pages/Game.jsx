import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Play, ExternalLink } from "lucide-react";
import { fetchGameDetail, fetchGameScreenshots } from "../api/rawg";
import { findClassicByTitle, embedUrl } from "../api/archive";
import { mapRawgGame } from "../utils/mapRawgGame";
import { reviewLabel, steamDate, fmt } from "../utils/format";
import PriceBox from "../components/Common/PriceBox";
import Tags from "../components/Common/Tags";
import { BlockSkeleton } from "../components/Common/Skeletons";

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [shot, setShot] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setShot(0);
    window.scrollTo(0, 0);

    Promise.all([fetchGameDetail(id), fetchGameScreenshots(id).catch(() => ({ results: [] }))])
      .then(([detail, shots]) => {
        if (!active) return;
        setGame(mapRawgGame(detail));
        setScreenshots(shots?.results || []);
      })
      .catch((e) => active && setError(e?.message || "Failed to load game"))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [id]);

  // Opens the game in a separate tab: the Archive's full-page player when the
  // original is available there, else the official site, else our built-in game.
  // The tab is opened synchronously so popup blockers allow it.
  async function playInNewTab() {
    const tab = window.open("about:blank", "_blank");
    const match = await findClassicByTitle(game.title);
    const url = match ? embedUrl(match.id) : game.website || `${window.location.origin}/game/${game.id}/play`;
    if (tab) { tab.opener = null; tab.location.href = url; } else window.open(url, "_blank", "noopener");
  }

  if (loading) {
    return (
      <div className="store-wrap" style={{ paddingTop: 40 }}>
        <BlockSkeleton height={420} />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="store-wrap" style={{ padding: "80px 8px", textAlign: "center", color: "#c15755" }}>
        <p style={{ marginBottom: 16 }}>Couldn't load this game. {error}</p>
        <Link to="/library" style={{ color: "#67c1f5" }}>← Back to store</Link>
      </div>
    );
  }

  const review = reviewLabel(game.rating);
  const media = screenshots.length ? screenshots.map((s) => s.image) : game.background_image ? [game.background_image] : [];
  const description = game.descFull || game.desc;

  return (
    <div className="store-wrap">
      <div className="app-crumbs">
        <Link to="/">All Games</Link> &gt; <Link to="/library">{game.genre}</Link> &gt; {game.title}
      </div>
      <h1 className="app-title">{game.title}</h1>

      <div className="app-grid">
        <div>
          <div className="app-shot" style={media[shot] ? { backgroundImage: `url(${media[shot]})` } : undefined} />
          {media.length > 1 && (
            <div className="app-thumbs">
              {media.slice(0, 12).map((src, i) => (
                <button key={src} className={i === shot ? "on" : ""} aria-label={`Screenshot ${i + 1}`} style={{ backgroundImage: `url(${src})` }} onClick={() => setShot(i)} />
              ))}
            </div>
          )}
        </div>

        <div>
          {game.background_image && <div className="app-capsule" style={{ backgroundImage: `url(${game.background_image})` }} />}
          <p className="app-desc">{description.slice(0, 320)}{description.length > 320 ? "…" : ""}</p>
          <div className="app-kv">
            <span>ALL REVIEWS:</span>
            <span style={{ color: review.color }}>{review.text} ({fmt(game.players)} added)</span>
            <span>RELEASE DATE:</span>
            <span>{steamDate(game.released)}</span>
            {game.developers.length > 0 && (<><span>DEVELOPER:</span><span>{game.developers.join(", ")}</span></>)}
            {game.publishers.length > 0 && (<><span>PUBLISHER:</span><span>{game.publishers.join(", ")}</span></>)}
            {game.metacritic && (<><span>METACRITIC:</span><span>{game.metacritic}</span></>)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 10 }}><Tags game={game} max={8} /></div>
        </div>
      </div>

      <div className="buy-box">
        <h2>Play {game.title}</h2>
        <div className="buy-row">
          <PriceBox large />
          <button className="btn-green" onClick={() => navigate(`/game/${game.id}/play`)}><Play size={14} fill="#fff" /> Play now</button>
          <button className="btn-blue" onClick={playInNewTab}><ExternalLink size={14} /> Open in new tab</button>
        </div>
        <div className="buy-spacer" />
      </div>

      <div className="block">
        <h2>About this game</h2>
        <p>{description}</p>
      </div>

      {game.platforms.length > 0 && (
        <div className="block">
          <h2>Platforms</h2>
          <p>{game.platforms.join(" · ")}{game.esrb ? `  ·  Rated ${game.esrb}` : ""}</p>
        </div>
      )}
    </div>
  );
}
