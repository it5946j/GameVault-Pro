import { theme as T } from "../styles/theme";

export const PLANS = [
  {
    name: "Basic",
    price: 0,
    tier: 0,
    color: "#94A3B8",
    games: 15,
    desc: "Start gaming for free.",
    features: ["Access to 15 games", "HD quality", "Single device", "Community support", "Ad-supported"],
  },
  {
    name: "Pro",
    price: 9.99,
    tier: 1,
    color: T.cyan,
    games: 40,
    desc: "The most popular choice.",
    features: ["Access to 40+ games", "Full HD quality", "2 devices", "Priority support", "Ad-free", "Exclusive titles"],
    popular: true,
  },
  {
    name: "Ultimate",
    price: 19.99,
    tier: 2,
    color: T.purple,
    games: "100+",
    desc: "For serious gamers.",
    features: ["100+ games & growing", "4K ultra quality", "4 devices", "24/7 VIP support", "Ad-free", "All exclusive titles", "Early access"],
  },
];

export default PLANS;
