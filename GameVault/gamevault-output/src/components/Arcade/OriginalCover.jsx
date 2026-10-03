import { useId } from "react";

// Hand-drawn SVG key art for each GameVault Original (460x215, Steam capsule ratio).
const STARS = [[30,30],[90,150],[150,60],[210,120],[260,40],[330,170],[380,70],[430,130],[60,100],[300,100],[410,25],[120,190]];

function Art({ id, k }) {
  const g = (n) => `${id}-${n}`;
  switch (k) {
    case "star-defender":
      return (<>
        <defs>
          <radialGradient id={g("bg")} cx="70%" cy="40%" r="90%"><stop offset="0" stopColor="#1d4e89" /><stop offset="1" stopColor="#050912" /></radialGradient>
          <linearGradient id={g("ship")} x1="0" x2="1"><stop offset="0" stopColor="#66c0f4" /><stop offset="1" stopColor="#c8ecff" /></linearGradient>
        </defs>
        <rect width="460" height="215" fill={`url(#${g("bg")})`} />
        {STARS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 ? 1.2 : 2} fill="#fff" opacity=".8" />)}
        <circle cx="360" cy="70" r="46" fill="#0b3d91" opacity=".55" /><circle cx="372" cy="62" r="40" fill="#2a6fd6" opacity=".35" />
        {[[110,50],[190,95],[270,45],[340,120],[60,110]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y + 16} L${x - 16} ${y - 12} L${x + 16} ${y - 12} Z`} fill="#ff5c5c" filter={`url(#${g("glow")})`} />
        ))}
        <g transform="translate(215 150)">
          <path d="M0 -34 L-26 30 L0 16 L26 30 Z" fill={`url(#${g("ship")})`} />
          <path d="M0 16 L-8 40 L0 30 L8 40 Z" fill="#feca57" />
        </g>
        {[[215,100],[215,70],[215,40]].map(([x, y], i) => <rect key={i} x={x - 2} y={y} width="4" height="16" rx="2" fill="#a4d007" />)}
        <filter id={g("glow")}><feGaussianBlur stdDeviation="3" /></filter>
      </>);
    case "snake":
      return (<>
        <defs><linearGradient id={g("bg")} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0c1f10" /><stop offset="1" stopColor="#1f4d20" /></linearGradient></defs>
        <rect width="460" height="215" fill={`url(#${g("bg")})`} />
        {Array.from({ length: 24 }).map((_, i) => <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="215" stroke="#a4d007" opacity=".07" />)}
        {Array.from({ length: 11 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 20} x2="460" y2={i * 20} stroke="#a4d007" opacity=".07" />)}
        {[[60,150],[80,150],[100,150],[120,150],[120,130],[120,110],[140,110],[160,110],[180,110],[200,110],[200,90],[200,70],[220,70],[240,70],[260,70],[280,70],[280,90],[300,90],[320,90]].map(([x, y], i, a) => (
          <rect key={i} x={x} y={y} width="19" height="19" rx="4" fill={i === a.length - 1 ? "#d7ff3a" : "#a4d007"} opacity={0.45 + 0.55 * (i / a.length)} />
        ))}
        <circle cx="390" cy="90" r="11" fill="#ff5c5c" /><circle cx="386" cy="86" r="3" fill="#fff" opacity=".7" />
        <rect x="324" y="94" width="7" height="7" fill="#1b2838" /><rect x="324" y="82" width="7" height="7" fill="#1b2838" opacity="0" />
      </>);
    case "breakout":
      return (<>
        <defs><linearGradient id={g("bg")} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a0f3a" /><stop offset="1" stopColor="#0c0614" /></linearGradient></defs>
        <rect width="460" height="215" fill={`url(#${g("bg")})`} />
        {["#ff5c5c", "#ff9f43", "#feca57", "#a4d007", "#66c0f4"].map((c, r) =>
          Array.from({ length: 9 }).map((_, i) => (
            <rect key={`${r}-${i}`} x={22 + i * 46} y={18 + r * 20} width="42" height="15" rx="2" fill={c} opacity={r === 1 && (i === 3 || i === 4) ? 0 : 0.95} />
          )))}
        <circle cx="236" cy="120" r="8" fill="#fff" /><path d="M236 128 L246 170" stroke="#fff" strokeOpacity=".25" strokeWidth="6" strokeLinecap="round" />
        <rect x="170" y="185" width="120" height="12" rx="6" fill="#66c0f4" />
      </>);
    case "pong":
      return (<>
        <defs><linearGradient id={g("bg")} x1="0" x2="1"><stop offset="0" stopColor="#0b2a4a" /><stop offset="1" stopColor="#3b0d0d" /></linearGradient></defs>
        <rect width="460" height="215" fill={`url(#${g("bg")})`} />
        <line x1="230" y1="0" x2="230" y2="215" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeDasharray="10 12" />
        <rect x="30" y="60" width="14" height="90" rx="3" fill="#66c0f4" /><rect x="416" y="95" width="14" height="90" rx="3" fill="#ff7b7b" />
        <circle cx="290" cy="110" r="9" fill="#fff" /><path d="M200 140 Q250 120 282 112" stroke="#fff" strokeOpacity=".25" strokeWidth="8" fill="none" strokeLinecap="round" />
        <text x="170" y="48" fontSize="44" fill="#fff" fillOpacity=".5" fontFamily="Arial" fontWeight="700" textAnchor="middle">3</text>
        <text x="290" y="48" fontSize="44" fill="#fff" fillOpacity=".5" fontFamily="Arial" fontWeight="700" textAnchor="middle">1</text>
      </>);
    default: // skyhop
      return (<>
        <defs><linearGradient id={g("bg")} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1f33" /><stop offset="1" stopColor="#2c7aa0" /></linearGradient></defs>
        <rect width="460" height="215" fill={`url(#${g("bg")})`} />
        <ellipse cx="90" cy="45" rx="42" ry="14" fill="#fff" opacity=".12" /><ellipse cx="350" cy="30" rx="56" ry="16" fill="#fff" opacity=".1" />
        <rect x="290" y="0" width="52" height="70" fill="#a4d007" /><rect x="284" y="62" width="64" height="14" rx="3" fill="#bfe83a" />
        <rect x="290" y="150" width="52" height="65" fill="#a4d007" /><rect x="284" y="144" width="64" height="14" rx="3" fill="#bfe83a" />
        <rect x="120" y="0" width="52" height="40" fill="#a4d007" /><rect x="114" y="34" width="64" height="14" rx="3" fill="#bfe83a" />
        <rect x="120" y="120" width="52" height="95" fill="#a4d007" /><rect x="114" y="114" width="64" height="14" rx="3" fill="#bfe83a" />
        <g transform="translate(220 100) rotate(-12)">
          <circle r="20" fill="#feca57" /><circle cx="8" cy="-5" r="4.5" fill="#1b2838" /><path d="M16 2 L30 6 L16 10 Z" fill="#ff9f43" />
          <path d="M-14 4 Q-30 -6 -26 12 Q-18 14 -10 10 Z" fill="#f4a620" />
        </g>
      </>);
  }
}

export default function OriginalCover({ original, className = "" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 460 215" className={className} role="img" aria-label={`${original.name} cover art`} preserveAspectRatio="xMidYMid slice">
      <Art id={id} k={original.key} />
      <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".75" /></linearGradient>
      <rect width="460" height="215" fill={`url(#${id}-fade)`} />
      <text x="16" y="198" fontSize="26" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif" letterSpacing="1" style={{ textTransform: "uppercase" }}>{original.name}</text>
    </svg>
  );
}
