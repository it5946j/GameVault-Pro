import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PriceBox from "../Common/PriceBox";
import Tags from "../Common/Tags";
import { reviewLabel } from "../../utils/format";

const ROTATE_MS = 7000;

/** Steam's "Featured & Recommended" carousel: big capsule left, details right. */
export default function FeaturedCapsule({ games }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = games.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, count]);

  if (!count) return null;
  const g = games[idx % count];
  const review = reviewLabel(g.rating);
  const step = (d) => setIdx((i) => (i + d + count) % count);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="feat">
        <button className="feat-arrow l" aria-label="Previous" onClick={() => step(-1)}><ChevronLeft /></button>
        <button className="feat-arrow r" aria-label="Next" onClick={() => step(1)}><ChevronRight /></button>
        <Link to={`/game/${g.id}`} className="feat-main">
          <img src={g.background_image} alt={g.title} />
          <span className="feat-badge">{g.isHot ? "Top Seller" : g.isNew ? "New Release" : "Recommended"}</span>
        </Link>
        <div className="feat-side">
          <Link to={`/game/${g.id}`}><h3>{g.title}</h3></Link>
          {g.shots.length > 0 && (
            <div className="feat-shots">
              {g.shots.map((s) => <div key={s} style={{ backgroundImage: `url(${s})` }} />)}
            </div>
          )}
          <div className="feat-meta" style={{ color: review.color }}>{review.text}</div>
          <div className="feat-tags"><Tags game={g} /></div>
          <div className="feat-footer">
            <PriceBox tier={g.tier} large />
          </div>
        </div>
      </div>
      <div className="feat-nav">
        {games.map((x, i) => (
          <button key={x.id} className={`feat-dot${i === idx ? " on" : ""}`} aria-label={`Show ${x.title}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  );
}
