import { useRef, useEffect, useState } from "react";
import { theme as T } from "../../styles/theme";
import { revealStagger } from "../../animations/scrollEffects";
import { Gamepad2, Users, Download, MessageSquare, Globe } from "lucide-react";

const STATS = [
  { icon: Gamepad2, value: 15000000, display: "15M+", label: "Games Available", color: T.cyan, suffix: "+" },
  { icon: Users, value: 2400000, display: "2.4M", label: "Active Players", color: T.purple },
  { icon: Download, value: 50000000, display: "50M+", label: "Total Downloads", color: T.green, suffix: "+" },
  { icon: MessageSquare, value: 8900000, display: "8.9M", label: "Reviews Written", color: T.orange },
  { icon: Globe, value: 190, display: "190+", label: "Countries Supported", color: T.pink, suffix: "+" },
];

function useCountUp(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

function StatCard({ stat, inView }) {
  const count = useCountUp(stat.value, 2200, inView);

  const formatNum = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(0) + "K";
    return n.toString();
  };

  return (
    <div style={{
      flex: "1 1 160px",
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 20,
      padding: "28px 24px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.3s, box-shadow 0.3s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = stat.color;
        e.currentTarget.style.boxShadow = `0 0 30px ${stat.color}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Glow bg */}
      <div style={{
        position: "absolute",
        top: -30, left: "50%",
        transform: "translateX(-50%)",
        width: 120, height: 120,
        borderRadius: "50%",
        background: stat.color,
        opacity: 0.06,
        filter: "blur(30px)",
        pointerEvents: "none",
      }} />
      {/* Icon */}
      <div style={{
        width: 48, height: 48,
        borderRadius: 14,
        background: `${stat.color}15`,
        border: `1px solid ${stat.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px",
      }}>
        <stat.icon size={22} color={stat.color} />
      </div>
      {/* Number */}
      <div style={{
        fontSize: "clamp(28px, 3vw, 38px)",
        fontWeight: 900,
        color: stat.color,
        letterSpacing: -1,
        fontFamily: T.fontDisplay,
        lineHeight: 1,
        marginBottom: 6,
        textShadow: `0 0 20px ${stat.color}55`,
      }}>
        {inView ? formatNum(count) + (stat.suffix || "") : "0"}
      </div>
      {/* Label */}
      <div style={{
        fontSize: 12,
        color: T.textSec,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}>
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) revealStagger(sectionRef.current, ".stat-card");
  }, [inView]);

  return (
    <section style={{ padding: "0 24px 80px" }}>
      <div ref={sectionRef} style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Section heading */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: T.cyanDim,
            border: `1px solid ${T.border}`,
            borderRadius: 20, padding: "4px 14px",
            fontSize: 11, color: T.cyan, fontWeight: 700,
            letterSpacing: 0.5, marginBottom: 12,
          }}>
            BY THE NUMBERS
          </div>
          <h2 style={{
            fontSize: "clamp(24px, 3.5vw, 36px)",
            fontWeight: 800,
            color: T.text,
            fontFamily: T.fontDisplay,
            letterSpacing: -0.5,
          }}>
            A Platform Built for Scale
          </h2>
          <p style={{ color: T.textSec, marginTop: 10, fontSize: 15 }}>
            Trusted by millions of gamers worldwide
          </p>
        </div>

        {/* Stats grid */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
        }}>
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-card" style={{ flex: "1 1 180px", maxWidth: 220 }}>
              <StatCard stat={stat} inView={inView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
