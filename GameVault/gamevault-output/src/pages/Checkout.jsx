import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { theme as T } from "../styles/theme";
import { PLANS } from "../data/plans";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan || PLANS.find((p) => p.popular) || PLANS[0];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px 80px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: T.textSec, cursor: "pointer", fontSize: 13, marginBottom: 24 }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <h1 style={{ fontSize: 26, fontWeight: 800, color: T.text, marginBottom: 6 }}>Checkout</h1>
      <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 28 }}>You're subscribing to the {plan.name} plan.</p>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: plan.color }}>{plan.name}</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: T.text }}>{plan.price === 0 ? "Free" : `$${plan.price}/mo`}</span>
        </div>
        <p style={{ fontSize: 12, color: T.textMuted }}>{plan.desc}</p>
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${T.border}`,
          background: T.surface,
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 24,
        }}
      >
        <Lock size={16} color={T.textMuted} />
        <span style={{ fontSize: 12, color: T.textMuted }}>
          Payment processing (Stripe) isn't wired up yet — this is a placeholder checkout screen for Phase 1.
        </span>
      </div>

      <button
        disabled
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 10,
          border: "none",
          background: T.border,
          color: T.textMuted,
          fontWeight: 800,
          fontSize: 15,
          cursor: "not-allowed",
        }}
      >
        Payments coming soon
      </button>
    </div>
  );
}
