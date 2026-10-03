import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import OriginalCover from "./OriginalCover";

export default function OriginalCard({ original }) {
  return (
    <Link to={`/arcade/${original.key}`} className="cap">
      <div className="cap-img"><OriginalCover original={original} className="cover-svg" /></div>
      <div className="cap-body">
        <div className="cap-foot">
          <span className="cap-note">{original.tagline}</span>
          <span className="price free"><span className="acc"><Play size={11} style={{ marginRight: 4 }} />Play</span></span>
        </div>
      </div>
    </Link>
  );
}
