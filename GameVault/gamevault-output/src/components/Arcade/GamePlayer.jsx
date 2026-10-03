import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, Maximize2 } from "lucide-react";
import { W, H } from "../../games/engines";

const GAME_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);

function readBest(key) {
  try { return Number(localStorage.getItem(`gv-best-${key}`)) || 0; } catch { return 0; }
}
function writeBest(key, v) {
  try { localStorage.setItem(`gv-best-${key}`, String(v)); } catch { /* storage unavailable */ }
}

/** Runs one of the built-in canvas games (see src/games) with start / pause / game-over UI. */
export default function GamePlayer({ original }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const statusRef = useRef("ready");
  const [status, setStatus] = useState("ready"); // ready | playing | paused | over
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => readBest(original.key));

  const setState = useCallback((s) => { statusRef.current = s; setStatus(s); }, []);

  const finish = useCallback(() => {
    const final = gameRef.current.score;
    setBest((b) => {
      if (final > b) { writeBest(original.key, final); return final; }
      return b;
    });
    setState("over");
  }, [original.key, setState]);

  const start = useCallback(() => {
    gameRef.current.reset();
    setScore(0);
    setState("playing");
  }, [setState]);

  const togglePause = useCallback(() => {
    if (statusRef.current === "playing") setState("paused");
    else if (statusRef.current === "paused") setState("playing");
  }, [setState]);

  // Create the game and run the loop
  useEffect(() => {
    const game = original.create();
    gameRef.current = game;
    setState("ready");
    setScore(0);
    setBest(readBest(original.key));

    const ctx = canvasRef.current.getContext("2d");
    let raf, last = performance.now(), lastShown = 0;
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (statusRef.current === "playing") {
        game.update(dt);
        if (game.score !== lastShown) { lastShown = game.score; setScore(game.score); }
        if (game.over) finish();
      }
      game.draw(ctx);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onHidden = () => { if (document.hidden && statusRef.current === "playing") setState("paused"); };
    document.addEventListener("visibilitychange", onHidden);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", onHidden); };
  }, [original, finish, setState]);

  // Keyboard
  useEffect(() => {
    const onKey = (down) => (e) => {
      if (e.target.closest?.("input, textarea, select")) return;
      if (GAME_KEYS.has(e.code)) e.preventDefault();
      const st = statusRef.current;
      if (down && (e.code === "Enter" || e.code === "Space") && (st === "ready" || st === "over")) { start(); return; }
      if (down && (e.code === "KeyP" || e.code === "Escape")) { togglePause(); return; }
      if (st === "playing") gameRef.current.keydown(e.code, down);
      else if (!down) gameRef.current.keydown(e.code, false);
    };
    const kd = onKey(true), ku = onKey(false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [start, togglePause]);

  // Pointer / touch
  const send = (type) => (e) => {
    if (statusRef.current !== "playing") return;
    const r = canvasRef.current.getBoundingClientRect();
    gameRef.current.pointer(type, ((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H);
  };
  const onDown = (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); send("down")(e); };

  function fullscreen() {
    const el = wrapRef.current;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el?.requestFullscreen?.();
  }

  return (
    <div className="player" ref={wrapRef}>
      <div className="player-bar">
        <span>Score <b>{score}</b></span>
        <span>Best <b>{best}</b></span>
        <span className="spacer" />
        <button onClick={togglePause} disabled={status !== "playing" && status !== "paused"} aria-label={status === "paused" ? "Resume" : "Pause"}>
          {status === "paused" ? <Play size={14} /> : <Pause size={14} />}
        </button>
        <button onClick={start} aria-label="Restart"><RotateCcw size={14} /></button>
        <button onClick={fullscreen} aria-label="Fullscreen"><Maximize2 size={14} /></button>
      </div>
      <div className="player-stage">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onPointerDown={onDown}
          onPointerMove={send("move")}
          onPointerUp={send("up")}
          aria-label={`${original.name} game canvas`}
        />
        {status !== "playing" && (
          <div className="player-overlay">
            {status === "ready" && (<>
              <h3>{original.name}</h3>
              <p>{original.tagline}</p>
              <button className="btn-green" onClick={start}><Play size={14} fill="#fff" /> Start game</button>
              <small>{original.controls}</small>
            </>)}
            {status === "paused" && (<>
              <h3>Paused</h3>
              <button className="btn-green" onClick={togglePause}><Play size={14} fill="#fff" /> Resume</button>
            </>)}
            {status === "over" && (<>
              <h3>Game over</h3>
              <p>Score <b>{score}</b>{score > 0 && score >= best ? " — new best!" : ` · Best ${best}`}</p>
              <button className="btn-green" onClick={start}><RotateCcw size={14} /> Play again</button>
            </>)}
          </div>
        )}
      </div>
    </div>
  );
}
