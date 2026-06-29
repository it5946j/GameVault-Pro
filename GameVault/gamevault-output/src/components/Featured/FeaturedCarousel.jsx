import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ChevronRight, ChevronLeft, Star, Users, Play, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { theme as T } from "../../styles/theme";
import { fetchTrending } from "../../api/rawg";
import { useGameList } from "../../hooks/useGameList";
import { revealStagger } from "../../animations/scrollEffects";
import GameModal from "../GameModal/GameModal";

function FeaturedSkeleton() {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {[0,1,2,3].map(i => (
        <div key={i} className="skeleton-pulse" style={{
          minWidth: 280,
          height: 340,
          borderRadius: 16,
          background: T.card,
          border: `1px solid ${T.border}`,
          flexShrink: 0,
        }} />
      ))}
    </div>
  );
}

function FeaturedCard({ game, onClick }) {
  const [hovered, setHovered] = useState(false);
  const img = game.background_image;
  const rating = game.rating?.toFixed(1) || "N/A";
  const genre = game.genre || "Action";

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() => onClick(game)}
      style={{
        minWidth: 280,
        maxWidth: 280,
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        background: T.card,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        position: "relative",
        flexShrink: 0,
        boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${T.purpleGlow}` : "0 4px 20px rgba(0,0,0,0.3)",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", paddingTop: "62%", overflow: "hidden" }}>
        {img ? (
          <motion.img
            src={img}
            alt={game.title}
            loading="lazy"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${T.surface2}, ${T.card})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 48 }}>🎮</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(15,26,46,1) 0%, rgba(15,26,46,0.4) 50%, transparent 100%)",
        }} />

        {/* Badges */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {game.isHot && (
            <span style={{
              fontSize: 10, fontWeight: 800,
              background: "rgba(239,68,68,0.9)",
              color: "#fff", padding: "3px 8px", borderRadius: 4,
              backdropFilter: "blur(8px)",
            }}>🔥 HOT</span>
          )}
          {game.isNew && (
            <span style={{
              fontSize: 10, fontWeight: 800,
              background: "rgba(16,185,129,0.9)",
              color: "#000", padding: "3px 8px", borderRadius: 4,
              backdropFilter: "blur(8px)",
            }}>✨ NEW</span>
          )}
          {game.isFeatured && (
            <span style={{
              fontSize: 10, fontWeight: 800,
              background: `rgba(139,92,246,0.9)`,
              color: "#fff", padding: "3px 8px", borderRadius: 4,
              backdropFilter: "blur(8px)",
            }}>⭐ TOP</span>
          )}
        </div>

        {/* Genre */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span style={{
            fontSize: 10, fontWeight: 700,
            background: "rgba(8,13,26,0.85)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${T.border}`,
            color: T.cyan,
            padding: "3px 8px", borderRadius: 20,
          }}>
            {genre}
          </span>
        </div>

        {/* Hover play overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <motion.div
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.7 }}
                style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${T.cyan}, #0099CC)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 30px ${T.cyanGlow}`,
                }}
              >
                <Play size={20} fill="#000" stroke="#000" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <h3 style={{
          fontSize: 14, fontWeight: 700,
          color: T.text,
          marginBottom: 8,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontFamily: T.fontDisplay,
        }}>
          {game.title}
        </h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={12} fill={T.orange} stroke={T.orange} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.orange }}>{rating}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.textMuted }}>
            <Users size={11} />
            <span style={{ fontSize: 11 }}>{(game.players || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedCarousel() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { games, loading, error } = useGameList(fetchTrending, [], 16);

  const updateScrollBtns = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    if (!loading && games.length) {
      revealStagger(sectionRef.current, ".fc-wrap");
    }
  }, [loading, games.length]);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} style={{ padding: "0 0 80px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 28,
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `rgba(245,158,11,0.1)`,
              border: `1px solid rgba(245,158,11,0.2)`,
              borderRadius: 20, padding: "4px 12px",
              fontSize: 11, color: T.orange, fontWeight: 700,
              letterSpacing: 0.5, marginBottom: 8,
            }}>
              <TrendingUp size={12} /> TRENDING NOW
            </div>
            <h2 style={{
              fontSize: "clamp(22px, 3vw, 30px)",
              fontWeight: 800,
              color: T.text,
              fontFamily: T.fontDisplay,
              letterSpacing: -0.5,
            }}>
              Most Popular This Week
            </h2>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Scroll buttons */}
            {!loading && games.length > 0 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => scroll(-1)}
                  disabled={!canScrollLeft}
                  aria-label="Scroll left"
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.card,
                    color: canScrollLeft ? T.text : T.textMuted,
                    cursor: canScrollLeft ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <ChevronLeft size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => scroll(1)}
                  disabled={!canScrollRight}
                  aria-label="Scroll right"
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.card,
                    color: canScrollRight ? T.text : T.textMuted,
                    cursor: canScrollRight ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <ChevronRight size={18} />
                </motion.button>
              </>
            )}
            <motion.button
              whileHover={{ x: 3 }}
              onClick={() => navigate("/library")}
              style={{
                fontSize: 13, color: T.cyan,
                background: "none", border: "none",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
                fontWeight: 600, padding: "6px 0",
              }}
            >
              View all <ChevronRight size={14} />
            </motion.button>
          </div>
        </div>

        {error && (
          <p style={{ color: T.red, fontSize: 13, padding: "20px 0" }}>
            Couldn't load trending games right now. Check RAWG API config.
          </p>
        )}

        {loading ? (
          <FeaturedSkeleton />
        ) : (
          <div
            ref={trackRef}
            onScroll={updateScrollBtns}
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 8,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              cursor: "grab",
            }}
          >
            {games.map((g) => (
              <div key={g.id} className="fc-wrap">
                <FeaturedCard game={g} onClick={setSelectedGame} />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedGame && (
        <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
