import { useEffect, useRef, useState, useCallback } from "react";
import { theme as T } from "../../styles/theme";

const GRID = 20;
const CELL = 18;
const SIZE = GRID * CELL;
const TICK_MS = 110;

function randomCell(exclude) {
  let cell;
  do {
    cell = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (exclude.some((s) => s.x === cell.x && s.y === cell.y));
  return cell;
}

function readHighScore() {
  try {
    return Number(localStorage.getItem("gv-arcade-snake-high") || 0);
  } catch {
    return 0;
  }
}

function writeHighScore(v) {
  try {
    localStorage.setItem("gv-arcade-snake-high", String(v));
  } catch {
    /* best-effort only */
  }
}

/** An original Snake implementation — no assets or code borrowed from any existing game. */
export default function SnakeGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(readHighScore);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);

  const reset = useCallback(() => {
    const snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    stateRef.current = {
      snake,
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: randomCell(snake),
    };
    setScore(0);
    setGameOver(false);
    setRunning(true);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    function onKey(e) {
      const s = stateRef.current;
      if (!s) return;
      const map = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
      };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      // Can't reverse directly into yourself
      if (next.x === -s.dir.x && next.y === -s.dir.y) return;
      s.nextDir = next;
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!running) return;
    const ctx = canvasRef.current.getContext("2d");

    const timer = setInterval(() => {
      const s = stateRef.current;
      s.dir = s.nextDir;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

      const hitWall = head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID;
      const hitSelf = s.snake.some((seg) => seg.x === head.x && seg.y === head.y);
      if (hitWall || hitSelf) {
        setRunning(false);
        setGameOver(true);
        setScore((sc) => {
          if (sc > highScore) {
            setHighScore(sc);
            writeHighScore(sc);
          }
          return sc;
        });
        return;
      }

      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.food = randomCell(s.snake);
        setScore((sc) => sc + 10);
      } else {
        s.snake.pop();
      }

      // Draw
      ctx.fillStyle = T.surface;
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.strokeStyle = T.border;
      for (let i = 0; i <= GRID; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(SIZE, i * CELL); ctx.stroke();
      }
      ctx.fillStyle = T.pink;
      ctx.beginPath();
      ctx.arc(s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL / 2.6, 0, Math.PI * 2);
      ctx.fill();
      s.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? T.cyan : T.purple;
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      });
    }, TICK_MS);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ display: "flex", gap: 24, fontSize: 14, color: T.textSec }}>
        <span>Score: <strong style={{ color: T.cyan }}>{score}</strong></span>
        <span>Best: <strong style={{ color: T.orange }}>{Math.max(score, highScore)}</strong></span>
      </div>

      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          style={{ borderRadius: 10, border: `1px solid ${T.border}`, display: "block" }}
        />
        {gameOver && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12,
            background: "rgba(4,6,13,0.85)", borderRadius: 10,
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>Game Over</div>
            <div style={{ fontSize: 13, color: T.textSec }}>Score: {score}</div>
            <button
              onClick={reset}
              style={{
                padding: "10px 24px", borderRadius: 8, border: "none",
                background: `linear-gradient(135deg, ${T.cyan}, #0099CC)`,
                color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer",
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: T.textMuted }}>Arrow keys or WASD to move</p>
    </div>
  );
}
