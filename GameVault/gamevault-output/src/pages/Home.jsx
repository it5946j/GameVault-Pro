import { useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchTrending, fetchPopular } from "../api/rawg";
import { useGameList } from "../hooks/useGameList";
import { useGameFilters } from "../contexts/GameFilterContext";
import { GENRES_ALL } from "../data/genreMeta";
import FeaturedCapsule from "../components/Store/FeaturedCapsule";
import CapsuleGrid from "../components/Store/CapsuleGrid";
import TabbedList from "../components/Store/TabbedList";
import { ORIGINALS } from "../games/catalog";
import OriginalCard from "../components/Arcade/OriginalCard";
import { BlockSkeleton, CapSkeleton } from "../components/Common/Skeletons";

export default function Home() {
  const navigate = useNavigate();
  const { setGenre, setSort, setSearch } = useGameFilters();
  const trending = useGameList(useCallback((p, s) => fetchTrending(p, s), []), [], 24);
  const top = useGameList(useCallback((p, s) => fetchPopular(p, s), []), [], 8);

  const withArt = useMemo(() => trending.games.filter((g) => g.background_image), [trending.games]);
  const featured = withArt.slice(0, 6);
  const specials = withArt.slice(6, 14);

  function browse({ genre = "All", sort = "hot" } = {}) {
    setGenre(genre);
    setSort(sort);
    setSearch("");
    navigate("/library");
  }

  return (
    <div className="store-wrap wide">
      <div className="store-layout">
        <aside>
          <div className="side-promo side-box">
            <strong>100% free</strong>
            {trending.total > 0 ? `${trending.total.toLocaleString()} games` : "A huge catalogue"}, no subscriptions, no purchases. <Link to="/arcade" style={{ color: "#67c1f5" }}>Play now</Link>
          </div>
          <div className="side-box">
            <h3>Browse by genre</h3>
            {GENRES_ALL.filter((g) => g !== "All").map((g) => (
              <button key={g} onClick={() => browse({ genre: g })}>{g.replace("_", " ")}</button>
            ))}
          </div>
          <div className="side-box">
            <h3>Quick links</h3>
            <button onClick={() => browse({ sort: "new" })}>New releases</button>
            <button onClick={() => browse({ sort: "rating" })}>Top rated</button>
            <button onClick={() => browse({ sort: "hot" })}>Trending</button>
          </div>
        </aside>

        <div style={{ minWidth: 0 }}>
          <div className="sec-title" style={{ marginTop: 0 }}>Featured &amp; Recommended</div>
          {trending.loading && !featured.length ? <BlockSkeleton /> : <FeaturedCapsule games={featured} />}
          {trending.error && <p style={{ color: "#c15755", padding: "12px 0" }}>Couldn't load games: {trending.error}</p>}

          <div className="sec-title">GameVault Originals — play free <Link to="/arcade">See all</Link></div>
          <div className="cap-grid orig-grid">
            {ORIGINALS.slice(0, 4).map((g) => <OriginalCard key={g.key} original={g} />)}
          </div>

          <div className="sec-title">Trending Now <Link to="/library">See more</Link></div>
          {trending.loading && !specials.length ? <CapSkeleton count={4} /> : <CapsuleGrid games={specials.slice(0, 4)} />}

          <div className="sec-title">Highly Rated <Link to="/library">See more</Link></div>
          {top.loading && !top.games.length ? <CapSkeleton count={4} /> : <CapsuleGrid games={top.games.slice(0, 4)} />}

          <div className="sec-title">Browse</div>
          <TabbedList />
        </div>
      </div>
    </div>
  );
}
