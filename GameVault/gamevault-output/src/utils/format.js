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

/** Steam-style review summary derived from a 0-5 rating. */
export function reviewLabel(rating = 0) {
  if (rating >= 4.5) return { text: "Overwhelmingly Positive", color: "#66c0f4" };
  if (rating >= 4.0) return { text: "Very Positive", color: "#66c0f4" };
  if (rating >= 3.5) return { text: "Mostly Positive", color: "#66c0f4" };
  if (rating >= 3.0) return { text: "Mixed", color: "#b9a074" };
  if (rating > 0) return { text: "Mostly Negative", color: "#a34c25" };
  return { text: "No user reviews", color: "#8f98a0" };
}

/** "2024-03-09" -> "9 Mar, 2024" (Steam's release-date format) */
export function steamDate(iso) {
  if (!iso) return "TBA";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBA";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).replace(/(\w+) (\d{4})$/, "$1, $2");
}
