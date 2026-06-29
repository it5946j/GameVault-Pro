import { useRef, useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Crown, Gamepad2, Zap, ChevronRight, Star } from "lucide-react";
import { theme as T } from "../../styles/theme";
import { gsap } from "../../animations/gsap";
import { initParallax, initMouseGlow } from "../../animations/parallax";
import { useLiveCounter } from "../../hooks/useLiveCounter";
import "./Hero.css";

// Deterministic particles so SSR-like environments don't flicker
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 5.1 + 3) % 100}%`,
  size: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5,
  duration: 8 + (i % 7) * 2,
  delay: (i * 0.8) % 12,
  color: i % 3 === 0 ? T.cyan : T.purple,
}));

const STATS = [
  { n: "15M+", l: "Games Available", color: T.cyan },
  { n: "2.4M", l: "Active Players", color: T.purple },
  { n: "4.8★", l: "Average Rating", color: T.orange },
  { n: "99.9%", l: "Uptime SLA", color: T.green },
];

// Hero game art composed of SVG elements — controller + floating game cards
const HeroArtwork = memo(() => (
  <div className="hero__artwork" aria-hidden="true">
    <svg viewBox="0 0 420 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glow aura */}
      <ellipse cx="210" cy="240" rx="180" ry="200" fill="url(#aura)" opacity="0.5" />
      {/* Controller body */}
      <rect x="60" y="160" width="300" height="180" rx="80" fill="url(#ctrlGrad)" />
      <rect x="60" y="160" width="300" height="180" rx="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {/* Left grip */}
      <ellipse cx="110" cy="320" rx="50" ry="60" fill="url(#ctrlGrad)" />
      {/* Right grip */}
      <ellipse cx="310" cy="320" rx="50" ry="60" fill="url(#ctrlGrad)" />
      {/* D-pad */}
      <rect x="100" y="210" width="12" height="36" rx="4" fill="rgba(0,212,255,0.6)" />
      <rect x="88" y="222" width="36" height="12" rx="4" fill="rgba(0,212,255,0.6)" />
      {/* ABXY buttons */}
      <circle cx="290" cy="218" r="9" fill="rgba(239,68,68,0.8)" />
      <circle cx="310" cy="235" r="9" fill="rgba(234,179,8,0.8)" />
      <circle cx="270" cy="235" r="9" fill="rgba(16,185,129,0.8)" />
      <circle cx="290" cy="252" r="9" fill="rgba(59,130,246,0.8)" />
      {/* Center buttons */}
      <rect x="185" y="228" width="22" height="12" rx="6" fill="rgba(255,255,255,0.12)" />
      <rect x="213" y="228" width="22" height="12" rx="6" fill="rgba(255,255,255,0.12)" />
      {/* Analog sticks */}
      <circle cx="152" cy="255" r="22" fill="rgba(0,0,0,0.5)" stroke="rgba(0,212,255,0.3)" strokeWidth="2" />
      <circle cx="152" cy="255" r="12" fill="rgba(0,212,255,0.3)" />
      <circle cx="268" cy="255" r="22" fill="rgba(0,0,0,0.5)" stroke="rgba(139,92,246,0.3)" strokeWidth="2" />
      <circle cx="268" cy="255" r="12" fill="rgba(139,92,246,0.3)" />
      {/* Floating mini cards */}
      <g transform="translate(280, 40) rotate(12)">
        <rect width="100" height="70" rx="10" fill="url(#card1)" />
        <rect width="100" height="70" rx="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <rect x="8" y="45" width="50" height="6" rx="3" fill="rgba(255,255,255,0.15)" />
        <rect x="8" y="55" width="35" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
      </g>
      <g transform="translate(30, 60) rotate(-8)">
        <rect width="90" height="65" rx="10" fill="url(#card2)" />
        <rect width="90" height="65" rx="10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <rect x="8" y="42" width="45" height="5" rx="2.5" fill="rgba(255,255,255,0.12)" />
        <rect x="8" y="51" width="30" height="4" rx="2" fill="rgba(255,255,255,0.07)" />
      </g>
      {/* Stars */}
      <circle cx="50" cy="130" r="2" fill={T.cyan} opacity="0.8" />
      <circle cx="370" cy="100" r="1.5" fill={T.purple} opacity="0.8" />
      <circle cx="400" cy="200" r="2.5" fill={T.cyan} opacity="0.5" />
      <circle cx="20" cy="250" r="1.5" fill={T.purple} opacity="0.6" />
      {/* Screen glow on top */}
      <ellipse cx="210" cy="160" rx="120" ry="8" fill="url(#topGlow)" opacity="0.6" />
      {/* Definitions */}
      <defs>
        <radialGradient id="aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={T.purple} stopOpacity="0.3" />
          <stop offset="60%" stopColor={T.cyan} stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ctrlGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A2640" />
          <stop offset="100%" stopColor="#0C1525" />
        </linearGradient>
        <linearGradient id="card1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={T.purple} stopOpacity="0.4" />
          <stop offset="100%" stopColor={T.cyan} stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="card2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={T.cyan} stopOpacity="0.3" />
          <stop offset="100%" stopColor={T.purple} stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="topGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor={T.cyan} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  </div>
));
HeroArtwork.displayName = "HeroArtwork";

export default function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const count = useLiveCounter(15847100);

  // Entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(badgeRef.current, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5 })
      .fromTo(headlineRef.current.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, "-=0.2")
      .fromTo(subtextRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
      .fromTo(ctaRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
      .fromTo(statsRef.current.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, "-=0.3");
    return () => tl.kill();
  }, []);

  // Mouse-reactive parallax + glow
  useEffect(() => {
    const cp = initParallax(sectionRef.current);
    const cg = initMouseGlow(sectionRef.current);
    return () => { cp(); cg(); };
  }, []);

  return (
    <section ref={sectionRef} className="hero" aria-label="Hero section">
      {/* Background layers */}
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__bg-base" aria-hidden="true" />
      <div className="hero__aurora" aria-hidden="true" />
      <div className="hero__nebula" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />

      {/* Floating orbs */}
      <div className="hero__orb hero__orb--1" aria-hidden="true" />
      <div className="hero__orb hero__orb--2" aria-hidden="true" />
      <div className="hero__orb hero__orb--3" aria-hidden="true" />

      {/* Light rays */}
      <div className="hero__rays" aria-hidden="true">
        <div className="hero__ray" />
        <div className="hero__ray" />
        <div className="hero__ray" />
        <div className="hero__ray" />
      </div>

      {/* Particles */}
      <div className="hero__particles" aria-hidden="true">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="hero__particle"
            style={{
              left: p.left,
              bottom: "-10px",
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating artwork */}
      <HeroArtwork />

      {/* Main content */}
      <div className="hero__content">
        {/* Live badge */}
        <motion.div
          ref={badgeRef}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(8,13,26,0.8)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${T.border}`,
            borderRadius: 50,
            padding: "6px 16px 6px 10px",
            marginBottom: 28,
            fontSize: 12,
            color: T.textSec,
            fontWeight: 500,
          }}
        >
          <span style={{
            width: 7, height: 7,
            borderRadius: "50%",
            background: T.green,
            boxShadow: `0 0 8px ${T.green}`,
            animation: "pulse-dot 2s infinite",
            display: "inline-block",
            flexShrink: 0,
          }} />
          <span>
            <strong style={{ color: T.text }}>{count.toLocaleString()}</strong> games ·{" "}
            <strong style={{ color: T.cyan }}>2.4M</strong> players online
          </span>
        </motion.div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          style={{
            fontFamily: T.fontDisplay,
            fontSize: "clamp(42px, 7vw, 80px)",
            fontWeight: 800,
            color: T.text,
            lineHeight: 1.0,
            letterSpacing: -2,
            marginBottom: 24,
          }}
        >
          <span style={{ display: "block" }}>Play Anything.</span>
          <span
            style={{
              display: "block",
              background: `linear-gradient(135deg, ${T.cyan} 0%, ${T.purple} 60%, ${T.pink} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Everywhere.
          </span>
        </h1>

        {/* Subtext */}
        <p
          ref={subtextRef}
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: T.textSec,
            lineHeight: 1.75,
            marginBottom: 40,
            maxWidth: 520,
            margin: "0 auto 40px",
          }}
        >
          The world's largest gaming platform. Millions of games across every genre — no downloads, instant play. Discover your next obsession.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 60,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${T.cyanGlow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/library")}
            style={{
              padding: "14px 32px",
              borderRadius: 12,
              border: "none",
              background: `linear-gradient(135deg, ${T.cyan}, #0099CC)`,
              color: "#000",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: T.fontDisplay,
              letterSpacing: -0.3,
            }}
          >
            <Play size={17} fill="#000" stroke="#000" />
            Browse All Games
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: T.purple, boxShadow: `0 0 30px ${T.purpleGlow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/plans")}
            style={{
              padding: "14px 32px",
              borderRadius: 12,
              border: `1px solid ${T.border}`,
              background: "rgba(8,13,26,0.6)",
              backdropFilter: "blur(10px)",
              color: T.text,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "border-color 0.2s, box-shadow 0.2s",
              fontFamily: T.fontDisplay,
            }}
          >
            <Crown size={17} color={T.purple} />
            View Plans
          </motion.button>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(24px, 4vw, 56px)",
            flexWrap: "wrap",
            padding: "28px 32px",
            background: "rgba(8,13,26,0.6)",
            backdropFilter: "blur(16px)",
            border: `1px solid ${T.border}`,
            borderRadius: 20,
          }}
        >
          {STATS.map(({ n, l, color }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "clamp(22px, 3vw, 30px)",
                fontWeight: 900,
                color,
                letterSpacing: -1,
                fontFamily: T.fontDisplay,
                textShadow: `0 0 20px ${color}55`,
              }}>
                {n}
              </div>
              <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 500, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            color: T.textMuted,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          <span>Scroll to explore</span>
          <ChevronRight size={14} style={{ transform: "rotate(90deg)", opacity: 0.5 }} />
        </motion.div>
      </div>
    </section>
  );
}
