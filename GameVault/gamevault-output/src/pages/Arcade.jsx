import { Link, useParams } from "react-router-dom";
import { ORIGINALS, getOriginal } from "../games/catalog";
import GamePlayer from "../components/Arcade/GamePlayer";
import OriginalCard from "../components/Arcade/OriginalCard";

export default function Arcade() {
  const { key } = useParams();
  const original = key ? getOriginal(key) : null;

  if (key && !original) {
    return (
      <div className="store-wrap" style={{ padding: "80px 8px", textAlign: "center", color: "#8f98a0" }}>
        <p style={{ marginBottom: 12 }}>That game doesn't exist.</p>
        <Link to="/arcade" style={{ color: "#67c1f5" }}>← Back to the arcade</Link>
      </div>
    );
  }

  if (original) {
    return (
      <div className="store-wrap">
        <div className="app-crumbs"><Link to="/">Store</Link> &gt; <Link to="/arcade">Arcade</Link> &gt; {original.name}</div>
        <h1 className="app-title">{original.name}</h1>
        <GamePlayer key={original.key} original={original} />
        <div className="block"><h2>How to play</h2><p>{original.controls}</p></div>
      </div>
    );
  }

  return (
    <div className="store-wrap wide">
      <div className="sec-title" style={{ marginTop: 20 }}>GameVault Originals — play free in your browser</div>
      <div className="cap-grid orig-grid">
        {ORIGINALS.map((g) => <OriginalCard key={g.key} original={g} />)}
      </div>
    </div>
  );
}
