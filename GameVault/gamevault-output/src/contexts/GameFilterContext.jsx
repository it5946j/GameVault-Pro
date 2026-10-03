import { createContext, useContext, useState } from "react";

const GameFilterContext = createContext(null);

/**
 * Holds search/genre/sort state so Navbar's search box and the Library
 * page's filter bar can share state without prop-drilling through App.jsx,
 * the way the original single-file component did with local useState.
 */
export function GameFilterProvider({ children }) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("hot"); // hot | new | rating | players | az

  const value = {
    search, setSearch,
    genre, setGenre,
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
