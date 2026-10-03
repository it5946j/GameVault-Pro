import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { coverUrl } from "../../api/archive";

export default function ClassicCard({ game }) {
  return (
    <Link to={`/classics/${encodeURIComponent(game.id)}`} className="cap">
      <div className="cap-img classic-cover" style={{ backgroundImage: `url("${coverUrl(game.id)}")` }} />
      <div className="cap-body">
        <div className="cap-title" title={game.title}>{game.title}</div>
        <div className="cap-foot">
          <span className="cap-note">{game.year || "Classic"}</span>
          <span className="price free"><span className="acc"><Play size={11} style={{ marginRight: 4 }} />Play</span></span>
        </div>
      </div>
    </Link>
  );
}
