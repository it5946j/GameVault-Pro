import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchGameDetail } from "../api/rawg";
import { mapRawgGame } from "../utils/mapRawgGame";
import { originalForGame } from "../games/catalog";
import GamePlayer from "../components/Arcade/GamePlayer";
import { BlockSkeleton } from "../components/Common/Skeletons";

/** /game/:id/play — launches the built-in game that matches the title's genre. */
export default function GamePlay() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setGame(null);
    setError(null);
    fetchGameDetail(id)
      .then((d) => active && setGame(mapRawgGame(d)))
      .catch((e) => active && setError(e?.message || "Failed to load game"));
    return () => { active = false; };
  }, [id]);

  if (error) {
    return (
      <div className="store-wrap" style={{ padding: "80px 8px", textAlign: "center", color: "#c15755" }}>
        <p style={{ marginBottom: 12 }}>Couldn't load this game. {error}</p>
        <Link to="/library" style={{ color: "#67c1f5" }}>← Back to store</Link>
      </div>
    );
  }
  if (!game) return <div className="store-wrap" style={{ paddingTop: 40 }}><BlockSkeleton height={460} /></div>;

  const original = originalForGame(game);
  return (
    <div className="store-wrap">
      <div className="app-crumbs">
        <Link to="/">Store</Link> &gt; <Link to={`/game/${game.id}`}>{game.title}</Link> &gt; Play
      </div>
      <h1 className="app-title">{game.title}</h1>
      <p className="demo-note">
        GameVault doesn't host the full version of {game.title}. Here's a free {game.genre.replace("_", " ")} arcade game —
        <b> {original.name}</b> — to play right now.
      </p>
      <GamePlayer key={original.key} original={original} />
      <div className="block"><h2>How to play</h2><p>{original.controls}</p></div>
      <p style={{ marginTop: 14 }}><Link to={`/game/${game.id}`} style={{ color: "#67c1f5" }}>← Back to {game.title}</Link></p>
    </div>
  );
}
