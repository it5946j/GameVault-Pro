import { useEffect, useRef } from "react";
import Hero from "../components/Hero/Hero";
import FeaturedCarousel from "../components/Featured/FeaturedCarousel";
import StatsSection from "../components/Stats/StatsSection";
import DiscoverSection from "../components/Discover/DiscoverSection";
import GenreGrid from "../components/GenreGrid/GenreGrid";
import SubscriptionSection from "../components/Subscription/SubscriptionSection";
import { revealOnScroll } from "../animations/scrollEffects";

export default function Home() {
  const featRef = useRef(null);
  const statsRef = useRef(null);
  const genreRef = useRef(null);
  const subRef = useRef(null);

  useEffect(() => {
    // Stagger section reveals
    const els = [featRef, statsRef, genreRef, subRef];
    els.forEach((ref, i) => {
      if (ref.current) revealOnScroll(ref.current, { delay: i * 0.05, y: 30 });
    });
  }, []);

  return (
    <>
      <Hero />
      <div ref={featRef}>
        <FeaturedCarousel />
      </div>
      <div ref={statsRef}>
        <StatsSection />
      </div>
      <DiscoverSection />
      <div ref={genreRef}>
        <GenreGrid />
      </div>
      <div ref={subRef}>
        <SubscriptionSection />
      </div>
    </>
  );
}
