import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { searchClassics } from "../api/archive";
import ClassicEmbed from "../components/Arcade/ClassicEmbed";

/** /classics/:id — plays an Internet Archive game. */
export default function ClassicPlay() {
  const { id } = useParams();
  const [title, setTitle] = useState(null);

  // The player works from the id alone; the title is just for the heading.
  useEffect(() => {
    let active = true;
    setTitle(null);
    searchClassics({ q: id.replace(/^[a-z]+_/i, "").replace(/[_-]+/g, " "), rows: 10 })
      .then((r) => active && setTitle(r.results.find((x) => x.id === id)?.title || null))
      .catch(() => {});
    return () => { active = false; };
  }, [id]);

  const heading = title || id.replace(/^[a-z]+_/i, "").replace(/[_-]+/g, " ");

  return (
    <div className="store-wrap">
      <div className="app-crumbs"><Link to="/">Store</Link> &gt; <Link to="/classics">Classics</Link> &gt; {heading}</div>
      <h1 className="app-title">{heading}</h1>
      <ClassicEmbed id={id} title={heading} />
      <div className="block">
        <h2>How to play</h2>
        <p>Click the game once to start and give it keyboard focus. Most DOS games use the arrow keys, Enter, Space, Ctrl and Alt. Use the fullscreen button for the best view.</p>
        <p style={{ marginTop: 8, fontSize: 12, color: "#67707b" }}>Emulation and hosting provided by the Internet Archive. GameVault only links to its player.</p>
      </div>
    </div>
  );
}
