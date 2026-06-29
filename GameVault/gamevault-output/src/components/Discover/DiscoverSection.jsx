import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight, SlidersHorizontal } from "lucide-react";
import { theme as T } from "../../styles/theme";
import { fetchPopular, fetchNewReleases, fetchTrending } from "../../api/rawg";
import { useGameList } from "../../hooks/useGameList";
import { revealStagger } from "../../animations/scrollEffects";
import GameCard from "../GameCard/GameCard";
import GameModal from "../GameModal/GameModal";
import { GameCardSkeleton } from "../Loading/Loading";

const TABS = [
  { id: "popular", label: "Popular", fetcher: fetchPopular },
  { id: "new", label: "New Releases", fetcher: fetchNewReleases },
  { id: "trending", label: "Trending", fetcher: fetchTrending },
];

export default function DiscoverSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGame, setSelectedGame] = useState(null);

  const activeFetcher = TABS[activeTab].fetcher;
  const { games, loading } = useGameList(activeFetcher, [activeTab], 12);

  useEffect(() => {
    if (!loading && games.length) {
      revealStagger(gridRef.current, ".discover-card");
    }
  }, [loading, games.length, activeTab]);

  return (
    <section ref={sectionRef} style={{ padding: "0 24px 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: T.purpleDim,
              border: `1px solid ${T.purple}30`,
              borderRadius: 20, padding: "4px 12px",
              fontSize: 11, color: T.purple, fontWeight: 700,
              letterSpacing: 0.5, marginBottom: 10,
            }}>
              <Sparkles size={11} /> DISCOVER
            </div>
            <h2 style={{
              fontSize: "clamp(24px, 3.5vw, 36px)",
              fontWeight: 800,
              color: T.text,
              fontFamily: T.fontDisplay,
              letterSpacing: -0.5,
            }}>
              Find Your Next Game
            </h2>
          </div>

          <motion.button
            whileHover={{ x: 3 }}
            onClick={() => navigate("/library")}
            style={{
              fontSize: 13, color: T.cyan,
              background: "none", border: "none",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4,
              fontWeight: 600,
            }}
          >
            Browse all games <ChevronRight size={14} />
          </motion.button>
        </div>

        {/* Tab bar */}
        <div style={{
          display: "flex", gap: 6, marginBottom: 28,
          padding: "4px",
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          width: "fit-content",
        }}>
          {TABS.map((tab, i) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(i)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                background: activeTab === i
                  ? `linear-gradient(135deg, ${T.cyan}, #0099CC)`
                  : "transparent",
                color: activeTab === i ? "#000" : T.textSec,
                fontSize: 13, fontWeight: activeTab === i ? 800 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="discover-card">
                  <GameCardSkeleton />
                </div>
              ))
            : games.map((g) => (
                <div key={g.id} className="discover-card">
                  <GameCard game={g} onClick={setSelectedGame} />
                </div>
              ))
          }
        </div>

        {/* Load more */}
        {!loading && games.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${T.cyanGlow}` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/library")}
              style={{
                padding: "14px 48px",
                borderRadius: 12,
                border: `1px solid ${T.border}`,
                background: T.card,
                color: T.text,
                fontSize: 14, fontWeight: 700,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
              }}
            >
              Load more games
            </motion.button>
          </div>
        )}
      </div>

      {selectedGame && (
        <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </section>
  );
}
