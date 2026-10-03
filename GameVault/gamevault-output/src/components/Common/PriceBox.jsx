/** Every game on GameVault is free; this replaces Steam's price box. */
export default function PriceBox({ large = false }) {
  return (
    <span className={`price free${large ? " lg" : ""}`}>
      <span className="acc">Free</span>
    </span>
  );
}
