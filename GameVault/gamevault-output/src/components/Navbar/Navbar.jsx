import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Gamepad2, Bell, X, Menu, ChevronDown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { theme as T } from "../../styles/theme";
import { useGameFilters } from "../../contexts/GameFilterContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/library", label: "Library" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/plans", label: "Plans" },
];

export default function Navbar() {
  const { search, setSearch } = useGameFilters();
  const location = useLocation();
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  function handleSearchChange(e) {
    setSearch(e.target.value);
    if (location.pathname !== "/library") navigate("/library");
  }

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          height: scrolled ? 56 : 70,
          backgroundColor: scrolled ? "rgba(4,6,13,0.97)" : "rgba(4,6,13,0.6)",
          borderBottomColor: scrolled ? "rgba(26,38,64,0.9)" : "rgba(26,38,64,0.3)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginRight: 8 }}>
            <motion.div
              whileHover={{ scale: 1.08, rotate: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${T.cyan}, ${T.purple})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 0 20px ${T.cyanGlow}`,
              }}
            >
              <Gamepad2 size={18} color="#000" strokeWidth={2.5} />
            </motion.div>
            <span style={{
              fontSize: 19,
              fontWeight: 800,
              color: T.text,
              letterSpacing: -0.5,
              fontFamily: T.fontDisplay,
              whiteSpace: "nowrap",
            }}>
              Game<span style={{ color: T.cyan }}>Vault</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: "flex", gap: 2, alignItems: "center" }} className="nav-links-desktop">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}>
                  <motion.div
                    whileHover={{ backgroundColor: "rgba(26,38,64,0.6)" }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: 13.5,
                      fontWeight: active ? 700 : 500,
                      color: active ? T.cyan : T.textSec,
                      position: "relative",
                      cursor: "pointer",
                      transition: "color 0.15s",
                    }}
                  >
                    {label}
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        style={{
                          position: "absolute",
                          bottom: -1,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 20,
                          height: 2,
                          background: T.cyan,
                          borderRadius: 1,
                          boxShadow: `0 0 8px ${T.cyan}`,
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Search bar — desktop */}
          <div style={{ flex: 1, maxWidth: 360, position: "relative" }} className="search-desktop">
            <Search size={14} color={T.textMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search games…"
              aria-label="Search games"
              style={{
                width: "100%",
                height: 36,
                background: focused ? T.card : T.surface,
                border: `1px solid ${focused ? T.cyan : T.border}`,
                borderRadius: 10,
                paddingLeft: 34,
                paddingRight: 12,
                color: T.text,
                fontSize: 13,
                outline: "none",
                transition: "all 0.2s",
                boxShadow: focused ? `0 0 0 3px ${T.cyanDim}` : "none",
              }}
            />
          </div>

          {/* Right side */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {/* Search icon mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
              className="search-mobile-btn"
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: "transparent",
                color: T.textSec,
                cursor: "pointer",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Search size={16} />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Notifications"
              className="notif-btn"
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: "transparent",
                color: T.textSec,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Bell size={16} />
              <span style={{
                position: "absolute", top: 7, right: 7,
                width: 7, height: 7,
                borderRadius: "50%",
                background: T.purple,
                boxShadow: `0 0 6px ${T.purpleGlow}`,
                border: `1.5px solid ${T.bg}`,
              }} />
            </motion.button>

            {/* Login */}
            <motion.button
              whileHover={{ backgroundColor: T.card }}
              onClick={() => navigate("/login")}
              className="login-btn"
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: "transparent",
                color: T.text,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Log in
            </motion.button>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 0 24px ${T.cyanGlow}` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/plans")}
              style={{
                padding: "7px 18px",
                borderRadius: 8,
                border: "none",
                background: `linear-gradient(135deg, ${T.cyan}, #0099CC)`,
                color: "#000",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              <Zap size={13} fill="#000" stroke="#000" />
              Get Started
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="hamburger-btn"
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: "transparent",
                color: T.text,
                cursor: "pointer",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "fixed",
              top: 56,
              left: 0,
              right: 0,
              zIndex: 199,
              padding: "12px 16px",
              background: "rgba(4,6,13,0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <div style={{ position: "relative" }}>
              <Search size={15} color={T.textMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                ref={searchRef}
                value={search}
                onChange={handleSearchChange}
                placeholder="Search games…"
                style={{
                  width: "100%", height: 42,
                  background: T.card,
                  border: `1px solid ${T.cyan}`,
                  borderRadius: 10,
                  paddingLeft: 36, paddingRight: 12,
                  color: T.text, fontSize: 14,
                  outline: "none",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 56,
              left: 0,
              right: 0,
              zIndex: 198,
              background: "rgba(4,6,13,0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: `1px solid ${T.border}`,
              padding: "16px",
            }}
          >
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}>
                <div style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  color: location.pathname === to ? T.cyan : T.text,
                  background: location.pathname === to ? T.cyanDim : "transparent",
                  marginBottom: 4,
                }}>
                  {label}
                </div>
              </Link>
            ))}
            <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 8, paddingTop: 12, display: "flex", gap: 8 }}>
              <button onClick={() => navigate("/login")} style={{
                flex: 1, padding: "10px", borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: "transparent", color: T.text,
                fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>Log in</button>
              <button onClick={() => navigate("/plans")} style={{
                flex: 1, padding: "10px", borderRadius: 8,
                border: "none",
                background: `linear-gradient(135deg, ${T.cyan}, #0099CC)`,
                color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer",
              }}>Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .search-desktop { display: none !important; }
          .login-btn { display: none !important; }
          .notif-btn { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .search-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
