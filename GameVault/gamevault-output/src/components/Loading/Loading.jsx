import { theme as T } from "../../styles/theme";
import "./Loading.css";

export function GameCardSkeleton() {
  return (
    <div className="skeleton-pulse" style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      overflow: "hidden",
    }}>
      <div style={{ width: "100%", paddingTop: "62%", background: T.surface2 }} />
      <div style={{ padding: "12px 14px" }}>
        <div style={{ height: 13, width: "75%", background: T.surface2, borderRadius: 4, marginBottom: 10 }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ height: 10, width: "35%", background: T.surface2, borderRadius: 20 }} />
          <div style={{ height: 10, width: "25%", background: T.surface2, borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

export function GameGridSkeleton({ count = 12 }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: 16,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default GameGridSkeleton;
