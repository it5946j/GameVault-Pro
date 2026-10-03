import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchTrending, fetchPopular, fetchNewReleases, fetchUpcoming } from "../../api/rawg";
import { useGameList } from "../../hooks/useGameList";
import PriceBox from "../Common/PriceBox";
import Tags from "../Common/Tags";
import { RowSkeleton } from "../Common/Skeletons";
import { reviewLabel, steamDate } from "../../utils/format";

const TABS = [
  { key: "trending", label: "New & Trending", fetcher: fetchTrending },
  { key: "top", label: "Top Rated", fetcher: fetchPopular },
  { key: "new", label: "New Releases", fetcher: fetchNewReleases },
  { key: "soon", label: "Upcoming", fetcher: fetchUpcoming },
];

/** Steam-style tabbed game list; hovering a row fills the preview panel on the right. */
export default function TabbedList() {
  const [tab, setTab] = useState(TABS[0].key);
  const [hover, setHover] = useState(null);
  const active = TABS.find((t) => t.key === tab);
  const fetcher = useCallback((page, size) => active.fetcher(page, size), [active]);
  const { games, loading, error } = useGameList(fetcher, [tab], 10);
  const shown = hover && games.find((g) => g.id === hover) ? games.find((g) => g.id === hover) : games[0];

  return (
    <div>
      <div className="tabs-head">
        {TABS.map((t) => (
          <button key={t.key} className={t.key === tab ? "on" : ""} onClick={() => { setTab(t.key); setHover(null); }}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="tabs-wrap">
        <div className="row-list" style={{ padding: 4 }}>
          {error && <p style={{ padding: 16, color: "#c15755" }}>Couldn't load games: {error}</p>}
          {loading && games.length === 0 ? (
            <RowSkeleton count={10} height={52} />
          ) : (
            games.map((g) => (
              <Link key={g.id} to={`/game/${g.id}`} className={`row-item${shown?.id === g.id ? " hot" : ""}`} onMouseEnter={() => setHover(g.id)}>
                <div className="thumb" style={g.background_image ? { backgroundImage: `url(${g.background_image})` } : undefined} />
                <div style={{ minWidth: 0 }}>
                  <div className="t">{g.title}</div>
                  <div className="sub">{g.genres.slice(0, 3).join(", ")}</div>
                </div>
                <PriceBox />
              </Link>
            ))
          )}
        </div>
        <div className="preview">
          {shown && (
            <>
              <h4>{shown.title}</h4>
              <div style={{ fontSize: 12, color: reviewLabel(shown.rating).color }}>{reviewLabel(shown.rating).text}</div>
              <div className="img" style={shown.background_image ? { backgroundImage: `url(${shown.background_image})` } : undefined} />
              <p>Released: {steamDate(shown.released)}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}><Tags game={shown} max={4} /></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
