import { Gamepad2, Twitter, Github, Youtube, Twitch, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { theme as T } from "../../styles/theme";
import "./Footer.css";

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Browse Games", href: "/library" },
      { label: "New Releases", href: "/library" },
      { label: "Top Rated", href: "/library" },
      { label: "Genres", href: "/library" },
      { label: "Developers", href: "/" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign Up", href: "/login" },
      { label: "Log In", href: "/login" },
      { label: "Subscription", href: "/plans" },
      { label: "Settings", href: "/settings" },
      { label: "Support", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Blog", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Press", href: "/" },
      { label: "Contact", href: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy", href: "/" },
      { label: "DMCA", href: "/" },
      { label: "Accessibility", href: "/" },
    ],
  },
];

const SOCIAL = [
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: MessageCircle, label: "Discord", href: "#" },
  { icon: Twitch, label: "Twitch", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${T.border}`,
      background: `linear-gradient(180deg, ${T.bg} 0%, ${T.surface} 100%)`,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: 0, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 200,
        background: `radial-gradient(ellipse, ${T.purpleDim} 0%, transparent 70%)`,
        filter: "blur(40px)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px 0", position: "relative" }}>
        {/* Top row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 60,
          marginBottom: 48,
          flexWrap: "wrap",
        }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: `linear-gradient(135deg, ${T.cyan}, ${T.purple})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 20px ${T.cyanGlow}`,
              }}>
                <Gamepad2 size={20} color="#000" strokeWidth={2.5} />
              </div>
              <span style={{
                fontSize: 20, fontWeight: 900,
                fontFamily: T.fontDisplay,
                color: T.text, letterSpacing: -0.5,
              }}>
                Game<span style={{ color: T.cyan }}>Vault</span>
              </span>
            </div>
            <p style={{
              fontSize: 13, color: T.textSec,
              lineHeight: 1.7, marginBottom: 20, maxWidth: 240,
            }}>
              The world's largest online gaming platform. Millions of games across every genre — instant play, no downloads.
            </p>

            {/* Social */}
            <div style={{ display: "flex", gap: 8 }}>
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.12, backgroundColor: T.card }}
                  style={{
                    width: 36, height: 36,
                    borderRadius: 9,
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: T.textSec,
                    transition: "all 0.2s",
                    textDecoration: "none",
                  }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
          }}
            className="footer-links-grid"
          >
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 style={{
                  fontSize: 11, fontWeight: 700,
                  color: T.textMuted,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}>
                  {col.title}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.links.map((link) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      whileHover={{ x: 3, color: T.text }}
                      style={{
                        fontSize: 13,
                        color: T.textSec,
                        transition: "color 0.15s",
                        textDecoration: "none",
                      }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${T.border}`,
          padding: "20px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <span style={{ fontSize: 12, color: T.textMuted }}>
            © {new Date().getFullYear()} GameVault Inc. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: T.green,
              boxShadow: `0 0 6px ${T.green}`,
              display: "inline-block",
              animation: "pulse-dot 2s infinite",
            }} />
            <span style={{ fontSize: 12, color: T.textMuted }}>All systems operational</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-links-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .footer-links-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
