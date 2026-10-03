export function RowSkeleton({ count = 10, height = 69 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="skeleton-pulse" style={{ height, marginBottom: 4, background: "rgba(103,193,245,.07)" }} />
  ));
}

export function BlockSkeleton({ height = 353 }) {
  return <div className="skeleton-pulse" style={{ height, background: "rgba(0,0,0,.25)" }} />;
}

export function CapSkeleton({ count = 4 }) {
  return (
    <div className="cap-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-pulse" style={{ aspectRatio: "460/270", background: "rgba(0,0,0,.25)" }} />
      ))}
    </div>
  );
}
