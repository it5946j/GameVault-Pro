import { useEffect, useRef, useState } from "react";
import { theme as T } from "../../styles/theme";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(null);

  // Only show on non-touch devices
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onHoverIn = (e) => {
      if (e.target.closest("a,button,[role=button]")) setHovering(true);
    };
    const onHoverOut = (e) => {
      if (e.target.closest("a,button,[role=button]")) setHovering(false);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onHoverIn);
    document.addEventListener("mouseout", onHoverOut);

    // RAF loop for smooth ring trailing
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%) scale(${clicking ? 0.7 : hovering ? 1.7 : 1})`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onHoverIn);
      document.removeEventListener("mouseout", onHoverOut);
      cancelAnimationFrame(raf.current);
    };
  }, [clicking, hovering]);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: clicking ? 6 : 8,
          height: clicking ? 6 : 8,
          borderRadius: "50%",
          background: T.cyan,
          boxShadow: `0 0 10px ${T.cyan}, 0 0 20px ${T.cyanGlow}`,
          pointerEvents: "none",
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s, width 0.1s, height 0.1s",
          mixBlendMode: "screen",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: `1.5px solid ${hovering ? T.purple : T.cyan}`,
          opacity: visible ? (hovering ? 0.7 : 0.4) : 0,
          pointerEvents: "none",
          zIndex: 9998,
          transition: "opacity 0.2s, border-color 0.3s, transform 0.1s ease-out",
          mixBlendMode: "screen",
        }}
      />
      <style>{`
        @media (hover: none) { .custom-cursor-dot, .custom-cursor-ring { display: none; } }
        @media (min-width: 1px) { * { cursor: none !important; } }
        @media (hover: none) { * { cursor: auto !important; } }
      `}</style>
    </>
  );
}
