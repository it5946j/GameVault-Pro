import { Link } from "react-router-dom";
import PriceBox from "../Common/PriceBox";
import { reviewLabel } from "../../utils/format";

export default function CapsuleGrid({ games }) {
  return (
    <div className="cap-grid">
      {games.map((g) => (
        <Link key={g.id} to={`/game/${g.id}`} className="cap">
          <div className="cap-img" style={g.background_image ? { backgroundImage: `url(${g.background_image})` } : undefined} />
          <div className="cap-body">
            <div className="cap-title">{g.title}</div>
            <div className="cap-foot">
              <span className="cap-note" style={{ color: reviewLabel(g.rating).color }}>{reviewLabel(g.rating).text}</span>
              <PriceBox tier={g.tier} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
