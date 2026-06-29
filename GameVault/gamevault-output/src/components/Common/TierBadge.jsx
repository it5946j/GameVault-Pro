import { theme as T } from "../../styles/theme";

const STYLES = [
  { label: "Basic", color: "#94A3B8", bg: "rgba(148,163,184,0.1)" },
  { label: "Pro", color: T.cyan, bg: "rgba(0,212,255,0.1)" },
  { label: "Ultimate", color: T.purple, bg: "rgba(139,92,246,0.1)" },
];

export default function TierBadge({ tier }) {
  const s = STYLES[tier] || STYLES[0];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.color}40`,
        borderRadius: 4,
        padding: "2px 6px",
      }}
    >
      {s.label}
    </span>
  );
}
