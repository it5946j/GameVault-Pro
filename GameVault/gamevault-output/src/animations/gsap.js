import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./lenis";

gsap.registerPlugin(ScrollTrigger);

let wired = false;

/**
 * Bridges Lenis's smooth scroll with GSAP's ScrollTrigger so
 * scroll-triggered animations (parallax, reveals) fire at the correct,
 * eased scroll position rather than the raw native scroll position.
 * Call once after initLenis() — see App.jsx.
 */
export function wireGsapToLenis() {
  if (wired) return;
  const lenis = getLenis();
  if (!lenis) return;

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  wired = true;
}

export { gsap, ScrollTrigger };
export default gsap;
