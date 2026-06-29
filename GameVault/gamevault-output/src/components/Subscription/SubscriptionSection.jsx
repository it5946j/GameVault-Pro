import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { theme as T } from "../../styles/theme";
import { PLANS } from "../../data/plans";

export default function SubscriptionSection() {
  const navigate = useNavigate();

  return (
    <section style={{ padding: "80px 0", background: `linear-gradient(to bottom, ${T.bg}, ${T.surface})` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, color: T.cyan, marginBottom: 12 }}>SUBSCRIPTION PLANS</p>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, color: T.text, marginBottom: 12, letterSpacing: -1, fontFamily: T.fontDisplay }}>Choose Your Plan</h2>
          <p style={{ fontSize: 16, color: T.textSec, maxWidth: 480, margin: "0 auto" }}>
            Unlock thousands of premium games with a plan that fits your lifestyle.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                background: T.card,
                border: `2px solid ${plan.popular ? plan.color : T.border}`,
                borderRadius: 20,
                padding: 32,
                position: "relative",
                boxShadow: plan.popular ? `0 0 40px ${plan.color}20` : "none",
                transform: plan.popular ? "scale(1.02)" : "none",
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: `linear-gradient(135deg,${T.cyan},#0099CC)`,
                    color: "#000",
                    fontSize: 10,
                    fontWeight: 800,
                    padding: "4px 16px",
                    borderRadius: 20,
                    whiteSpace: "nowrap",
                  }}
                >
                  ⚡ MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: plan.color, marginBottom: 4 }}>{plan.name}</h3>
                <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 20 }}>{plan.desc}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, color: T.text }}>{plan.price === 0 ? "Free" : "$" + plan.price}</span>
                  {plan.price > 0 && <span style={{ fontSize: 14, color: T.textMuted }}>/month</span>}
                </div>
                <div style={{ fontSize: 12, color: T.textSec, marginTop: 6 }}>
                  Access to <strong style={{ color: plan.color }}>{plan.games}</strong> games
                </div>
              </div>
              <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: plan.color + "22",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={11} color={plan.color} />
                    </div>
                    <span style={{ fontSize: 13, color: T.textSec }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/checkout", { state: { plan } })}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 10,
                  border: `2px solid ${plan.color}`,
                  background: plan.popular ? plan.color : "transparent",
                  color: plan.popular ? "#000" : plan.color,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {plan.price === 0 ? "Get Started Free" : "Subscribe Now"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
