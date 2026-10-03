import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchGameDetail } from "../api/rawg";
import { mapRawgGame } from "../utils/mapRawgGame";
import { originalForGame } from "../games/catalog";
import { findClassicByTitle } from "../api/archive";
import ClassicEmbed from "../components/Arcade/ClassicEmbed";
import GamePlayer from "../components/Arcade/GamePlayer";
import { BlockSkeleton } from "../components/Common/Skeletons";

/** /game/:id/play — launches the built-in game that matches the title's genre. */
export default function GamePlay() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [classic, setClassic] = useState(undefined); // undefined = looking, null = none found

  useEffect(() => {
    let active = true;
    setGame(null);
    setClassic(undefined);
    setError(null);
    fetchGameDetail(id)
      .then(async (d) => {
        const mapped = mapRawgGame(d);
        if (!active) return;
        setGame(mapped);
        // Is the real game available to play in the browser via the Internet Archive?
        const match = await findClassicByTitle(mapped.title);
        if (active) setClassic(match);
      })
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
  if (classic === undefined) {
    return <div className="store-wrap" style={{ paddingTop: 40 }}><BlockSkeleton height={460} /></div>;
  }
  if (classic) {
    return (
      <div className="store-wrap">
        <div className="app-crumbs">
          <Link to="/">Store</Link> &gt; <Link to={`/game/${game.id}`}>{game.title}</Link> &gt; Play
        </div>
        <h1 className="app-title">{game.title}</h1>
        <p className="demo-note">The original game, running in your browser. Click it once to give it keyboard focus.</p>
        <ClassicEmbed id={classic.id} title={game.title} />
        <p style={{ marginTop: 14 }}><Link to={`/game/${game.id}`} style={{ color: "#67c1f5" }}>← Back to {game.title}</Link></p>
      </div>
    );
  }
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
