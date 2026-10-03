const LABELS = ["Free to Play", "Pro", "Ultimate"];
const CLASSES = ["free", "pro", "ultimate"];

/** Where Steam shows a price, GameVault shows the plan tier that unlocks the game. */
export default function PriceBox({ tier = 0, large = false }) {
  return (
    <span className={`price ${CLASSES[tier] || "free"}${large ? " lg" : ""}`}>
      <span className="acc">{LABELS[tier] || LABELS[0]}</span>
    </span>
  );
}
