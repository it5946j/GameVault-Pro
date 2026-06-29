import { gsap } from "./gsap";

/**
 * Subtle mouse-follow parallax: elements with [data-depth] move opposite
 * the cursor, scaled by their depth value (higher depth = more movement).
 * Used for the hero's nebula orbs, particles, and floating controller.
 *
 * Usage:
 *   <div data-depth="0.3" ref={orbRef} />
 *   useEffect(() => initParallax(heroSectionRef.current), [])
 */
export function initParallax(container) {
  if (!container) return () => {};

  const targets = container.querySelectorAll("[data-depth]");
  if (!targets.length) return () => {};

  function handleMove(e) {
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;

    targets.forEach((el) => {
      const depth = parseFloat(el.dataset.depth) || 0.2;
      gsap.to(el, {
        x: dx * depth * 60,
        y: dy * depth * 60,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }

  container.addEventListener("mousemove", handleMove);
  return () => container.removeEventListener("mousemove", handleMove);
}

/**
 * Drives a CSS custom property (--mx, --my) for a radial-gradient "mouse
 * glow" effect, cheaper than animating a real DOM element per frame.
 */
export function initMouseGlow(container) {
  if (!container) return () => {};
  function handleMove(e) {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    container.style.setProperty("--mx", `${x}%`);
    container.style.setProperty("--my", `${y}%`);
  }
  container.addEventListener("mousemove", handleMove);
  return () => container.removeEventListener("mousemove", handleMove);
}
