import { useEffect, useRef, useCallback } from "react";
import { Tag } from "lucide-react";
import Hero from "../components/Hero/Hero";
import FeaturedCarousel from "../components/Featured/FeaturedCarousel";
import StatsSection from "../components/Stats/StatsSection";
import DiscoverSection from "../components/Discover/DiscoverSection";
import GenreGrid from "../components/GenreGrid/GenreGrid";
import SubscriptionSection from "../components/Subscription/SubscriptionSection";
import GameShelf from "../components/Shelf/GameShelf";
import { fetchPopular } from "../api/rawg";
import { theme as T } from "../styles/theme";
import { revealOnScroll } from "../animations/scrollEffects";

const onlyDiscounted = (games) =>
  games.filter((g) => g.discount > 0).sort((a, b) => b.discount - a.discount).slice(0, 14);

export default function Home() {
  const featRef = useRef(null);
  const dealsRef = useRef(null);
  const statsRef = useRef(null);
  const genreRef = useRef(null);
  const subRef = useRef(null);

  useEffect(() => {
    // Stagger section reveals
    const els = [featRef, dealsRef, statsRef, genreRef, subRef];
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
      <div ref={dealsRef} style={{ padding: "0 24px 0", maxWidth: 1280, margin: "0 auto" }}>
        <GameShelf
          title="Special Offers"
          eyebrow="LIMITED-TIME DEALS"
          icon={Tag}
          accentColor={T.green}
          fetcher={fetchPopular}
          pageSize={48}
          postProcess={onlyDiscounted}
          viewAllTo="/marketplace"
        />
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
