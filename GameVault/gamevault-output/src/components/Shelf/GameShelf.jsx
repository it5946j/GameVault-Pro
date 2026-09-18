import { useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { theme as T } from "../../styles/theme";
import { useGameList } from "../../hooks/useGameList";
import GameCard from "../GameCard/GameCard";
import GameModal from "../GameModal/GameModal";
import { GameCardSkeleton } from "../Loading/Loading";

/**
 * Steam-style horizontal "shelf" row of games — a titled rail with scroll
 * arrows and a "See all" link. Used to stack up multiple game rails
 * (Special Offers, Top Sellers, New Releases, ...) on the store front the
 * way Steam's store page does, all fed by the same RAWG-backed fetchers
 * the rest of the app already uses.
 *
 * @param {(page:number, pageSize:number) => Promise<any>} fetcher
 * @param {(games:any[]) => any[]} [postProcess] - client-side filter/sort applied to the mapped page (e.g. keep only discounted games)
 */
export default function GameShelf({
  title,
  eyebrow,
  icon: Icon,
  accentColor = T.cyan,
  fetcher,
  pageSize = 16,
  viewAllTo,
  postProcess,
  cardWidth = 200,
}) {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { games, loading, error } = useGameList(fetcher, [], pageSize);

  const shownGames = useMemo(() => {
    const list = postProcess ? postProcess(games) : games;
    return list;
  }, [games, postProcess]);

  const updateScrollBtns = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (cardWidth + 14) * 3, behavior: "smooth" });
  };

  if (!loading && !error && shownGames.length === 0) return null;

  return (
    <section style={{ padding: "0 0 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          {eyebrow && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}30`,
              borderRadius: 20, padding: "3px 10px",
              fontSize: 10, color: accentColor, fontWeight: 700,
              letterSpacing: 0.5, marginBottom: 6,
            }}>
              {Icon && <Icon size={11} />} {eyebrow}
            </div>
          )}
          <h2 style={{ fontSize: 19, fontWeight: 800, color: T.text, fontFamily: T.fontDisplay }}>
            {title}
          </h2>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!loading && shownGames.length > 0 && (
            <>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => scroll(-1)}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  background: T.card,
                  color: canScrollLeft ? T.text : T.textMuted,
                  cursor: canScrollLeft ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <ChevronLeft size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => scroll(1)}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  background: T.card,
                  color: canScrollRight ? T.text : T.textMuted,
                  cursor: canScrollRight ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <ChevronRight size={16} />
              </motion.button>
            </>
          )}
          {viewAllTo && (
            <motion.button
              whileHover={{ x: 3 }}
              onClick={() => navigate(viewAllTo)}
              style={{
                fontSize: 12.5, color: accentColor,
                background: "none", border: "none",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
                fontWeight: 600, padding: "6px 0 6px 4px",
              }}
            >
              See all <ChevronRight size={13} />
            </motion.button>
          )}
        </div>
      </div>

      {error && (
        <p style={{ color: T.red, fontSize: 13, padding: "10px 0" }}>Couldn't load this row right now.</p>
      )}

      {loading ? (
        <div className="game-shelf-track" style={{ display: "flex", gap: 14, overflow: "hidden" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ minWidth: cardWidth, maxWidth: cardWidth, flexShrink: 0 }}>
              <GameCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={trackRef}
          onScroll={updateScrollBtns}
          className="game-shelf-track"
          style={{
            display: "flex",
            gap: 14,
            overflowX: "auto",
            paddingBottom: 6,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {shownGames.map((g) => (
            <div key={g.id} style={{ minWidth: cardWidth, maxWidth: cardWidth, flexShrink: 0 }}>
              <GameCard game={g} onClick={setSelectedGame} />
            </div>
          ))}
        </div>
      )}

      {selectedGame && <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />}

      <style>{`.game-shelf-track::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
