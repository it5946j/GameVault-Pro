import { Routes, Route, Navigate } from "react-router-dom";
import { GameFilterProvider } from "./contexts/GameFilterContext";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import Library from "./pages/Library";
import Marketplace from "./pages/Marketplace";
import Upload from "./pages/Upload";
import Game from "./pages/Game";
import GamePlay from "./pages/GamePlay";
import Arcade from "./pages/Arcade";
import Intro from "./components/Intro/Intro";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

export default function App() {
  return (
    <GameFilterProvider>
      <Intro />
      <div style={{ minHeight: "100vh", color: "var(--text)", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/game/:id/play" element={<GamePlay />} />
            <Route path="/arcade" element={<Arcade />} />
            <Route path="/arcade/:key" element={<Arcade />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </GameFilterProvider>
  );
}
