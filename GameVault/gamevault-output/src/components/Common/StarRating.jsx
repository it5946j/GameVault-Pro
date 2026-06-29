import { Star } from "lucide-react";
import { theme as T } from "../../styles/theme";

export default function StarRating({ rating }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <Star size={12} fill={T.gold} stroke={T.gold} />
      <span style={{ fontSize: 12, color: T.gold, fontWeight: 600 }}>{rating.toFixed(1)}</span>
    </span>
  );
}
