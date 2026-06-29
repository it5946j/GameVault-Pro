import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Users, Crown, Play, Lock } from "lucide-react";
import { theme as T } from "../../styles/theme";
import { GENRE_META } from "../../data/genreMeta";
import { fmt } from "../../utils/format";
import StarRating from "../Common/StarRating";
import TierBadge from "../Common/TierBadge";

const TIER_LABELS = ["Basic (Free)", "Pro Required", "Ultimate Required"];

export default function GameModal({ game, onClose }) {
  if (!game) return null;
  const meta = GENRE_META[game.genre] || GENRE_META.Action;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(8px)",
          padding: 16,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            maxWidth: 640,
            width: "100%",
            overflow: "hidden",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              position: "relative",
              height: 220,
              background: game.background_image
                ? `url(${game.background_image}) center/cover`
                : `linear-gradient(135deg, ${meta.bg} 0%, ${T.card} 100%)`,
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,18,34,0.95) 0%, transparent 55%)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              {!game.background_image && <div style={{ fontSize: 64 }}>{meta.icon}</div>}
              <div style={{ display: "flex", gap: 8, marginTop: game.background_image ? "auto" : 0, marginBottom: game.background_image ? 16 : 0 }}>
                {game.isHot && <span style={{ fontSize: 10, fontWeight: 800, background: "#DC2626", color: "#fff", padding: "3px 8px", borderRadius: 4 }}>🔥 HOT</span>}
                {game.isNew && <span style={{ fontSize: 10, fontWeight: 800, background: T.green, color: "#000", padding: "3px 8px", borderRadius: 4 }}>✨ NEW</span>}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(0,0,0,0.5)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: T.text }}>{game.title}</h2>
              <TierBadge tier={game.tier} />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: meta.color, background: meta.bg + "88", padding: "4px 12px", borderRadius: 20 }}>
                {game.genre}
              </span>
              <StarRating rating={game.rating} />
              <span style={{ fontSize: 12, color: T.textSec, display: "flex", alignItems: "center", gap: 4 }}>
                <Users size={12} />
                {fmt(game.players)} players
              </span>
            </div>
            <p style={{ fontSize: 14, color: T.textSec, lineHeight: 1.7, marginBottom: 24 }}>{game.desc}</p>

            {game.platforms?.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                {game.platforms.slice(0, 6).map((p) => (
                  <span key={p} style={{ fontSize: 11, color: T.textMuted, border: `1px solid ${T.border}`, borderRadius: 6, padding: "3px 8px" }}>
                    {p}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Rating", value: `${game.rating}/5`, icon: <Star size={16} color={T.gold} /> },
                { label: "Players", value: fmt(game.players), icon: <Users size={16} color={T.cyan} /> },
                { label: "Access", value: TIER_LABELS[game.tier], icon: <Crown size={16} color={T.purple} /> },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    {icon}
                    <span style={{ fontSize: 11, color: T.textMuted }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{value}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            {game.tier === 0 ? (
              <button
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 10,
                  border: "none",
                  background: `linear-gradient(135deg, ${T.cyan}, #0099CC)`,
                  color: "#000",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Play size={18} fill="#000" stroke="#000" />
                Play Now — Free
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    border: `1px solid ${game.tier === 1 ? T.cyan : T.purple}44`,
                    background: game.tier === 1 ? T.cyanDim : T.purpleDim,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Lock size={16} color={game.tier === 1 ? T.cyan : T.purple} />
                  <span style={{ fontSize: 13, color: T.textSec }}>
                    This game requires a{" "}
                    <strong style={{ color: game.tier === 1 ? T.cyan : T.purple }}>{game.tier === 1 ? "Pro" : "Ultimate"}</strong> subscription.
                  </span>
                </div>
                <button
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    borderRadius: 10,
                    border: "none",
                    background: game.tier === 1 ? `linear-gradient(135deg, ${T.cyan}, #0099CC)` : `linear-gradient(135deg, ${T.purple}, #5B21B6)`,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Crown size={18} />
                  Upgrade to {game.tier === 1 ? "Pro" : "Ultimate"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
