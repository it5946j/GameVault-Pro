import { gsap, ScrollTrigger } from "./gsap";

/**
 * Fades + lifts an element in as it enters the viewport.
 * Usage: useEffect(() => revealOnScroll(ref.current), [])
 */
export function revealOnScroll(el, { y = 40, delay = 0, duration = 0.9 } = {}) {
  if (!el) return;
  gsap.fromTo(
    el,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    }
  );
}

/**
 * Staggers reveal across a list of child elements (e.g. a row of GameCards).
 */
export function revealStagger(container, childSelector, { stagger = 0.06, y = 30 } = {}) {
  if (!container) return;
  const children = container.querySelectorAll(childSelector);
  if (!children.length) return;
  gsap.fromTo(
    children,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    }
  );
}

/** Pins an element and scrubs a timeline across the scroll range — used for the hero's cinematic intro. */
export function pinAndScrub(trigger, timeline, { start = "top top", end = "+=100%" } = {}) {
  if (!trigger || !timeline) return;
  ScrollTrigger.create({
    trigger,
    start,
    end,
    pin: true,
    scrub: 1,
    animation: timeline,
  });
}

export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}
