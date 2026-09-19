import { Unlock, Zap, Crown } from "lucide-react";
import SubscriptionSection from "../components/Subscription/SubscriptionSection";
import GameShelf from "../components/Shelf/GameShelf";
import { fetchPopular } from "../api/rawg";
import { theme as T } from "../styles/theme";

const onlyTier = (tier) => (games) => games.filter((g) => g.tier === tier).slice(0, 12);

export default function Plans() {
  return (
    <>
      <SubscriptionSection />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 40px" }}>
        <GameShelf
          title="Free Games"
          eyebrow="INCLUDED WITH BASIC — FREE"
          icon={Unlock}
          accentColor="#94A3B8"
          fetcher={fetchPopular}
          pageSize={48}
          postProcess={onlyTier(0)}
        />
        <GameShelf
          title="Pro Games"
          eyebrow="UNLOCKED WITH PRO"
          icon={Zap}
          accentColor={T.cyan}
          fetcher={fetchPopular}
          pageSize={48}
          postProcess={onlyTier(1)}
        />
        <GameShelf
          title="Ultimate Games"
          eyebrow="UNLOCKED WITH ULTIMATE"
          icon={Crown}
          accentColor={T.purple}
          fetcher={fetchPopular}
          pageSize={48}
          postProcess={onlyTier(2)}
        />
      </div>
    </>
  );
}
