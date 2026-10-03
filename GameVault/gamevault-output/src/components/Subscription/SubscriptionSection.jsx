import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PLANS } from "../../data/plans";

export default function SubscriptionSection() {
  const navigate = useNavigate();

  return (
    <div className="store-wrap" style={{ paddingTop: 24 }}>
      <div className="sec-title" style={{ marginTop: 0 }}>GameVault Plans</div>
      <p style={{ color: "#8f98a0", fontSize: 13, marginBottom: 14 }}>
        Unlock the whole catalogue with a plan that fits the way you play.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className="block"
            style={{ marginTop: 0, display: "flex", flexDirection: "column", borderTop: `3px solid ${plan.color}`, position: "relative" }}
          >
            {plan.popular && (
              <span className="tag" style={{ position: "absolute", top: 10, right: 10 }}>Most popular</span>
            )}
            <h3 style={{ fontSize: 20, fontWeight: 400, color: "#fff" }}>{plan.name}</h3>
            <p style={{ fontSize: 12, color: "#8f98a0", marginBottom: 12 }}>{plan.desc}</p>
            <div style={{ marginBottom: 12 }}>
              <span className="price lg">
                <span className="disc" style={{ background: "#000", color: plan.color }}>
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                </span>
                {plan.price > 0 && <span className="acc">per month</span>}
              </span>
              <div style={{ fontSize: 12, color: "#8f98a0", marginTop: 6 }}>
                Access to <strong style={{ color: "#fff" }}>{plan.games}</strong> games
              </div>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6, marginBottom: 18, flex: 1 }}>
              {plan.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#acb2b8" }}>
                  <Check size={14} color={plan.color} /> {f}
                </li>
              ))}
            </ul>
            <button className={plan.popular ? "btn-green" : "btn-blue"} onClick={() => navigate("/checkout", { state: { plan } })}>
              {plan.price === 0 ? "Get Started Free" : "Subscribe Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
