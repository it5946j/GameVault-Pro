import { theme as T } from "../../styles/theme";

/**
 * Steam-style price display: "Free to Play" pill, a discount badge with
 * strikethrough original price + sale price, or a plain price.
 */
export default function PriceTag({ game, size = "sm" }) {
  const small = size === "sm";

  if (game.isFree) {
    return (
      <span
        style={{
          fontSize: small ? 11 : 13,
          fontWeight: 800,
          color: T.green,
          background: T.greenDim,
          border: `1px solid ${T.green}40`,
          padding: small ? "3px 8px" : "5px 12px",
          borderRadius: 6,
          whiteSpace: "nowrap",
        }}
      >
        Free to Play
      </span>
    );
  }

  if (game.discount > 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: small ? 6 : 8 }}>
        <span
          style={{
            fontSize: small ? 11 : 13,
            fontWeight: 800,
            color: "#fff",
            background: T.green,
            padding: small ? "3px 6px" : "5px 10px",
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          -{game.discount}%
        </span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.15 }}>
          <span style={{ fontSize: small ? 10 : 11, color: T.textMuted, textDecoration: "line-through" }}>
            ${game.originalPrice.toFixed(2)}
          </span>
          <span style={{ fontSize: small ? 12 : 14, fontWeight: 800, color: T.green }}>
            ${game.price.toFixed(2)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <span style={{ fontSize: small ? 12 : 14, fontWeight: 700, color: T.text }}>
      ${game.price.toFixed(2)}
    </span>
  );
}
