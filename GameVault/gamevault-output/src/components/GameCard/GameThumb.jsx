import { theme as T } from "../../styles/theme";
import { GENRE_META } from "../../data/genreMeta";
import { initials } from "../../utils/format";

/**
 * Game thumbnail. Renders the real RAWG background_image when present;
 * falls back to the original gradient + initials placeholder otherwise
 * (e.g. while loading, or for games RAWG has no image for).
 */
export default function GameThumb({ game, size = 200 }) {
  const meta = GENRE_META[game.genre] || GENRE_META.Action;
  const label = initials(game.title);

  if (game.background_image) {
    return (
      <div
        style={{
          width: "100%",
          paddingTop: "60%",
          position: "relative",
          borderRadius: 8,
          overflow: "hidden",
          flexShrink: 0,
          backgroundImage: `url(${game.background_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
