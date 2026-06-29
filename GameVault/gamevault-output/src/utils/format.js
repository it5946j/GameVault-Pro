// ─────────────────────────────────────────────
// FORMATTERS
// ─────────────────────────────────────────────

/** Compact number formatting: 1234567 -> "1.2M", 4500 -> "5K" */
export function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
}

/** Title-cased initials for a game's placeholder thumbnail, e.g. "Shadow Breach" -> "SB" */
export function initials(title = "") {
  return title.split(" ").slice(0, 2).map((w) => w[0]).join("");
}
