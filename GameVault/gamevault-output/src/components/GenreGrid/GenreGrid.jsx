import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { theme as T } from "../../styles/theme";
import { GENRE_META } from "../../data/genreMeta";
import { useGameFilters } from "../../contexts/GameFilterContext";
import { revealStagger } from "../../animations/scrollEffects";
import "./GenreGrid.css";

export default function GenreGrid() {
  const navigate = useNavigate();
  const { setGenre } = useGameFilters();
  const gridRef = useRef(null);

  useEffect(() => {
    revealStagger(gridRef.current, ".genre-tile");
  }, []);

  return (
    <section style={{ padding: "0 24px 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: T.greenDim,
            border: `1px solid ${T.green}30`,
            borderRadius: 20, padding: "4px 12px",
            fontSize: 11, color: T.green, fontWeight: 700,
            letterSpacing: 0.5, marginBottom: 10,
          }}>
            🎮 BROWSE BY GENRE
          </div>
          <h2 style={{
            fontSize: "clamp(24px, 3.5vw, 36px)",
            fontWeight: 800, color: T.text,
            fontFamily: T.fontDisplay, letterSpacing: -0.5,
          }}>
            Find Your Style
          </h2>
        </div>

        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          {Object.entries(GENRE_META).map(([name, meta]) => (
            <motion.button
              key={name}
              className="genre-tile"
              onClick={() => { setGenre(name); navigate("/library"); }}
              whileHover={{
                scale: 1.04,
                borderColor: meta.color,
                boxShadow: `0 0 20px ${meta.color}30`,
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: "18px 12px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                textAlign: "center",
                transition: "border-color 0.2s, box-shadow 0.2s",
                color: T.text,
              }}
            >
              <span style={{ fontSize: 28 }}>{meta.emoji || "🎮"}</span>
              <div>
                <div style={{
                  fontSize: 12, fontWeight: 700,
                  color: meta.color || T.text,
                  fontFamily: T.fontDisplay,
                  letterSpacing: -0.2,
                }}>
                  {name}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
