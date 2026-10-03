import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Gamepad2, Menu, X } from "lucide-react";
import { GENRES_ALL } from "../../data/genreMeta";
import { useGameFilters } from "../../contexts/GameFilterContext";

const MENU = [
  { to: "/", label: "Store" },
  { to: "/library", label: "Library" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/arcade", label: "Arcade" },
];

export default function Navbar() {
  const { search, setSearch, setGenre, setSort } = useGameFilters();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function browse({ genre = "All", sort = "hot" } = {}) {
    setGenre(genre);
    setSort(sort);
    setSearch("");
    navigate("/library");
  }

  function onSearch(e) {
    setSearch(e.target.value);
    if (location.pathname !== "/library") navigate("/library");
  }

  const isActive = (to) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));

  return (
    <header className="gh">
      <div className="gh-top">
        <div className="store-wrap wide gh-row1" style={{ position: "relative" }}>
          <Link to="/" className="gh-logo" onClick={() => setOpen(false)}>
            <Gamepad2 size={34} /> GameVault
          </Link>
          <nav className={`gh-menu${open ? " open" : ""}`}>
            {MENU.map(({ to, label }) => (
              <Link key={to} to={to} className={isActive(to) ? "active" : ""} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="gh-right">
            <button className="btn-install" onClick={() => navigate("/arcade")}>
              <Gamepad2 size={13} /> Play free
            </button>
            <button className="gh-login" onClick={() => navigate("/login")}>login</button>
            <button className="gh-hamburger" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
      <div className="store-nav">
        <div className="store-nav-inner store-wrap wide">
          <div className="store-nav-tabs">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Your Store</Link>
            <button onClick={() => browse({ sort: "new" })}>New &amp; Noteworthy</button>
            <div className="tab-menu">
              <button>Categories</button>
              <div className="dropdown">
                {GENRES_ALL.filter((g) => g !== "All").map((g) => (
                  <button key={g} onClick={() => browse({ genre: g })}>{g.replace("_", " ")}</button>
                ))}
              </div>
            </div>
            <button onClick={() => browse({ sort: "rating" })}>Top Rated</button>
          </div>
          <div className="store-search">
            <input value={search} onChange={onSearch} placeholder="search" aria-label="Search games" />
            <Search size={14} />
          </div>
        </div>
      </div>
    </header>
  );
}
