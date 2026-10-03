import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-steam">
      <div className="store-wrap">
        <div style={{ color: "#fff", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontSize: 16 }}>GameVault</div>
        <div className="cols">
          <div>
            <h5>Store</h5>
            <Link to="/">Home</Link>
            <Link to="/library">Browse Games</Link>
            <Link to="/plans">Plans</Link>
          </div>
          <div>
            <h5>Account</h5>
            <Link to="/login">Log in</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/profile">Profile</Link>
          </div>
          <div>
            <h5>Community</h5>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/upload">Upload a game</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "#67707b", maxWidth: 700 }}>
          Game data provided by RAWG. All trademarks are property of their respective owners.
          GameVault is not affiliated with Valve Corporation or Steam.
        </p>
      </div>
    </footer>
  );
}
