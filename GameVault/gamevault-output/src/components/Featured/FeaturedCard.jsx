// FeaturedCard is now implemented inline in FeaturedCarousel.jsx for better colocation.
// This file is kept for import compatibility.
import { theme as T } from "../../styles/theme";
import { motion } from "framer-motion";
import { Star, Play } from "lucide-react";
import { useState } from "react";

export default function FeaturedCard({ game, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
      onClick={() => onClick(game)}
      style={{
        minWidth: 280, maxWidth: 280,
        borderRadius: 16, overflow: "hidden",
        cursor: "pointer",
        background: T.card,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        flexShrink: 0,
        transition: "border-color 0.25s",
      }}
    >
      <div style={{ position: "relative", paddingTop: "62%", overflow: "hidden", background: T.surface }}>
        {game.background_image && (
          <img
            src={game.background_image}
            alt={game.title}
            loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>
      <div style={{ padding: "12px 14px" }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 6 }}>{game.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Star size={11} fill={T.orange} stroke={T.orange} />
          <span style={{ fontSize: 12, color: T.orange, fontWeight: 700 }}>{game.rating?.toFixed(1)}</span>
        </div>
      </div>
    </motion.div>
  );
}
