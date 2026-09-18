import { useState } from "react";
import { theme as T } from "../../styles/theme";
import { GENRE_META } from "../../data/genreMeta";
import { initials } from "../../utils/format";

function ThumbPlaceholder({ meta, label, size }) {
  return (
    <div
      style={{
        width: "100%",
        paddingTop: "60%",
        position: "relative",
        borderRadius: 8,
        background: `linear-gradient(135deg, ${meta.bg} 0%, ${T.surface} 100%)`,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <div style={{ fontSize: size < 100 ? 24 : 36 }}>{meta.icon}</div>
        <div
          style={{
            fontSize: size < 100 ? 11 : 16,
            fontWeight: 800,
            color: meta.color,
            letterSpacing: 2,
            textShadow: `0 0 20px ${meta.color}88`,
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 70% 30%, ${meta.color}22 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}

/**
 * Game thumbnail. Renders the real RAWG background_image when present;
 * falls back to the gradient + initials placeholder otherwise — either
 * because RAWG has no image for that game, or because the image URL
 * failed to actually load (rate limit, dead link, offline), so a broken
 * cover never renders as a blank box.
 */
export default function GameThumb({ game, size = 200 }) {
  const meta = GENRE_META[game.genre] || GENRE_META.Action;
  const label = initials(game.title);
  const [failed, setFailed] = useState(false);

  if (game.background_image && !failed) {
    return (
      <div
        style={{
          width: "100%",
          paddingTop: "60%",
          position: "relative",
          borderRadius: 8,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={game.background_image}
          alt={game.title}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, rgba(6,9,15,0.55) 0%, transparent 55%)`,
          }}
        />
      </div>
    );
  }

  return <ThumbPlaceholder meta={meta} label={label} size={size} />;
}
