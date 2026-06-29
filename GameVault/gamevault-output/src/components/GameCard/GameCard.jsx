import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Lock, Users, Star, Heart, Eye } from "lucide-react";
import { theme as T } from "../../styles/theme";
import { GENRE_META } from "../../data/genreMeta";
import { fmt } from "../../utils/format";
import GameThumb from "./GameThumb";
import StarRating from "../Common/StarRating";
import "./GameCard.css";

const GameCard = memo(function GameCard({ game, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const genreMeta = GENRE_META[game.genre] || {};

  function handleWishlist(e) {
    e.stopPropagation();
    setWishlisted(w => !w);
  }

  return (
    <motion.article
      onClick={() => onClick(game)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{
        background: T.card,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        boxShadow: hovered
          ? `0 16px 48px rgba(0,0,0,0.5), 0 0 24px ${T.purpleGlow}`
          : "0 2px 12px rgba(0,0,0,0.3)",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${game.title}`}
      onKeyDown={e => e.key === "Enter" && onClick(game)}
      className="game-card"
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <motion.div
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <GameThumb game={game} />
        </motion.div>

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(15,26,46,0.9) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />

        {/* Tier lock */}
        {game.tier > 0 && (
          <div style={{
            position: "absolute", top: 8, left: 8,
            width: 28, height: 28, borderRadius: 8,
            background: "rgba(8,13,26,0.85)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${game.tier === 2 ? T.purple : T.cyan}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lock size={12} color={game.tier === 2 ? T.purple : T.cyan} />
          </div>
        )}

        {/* Badges */}
        <div style={{
          position: "absolute", top: 8, right: 8,
          display: "flex", gap: 4, flexDirection: "column", alignItems: "flex-end",
        }}>
          {game.isHot && (
            <span style={{
              fontSize: 9, fontWeight: 800,
              background: "rgba(239,68,68,0.9)",
              backdropFilter: "blur(6px)",
              color: "#fff", padding: "2px 7px", borderRadius: 4,
            }}>🔥 HOT</span>
          )}
          {game.isNew && (
            <span style={{
              fontSize: 9, fontWeight: 800,
              background: "rgba(16,185,129,0.9)",
              backdropFilter: "blur(6px)",
              color: "#000", padding: "2px 7px", borderRadius: 4,
            }}>✨ NEW</span>
          )}
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 10,
              }}
            >
              {/* Play */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${T.cyan}, #0099CC)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 24px ${T.cyanGlow}`,
                }}
              >
                <Play size={18} fill="#000" stroke="#000" />
              </motion.div>

              {/* Preview */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.04 }}
                style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(8,13,26,0.85)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Eye size={15} color={T.text} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist button (always visible, top right of card, below badges) */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          style={{
            position: "absolute",
            bottom: 8, right: 8,
            width: 30, height: 30,
            borderRadius: "50%",
            background: "rgba(8,13,26,0.85)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${wishlisted ? T.pink : T.border}`,
            color: wishlisted ? T.pink : T.textMuted,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 5,
            transition: "border-color 0.2s, color 0.2s",
          }}
        >
          <Heart size={13} fill={wishlisted ? T.pink : "none"} />
        </motion.button>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{
            fontSize: 13,
            fontWeight: 700,
            color: T.text,
            lineHeight: 1.3,
            flex: 1,
            marginRight: 8,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            fontFamily: T.fontDisplay,
          }}>
            {game.title}
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: genreMeta.color || T.cyan,
            background: `${(genreMeta.color || T.cyan)}18`,
            border: `1px solid ${(genreMeta.color || T.cyan)}25`,
            padding: "2px 8px", borderRadius: 20,
          }}>
            {game.genre}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Star size={11} fill={T.orange} stroke={T.orange} />
              <span style={{ fontSize: 11, fontWeight: 700, color: T.orange }}>
                {game.rating?.toFixed(1) || "4.5"}
              </span>
            </div>
            <span style={{ fontSize: 11, color: T.textMuted, display: "flex", alignItems: "center", gap: 2 }}>
              <Users size={10} />
              {fmt(game.players)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

export default GameCard;
