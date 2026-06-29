import { createContext, useContext, useState } from "react";

const GameFilterContext = createContext(null);

/**
 * Holds search/genre/tier/sort state so Navbar's search box and the Library
 * page's filter bar can share state without prop-drilling through App.jsx,
 * the way the original single-file component did with local useState.
 */
export function GameFilterProvider({ children }) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [tierFilter, setTierFilter] = useState(0); // 0=all, 1=Basic, 2=Pro, 3=Ultimate
  const [sort, setSort] = useState("hot"); // hot | new | rating | players | az

  const value = {
    search, setSearch,
    genre, setGenre,
    tierFilter, setTierFilter,
    sort, setSort,
  };

  return <GameFilterContext.Provider value={value}>{children}</GameFilterContext.Provider>;
}

export function useGameFilters() {
  const ctx = useContext(GameFilterContext);
  if (!ctx) throw new Error("useGameFilters must be used within a GameFilterProvider");
  return ctx;
}

export default GameFilterContext;
