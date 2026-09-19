import { useState } from "react";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { theme as T } from "../styles/theme";
import SnakeGame from "../components/Arcade/SnakeGame";
import Game2048 from "../components/Arcade/Game2048";

const GAMES = [
  {
    id: "snake",
    title: "Neon Snake",
    emoji: "🐍",
    color: T.cyan,
    desc: "Classic snake — grow longer, don't hit yourself or the walls.",
    Component: SnakeGame,
  },
  {
    id: "2048",
    title: "Merge 2048",
    emoji: "🔢",
    color: T.purple,
    desc: "Slide tiles, merge matching numbers, try to reach 2048.",
    Component: Game2048,
  },
];

/**
 * Real, actually-playable games — original implementations built for
 * GameVault, not licensed content. This is deliberately separate from the
 * RAWG-backed catalog (Library/Marketplace/Home), which is browse-only:
 * GameVault has no rights to let anyone play those commercial titles.
 */
export default function Arcade() {
  const [active, setActive] = useState(null);
  const activeGame = GAMES.find((g) => g.id === active);

  return (
    <section style={{ padding: "100px 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: T.greenDim, border: `1px solid ${T.green}30`,
          borderRadius: 20, padding: "4px 12px",
          fontSize: 11, color: T.green, fontWeight: 700, letterSpacing: 0.5, marginBottom: 10,
        }}>
          <Gamepad2 size={12} /> FREE & PLAYABLE RIGHT NOW
        </div>
        <h1 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 800, color: T.text, fontFamily: T.fontDisplay }}>
          GameVault Arcade
        </h1>
        <p style={{ fontSize: 13.5, color: T.textSec, marginTop: 8, maxWidth: 640, lineHeight: 1.6 }}>
          The catalog you browse elsewhere on GameVault (Library, Store, Home) is real game
          data for discovery — GameVault doesn't hold distribution rights to those titles, so
          they aren't playable here. The games below are different: original, built for
          GameVault, and actually playable in your browser right now, free.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {activeGame ? (
          <motion.div
            key="player"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button
              onClick={() => setActive(null)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "none", border: "none", color: T.cyan,
                fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 20, padding: 0,
              }}
            >
              <ArrowLeft size={15} /> Back to Arcade
            </button>
            <div style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 16, padding: 28, display: "flex",
              flexDirection: "column", alignItems: "center",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 20 }}>
                {activeGame.emoji} {activeGame.title}
              </h2>
              <activeGame.Component />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}
          >
            {GAMES.map((g) => (
              <motion.button
                key={g.id}
                onClick={() => setActive(g.id)}
                whileHover={{ y: -4, borderColor: g.color }}
                whileTap={{ scale: 0.98 }}
                style={{
                  textAlign: "left", cursor: "pointer",
                  background: T.card, border: `1px solid ${T.border}`,
                  borderRadius: 14, padding: 20,
                  display: "flex", flexDirection: "column", gap: 10,
                  transition: "border-color 0.2s",
                }}
              >
                <span style={{ fontSize: 34 }}>{g.emoji}</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: T.text, fontFamily: T.fontDisplay }}>{g.title}</h3>
                <p style={{ fontSize: 12.5, color: T.textSec, lineHeight: 1.5 }}>{g.desc}</p>
                <span style={{ fontSize: 12, fontWeight: 700, color: g.color, marginTop: 4 }}>Play Now →</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
