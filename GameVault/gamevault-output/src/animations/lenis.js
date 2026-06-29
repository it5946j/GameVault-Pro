import Lenis from "@studio-freight/lenis";

let lenisInstance = null;

/**
 * Initializes Lenis smooth/inertia scrolling for the whole document.
 * Call once near the app root (see App.jsx) and clean up on unmount.
 *
 * This replaces native scroll with an eased, momentum-based scroll —
 * the "professional inertia scrolling" referenced in the brief, in the
 * same family as Apple/Stripe/Linear marketing sites.
 */
export function initLenis() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 4), // quartic ease-out, snappier than the default cubic
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

export function destroyLenis() {
  lenisInstance?.destroy();
  lenisInstance = null;
}

/** Lets GSAP ScrollTrigger and Lenis agree on scroll position (wired in scrollEffects.js). */
export function onLenisScroll(callback) {
  lenisInstance?.on("scroll", callback);
}

export default initLenis;
