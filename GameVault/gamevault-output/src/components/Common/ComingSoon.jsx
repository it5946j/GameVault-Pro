import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import { theme as T } from "../../styles/theme";

/**
 * Used for pages that are scoped to a later phase (Marketplace, Dashboard,
 * Auth, etc). Renders honestly as "not built yet" rather than faking a
 * working feature with placeholder data, per the phased build plan.
 */
export default function ComingSoon({ title, description }) {
  return (
    <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 440 }}>
        <Construction size={40} color={T.purple} style={{ marginBottom: 20, opacity: 0.8 }} />
        <h1 style={{ fontSize: 26, fontWeight: 800, color: T.text, marginBottom: 10 }}>{title}</h1>
        <p style={{ fontSize: 14, color: T.textSec, lineHeight: 1.6, marginBottom: 24 }}>{description}</p>
        <Link to="/" style={{ fontSize: 13, color: T.cyan, fontWeight: 600, textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>
    </section>
  );
}
