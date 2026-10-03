import { useEffect, useState } from "react";
import { Gamepad2 } from "lucide-react";
import "./Intro.css";

// Total on-screen time of the opening sequence (ms). The CSS timeline in
// Intro.css is authored against these numbers — change them together.
const FADE_AT = 5300;
const END_AT = 5800;

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 53) % 100,
  y: (i * 37 + (i % 7) * 11) % 100,
  s: 1 + (i % 3),
  d: ((i * 17) % 30) / 10,
}));

/** Cinematic "studio logo" opening shown on every app load. Click, Enter, Space or Esc skips it. */
export default function Intro() {
  const [phase, setPhase] = useState("play"); // play | leave | done

  useEffect(() => {
    if (phase === "done") return undefined;
    const t1 = setTimeout(() => setPhase("leave"), FADE_AT);
    const t2 = setTimeout(() => setPhase("done"), END_AT);
    const skip = (e) => {
      if (e.type === "keydown" && !["Enter", "Space", "Escape"].includes(e.code)) return;
      setPhase("done");
    };
    window.addEventListener("keydown", skip);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("keydown", skip); };
  }, [phase === "done"]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === "done") return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`intro${phase === "leave" ? " leave" : ""}`} role="dialog" aria-label="GameVault intro" onClick={() => setPhase("done")}>
      <div className="intro-stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <i key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />
        ))}
      </div>
      <div className="intro-beam" aria-hidden="true" />

      <div className="intro-center">
        <div className="intro-mark"><Gamepad2 size={64} strokeWidth={1.6} /></div>
        <h1 className="intro-title" aria-label="GameVault">
          {"GAMEVAULT".split("").map((c, i) => (
            <span key={i} style={{ animationDelay: `${1.5 + i * 0.07}s` }}>{c}</span>
          ))}
        </h1>
        <div className="intro-sweep" aria-hidden="true" />
        <p className="intro-tag">Play anything. Everywhere. Free.</p>
      </div>

      <div className="intro-credit">
        <span className="intro-presents">A GameVault production</span>
        <span className="intro-founder-label">Founded by</span>
        <span className="intro-founder">M. Ayan Waris</span>
      </div>

      <button className="intro-skip" onClick={(e) => { e.stopPropagation(); setPhase("done"); }}>Skip ›</button>
      <div className="intro-progress" aria-hidden="true"><i /></div>
    </div>
  );
}
