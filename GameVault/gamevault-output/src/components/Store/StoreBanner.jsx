import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Play } from "lucide-react";
import { theme as T } from "../../styles/theme";
import { GENRE_META } from "../../data/genreMeta";
import { fetchPopular } from "../../api/rawg";
import { useGameList } from "../../hooks/useGameList";
import PriceTag from "../Common/PriceTag";
import GameModal from "../GameModal/GameModal";

const ROTATE_MS = 6500;

/**
 * Big auto-rotating hero banner for the top of the store front (Steam's
 * "featured & recommended" carousel). Pulls a handful of highly-rated
 * live RAWG games and cycles through them with full-bleed art + a CTA.
 */
export default function StoreBanner() {
  const { games, loading } = useGameList(fetchPopular, [], 12);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const slides = useMemo(
    () => games.filter((g) => g.background_image).slice(0, 6),
    [games]
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  if (loading) {
    return (
      <div className="skeleton-pulse" style={{
        height: 420, borderRadius: 18,
        background: T.card, border: `1px solid ${T.border}`,
        marginBottom: 8,
      }} />
    );
  }

  if (!slides.length) return null;

  const game = slides[index % slides.length];
  const meta = GENRE_META[game.genre] || GENRE_META.Action;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "relative",
        height: 420,
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${T.border}`,
        marginBottom: 8,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={game.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <img
            src={game.background_image}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(90deg, rgba(4,6,13,0.96) 0%, rgba(4,6,13,0.55) 45%, rgba(4,6,13,0.15) 75%), linear-gradient(to top, rgba(4,6,13,0.9) 0%, transparent 40%)`,
          }} />

          <div style={{
            position: "absolute", left: 0, bottom: 0, top: 0,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            padding: "0 40px 40px", maxWidth: 560,
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(0,212,255,0.12)",
              border: `1px solid ${T.cyan}40`,
              borderRadius: 20, padding: "4px 12px",
              fontSize: 11, color: T.cyan, fontWeight: 700,
              letterSpacing: 0.5, marginBottom: 14, width: "fit-content",
            }}>
              ⭐ FEATURED & RECOMMENDED
            </div>

            <h1 style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800, color: "#fff",
              fontFamily: T.fontDisplay, letterSpacing: -0.5,
              marginBottom: 12, lineHeight: 1.1,
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}>
              {game.title}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: meta.color, background: `${meta.color}22`,
                border: `1px solid ${meta.color}40`,
                padding: "3px 10px", borderRadius: 20,
              }}>
                {game.genre}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: T.orange, fontSize: 13, fontWeight: 700 }}>
                <Star size={13} fill={T.orange} stroke={T.orange} /> {game.rating?.toFixed(1)}
              </span>
            </div>

            <p style={{
              fontSize: 13.5, color: "rgba(255,255,255,0.8)",
              lineHeight: 1.6, marginBottom: 22,
              overflow: "hidden", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>
              {game.desc}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: `0 0 24px ${T.cyanGlow}` }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedGame(game)}
                style={{
                  padding: "13px 26px", borderRadius: 10,
                  border: "none",
                  background: `linear-gradient(135deg, ${T.cyan}, #0099CC)`,
                  color: "#000", fontWeight: 800, fontSize: 14,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <Play size={16} fill="#000" stroke="#000" />
                View Game
              </motion.button>
              <PriceTag game={game} size="lg" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot nav */}
      {slides.length > 1 && (
        <div style={{
          position: "absolute", right: 24, bottom: 24,
          display: "flex", gap: 8, zIndex: 2,
        }}>
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.title}`}
              style={{
                width: i === index ? 22 : 8, height: 8, borderRadius: 4,
                border: "none", cursor: "pointer",
                background: i === index ? T.cyan : "rgba(255,255,255,0.35)",
                transition: "width 0.25s, background 0.25s",
              }}
            />
          ))}
        </div>
      )}

      {selectedGame && <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />}
    </div>
  );
}
