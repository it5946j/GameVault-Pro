import { useRef } from "react";
import { Maximize2, ExternalLink } from "lucide-react";
import { embedUrl, detailsUrl } from "../../api/archive";

/** The Internet Archive's own in-browser emulator, framed in the GameVault player chrome. */
export default function ClassicEmbed({ id, title }) {
  const wrapRef = useRef(null);

  function fullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else wrapRef.current?.requestFullscreen?.();
  }

  return (
    <div className="player classic" ref={wrapRef}>
      <div className="player-bar">
        <span>Playing <b>{title}</b></span>
        <span className="spacer" />
        <a className="player-link" href={embedUrl(id)} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} /> Open in new tab</a>
        <a className="player-link" href={detailsUrl(id)} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} /> Archive page</a>
        <button onClick={fullscreen} aria-label="Fullscreen"><Maximize2 size={14} /></button>
      </div>
      <iframe
        className="classic-frame"
        title={title}
        src={embedUrl(id)}
        allow="autoplay; fullscreen; gamepad; clipboard-write"
        allowFullScreen
      />
    </div>
  );
}
