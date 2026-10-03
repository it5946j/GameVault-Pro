import { useCallback, useEffect, useState } from "react";
import { theme as T } from "../../styles/theme";

const SIZE = 4;

const TILE_COLORS = {
  2: "#1A2640", 4: "#243350", 8: "#0EA5E9", 16: "#00D4FF",
  32: "#8B5CF6", 64: "#A855F7", 128: "#EC4899", 256: "#F59E0B",
  512: "#F97316", 1024: "#10B981", 2048: "#FACC15",
};

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function addRandomTile(board) {
  const empty = [];
  board.forEach((row, y) => row.forEach((v, x) => { if (!v) empty.push({ x, y }); }));
  if (!empty.length) return board;
  const { x, y } = empty[Math.floor(Math.random() * empty.length)];
  const next = board.map((r) => [...r]);
  next[y][x] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

// Slides + merges one row toward index 0; returns [newRow, gained, moved]
function collapseRow(row) {
  const nums = row.filter((v) => v);
  const out = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === nums[i + 1]) {
      out.push(nums[i] * 2);
      gained += nums[i] * 2;
      i++;
    } else {
      out.push(nums[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  const moved = out.some((v, i) => v !== row[i]);
  return [out, gained, moved];
}

function move(board, dir) {
  // Normalize to "move left" by rotating, collapsing, rotating back.
  let rows = board.map((r) => [...r]);
  const rotate = (b) => b[0].map((_, x) => b.map((r) => r[x]));
  if (dir === "up") rows = rotate(rows);
  if (dir === "down") rows = rotate(rows).map((r) => [...r].reverse());
  if (dir === "right") rows = rows.map((r) => [...r].reverse());

  let gained = 0, moved = false;
  const collapsed = rows.map((row) => {
    const [out, g, m] = collapseRow(row);
    gained += g; moved = moved || m;
    return out;
  });

  let result = collapsed;
  if (dir === "up") result = rotate(collapsed);
  if (dir === "down") result = rotate(collapsed.map((r) => [...r].reverse()));
  if (dir === "right") result = collapsed.map((r) => [...r].reverse());

  return { board: result, gained, moved };
}

function canMove(board) {
  for (const dir of ["left", "right", "up", "down"]) {
    if (move(board, dir).moved) return true;
  }
  return false;
}

export default function Game2048() {
  const [board, setBoard] = useState(() => addRandomTile(addRandomTile(emptyBoard())));
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);

  const reset = useCallback(() => {
    setBoard(addRandomTile(addRandomTile(emptyBoard())));
    setScore(0);
    setOver(false);
    setWon(false);
  }, []);

  useEffect(() => {
    function onKey(e) {
      const dirMap = {
        ArrowLeft: "left", a: "left", A: "left",
        ArrowRight: "right", d: "right", D: "right",
        ArrowUp: "up", w: "up", W: "up",
        ArrowDown: "down", s: "down", S: "down",
      };
      const dir = dirMap[e.key];
      if (!dir || over) return;
      e.preventDefault();
      setBoard((prev) => {
        const { board: next, gained, moved } = move(prev, dir);
        if (!moved) return prev;
        setScore((sc) => sc + gained);
        const withTile = addRandomTile(next);
        if (withTile.some((row) => row.includes(2048))) setWon(true);
        if (!canMove(withTile)) setOver(true);
        return withTile;
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [over]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ display: "flex", gap: 24, fontSize: 14, color: T.textSec }}>
        <span>Score: <strong style={{ color: T.cyan }}>{score}</strong></span>
        {won && <span style={{ color: T.green, fontWeight: 700 }}>You made 2048! 🎉</span>}
      </div>

      <div style={{ position: "relative" }}>
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${SIZE}, 76px)`, gap: 8,
          background: T.surface2, padding: 8, borderRadius: 10, border: `1px solid ${T.border}`,
        }}>
          {board.flat().map((v, i) => (
            <div key={i} style={{
              width: 76, height: 76, borderRadius: 8,
              background: v ? TILE_COLORS[v] || T.gold : T.surface,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: v >= 1000 ? 20 : 24, fontWeight: 800,
              color: v <= 4 ? T.textSec : "#0A0E18",
              transition: "background 0.1s",
            }}>
              {v || ""}
            </div>
          ))}
        </div>

        {over && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12,
            background: "rgba(4,6,13,0.85)", borderRadius: 10,
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>No More Moves</div>
            <div style={{ fontSize: 13, color: T.textSec }}>Score: {score}</div>
            <button
              onClick={reset}
              style={{
                padding: "10px 24px", borderRadius: 8, border: "none",
                background: `linear-gradient(135deg, ${T.cyan}, #0099CC)`,
                color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: T.textMuted }}>Arrow keys or WASD to slide tiles</p>
    </div>
  );
}
