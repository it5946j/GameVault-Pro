import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Users, Crown, Play, Lock } from "lucide-react";
import { theme as T } from "../styles/theme";
import { GENRE_META } from "../data/genreMeta";
import { fmt } from "../utils/format";
import { fetchGameDetail, fetchGameScreenshots } from "../api/rawg";
import { mapRawgGame } from "../utils/mapRawgGame";
import StarRating from "../components/Common/StarRating";
import TierBadge from "../components/Common/TierBadge";

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

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

  if (loading) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center", color: T.textMuted }}>
        <p>Loading game…</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center", color: T.red }}>
        <p style={{ marginBottom: 16 }}>Couldn't load this game. {error}</p>
        <button onClick={() => navigate("/library")} style={{ color: T.cyan, background: "none", border: "none", cursor: "pointer" }}>
          ← Back to Library
        </button>
      </div>
    );
  }

  const meta = GENRE_META[game.genre] || GENRE_META.Action;
  const tierLabels = ["Basic (Free)", "Pro Required", "Ultimate Required"];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 80px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: T.textSec, cursor: "pointer", fontSize: 13, marginBottom: 20 }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Hero image */}
      <div
        style={{
          height: 320,
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 24,
          position: "relative",
          background: game.background_image ? `url(${game.background_image}) center/cover` : `linear-gradient(135deg, ${meta.bg}, ${T.card})`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,9,15,0.9) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", bottom: 24, left: 28, right: 28 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {game.isHot && <span style={{ fontSize: 10, fontWeight: 800, background: "#DC2626", color: "#fff", padding: "3px 8px", borderRadius: 4 }}>🔥 HOT</span>}
            {game.isNew && <span style={{ fontSize: 10, fontWeight: 800, background: T.green, color: "#000", padding: "3px 8px", borderRadius: 4 }}>✨ NEW</span>}
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: "#fff" }}>{game.title}</h1>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: meta.color, background: meta.bg + "88", padding: "4px 12px", borderRadius: 20 }}>{game.genre}</span>
        <TierBadge tier={game.tier} />
        <StarRating rating={game.rating} />
        <span style={{ fontSize: 12, color: T.textSec, display: "flex", alignItems: "center", gap: 4 }}>
          <Users size={12} /> {fmt(game.players)} players
        </span>
      </div>

      <p style={{ fontSize: 15, color: T.textSec, lineHeight: 1.8, marginBottom: 32 }}>{game.desc}</p>

      {screenshots.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 14 }}>Screenshots</h3>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
            {screenshots.slice(0, 8).map((s) => (
              <img
                key={s.id}
                src={s.image}
                alt={`${game.title} screenshot`}
                style={{ height: 160, borderRadius: 10, flexShrink: 0, border: `1px solid ${T.border}` }}
              />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Rating", value: `${game.rating}/5`, icon: <Star size={16} color={T.gold} /> },
          { label: "Players", value: fmt(game.players), icon: <Users size={16} color={T.cyan} /> },
          { label: "Access", value: tierLabels[game.tier], icon: <Crown size={16} color={T.purple} /> },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              {icon}
              <span style={{ fontSize: 11, color: T.textMuted }}>{label}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{value}</div>
          </div>
        ))}
      </div>

      {game.tier === 0 ? (
        <button
          style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: 12,
            border: "none",
            background: `linear-gradient(135deg, ${T.cyan}, #0099CC)`,
            color: "#000",
            fontWeight: 800,
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Play size={20} fill="#000" stroke="#000" /> Play Now — Free
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 16, borderRadius: 12, border: `1px solid ${game.tier === 1 ? T.cyan : T.purple}44`, background: game.tier === 1 ? T.cyanDim : T.purpleDim, display: "flex", alignItems: "center", gap: 10 }}>
            <Lock size={18} color={game.tier === 1 ? T.cyan : T.purple} />
            <span style={{ fontSize: 14, color: T.textSec }}>
              This game requires a <strong style={{ color: game.tier === 1 ? T.cyan : T.purple }}>{game.tier === 1 ? "Pro" : "Ultimate"}</strong> subscription.
            </span>
          </div>
          <button
            onClick={() => navigate("/plans")}
            style={{
              width: "100%",
              padding: "16px 0",
              borderRadius: 12,
              border: "none",
              background: game.tier === 1 ? `linear-gradient(135deg, ${T.cyan}, #0099CC)` : `linear-gradient(135deg, ${T.purple}, #5B21B6)`,
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Crown size={20} /> Upgrade to {game.tier === 1 ? "Pro" : "Ultimate"}
          </button>
        </div>
      )}
    </div>
  );
}
