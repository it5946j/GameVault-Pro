import { useState, useEffect } from "react";

/**
 * Ticks a number upward at random intervals to simulate a live counter
 * (e.g. "games online now"). Preserves the original component's behavior,
 * now reusable across Hero and any future stats widgets.
 */
export function useLiveCounter(start, { minStep = 1, maxStep = 3, intervalMs = 1800 } = {}) {
  const [count, setCount] = useState(start);
  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * (maxStep - minStep + 1)) + minStep);
    }, intervalMs);
    return () => clearInterval(t);
  }, [minStep, maxStep, intervalMs]);
  return count;
}

export default useLiveCounter;
