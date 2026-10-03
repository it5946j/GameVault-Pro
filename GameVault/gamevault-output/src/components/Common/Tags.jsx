export default function Tags({ game, max = 5 }) {
  const list = [...new Set([...(game.genres || []), ...(game.tags || [])])].slice(0, max);
  return (
    <>
      {list.map((t) => (
        <span key={t} className="tag">{t}</span>
      ))}
    </>
  );
}
