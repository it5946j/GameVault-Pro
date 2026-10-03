// ─────────────────────────────────────────────
// DESIGN TOKENS — single source of truth
// Mirrors CSS custom properties in global.css
// ─────────────────────────────────────────────
export const theme = {
  bg: "#1b2838",
  surface: "#171d25",
  surface2: "#1f2c3b",
  card: "#16202d",
  cardHover: "#2a475e",
  border: "#2a3f55",
  borderHover: "#3d5a78",

  // Steam blue is the primary accent (kept under the `cyan` key so existing
  // components pick it up without renames).
  cyan: "#66c0f4",
  cyanDim: "rgba(102,192,244,0.12)",
  cyanGlow: "rgba(102,192,244,0.25)",
  purple: "#9b8cd9",
  purpleDim: "rgba(155,140,217,0.14)",
  purpleGlow: "rgba(155,140,217,0.30)",
  pink: "#EC4899",
  green: "#a4d007",
  greenDim: "rgba(164,208,7,0.12)",
  orange: "#F59E0B",
  red: "#c15755",
  gold: "#F59E0B",

  header: "#171a21",
  link: "#1a9fff",
  discount: "#4c6b22",
  discountText: "#beee11",

  text: "#c6d4df",
  textBright: "#ffffff",
  textSec: "#8f98a0",
  textMuted: "#67707b",

  glass: "rgba(23,26,33,0.95)",
  glassBorder: "rgba(61,90,120,0.6)",

  fontDisplay: "'Motiva Sans', Arial, Helvetica, sans-serif",
  fontBody: "'Motiva Sans', Arial, Helvetica, sans-serif",
};

export default theme;
