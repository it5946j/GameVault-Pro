import { Routes, Route } from "react-router-dom";
import { GameFilterProvider } from "./contexts/GameFilterContext";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import Library from "./pages/Library";
import Marketplace from "./pages/Marketplace";
import Upload from "./pages/Upload";
import Game from "./pages/Game";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

export default function App() {
  return (
    <GameFilterProvider>
      <div style={{ minHeight: "100vh", color: "var(--text)" }}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </GameFilterProvider>
  );
}
