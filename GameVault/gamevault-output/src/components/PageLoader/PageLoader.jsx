import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { theme as T } from "../../styles/theme";

export default function PageLoader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const steps = [20, 45, 70, 90, 100];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setDone(true), 300);
      }
    }, 220);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: T.bg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {/* Background glow */}
          <div style={{
            position: "absolute",
            width: 400, height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.purpleDim} 0%, transparent 70%)`,
            filter: "blur(60px)",
            pointerEvents: "none",
          }} />

          {/* Logo */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, -5, 5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 72, height: 72,
              borderRadius: 20,
              background: `linear-gradient(135deg, ${T.cyan}, ${T.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 40px ${T.cyanGlow}, 0 0 80px ${T.purpleGlow}`,
            }}
          >
            <Gamepad2 size={36} color="#000" strokeWidth={2.5} />
          </motion.div>

          {/* Brand name */}
          <div style={{
            fontSize: 28,
            fontWeight: 900,
            fontFamily: T.fontDisplay,
            color: T.text,
            letterSpacing: -1,
          }}>
            Game<span style={{ color: T.cyan }}>Vault</span>
          </div>

          {/* Progress bar */}
          <div style={{
            width: 200,
            height: 3,
            background: T.border,
            borderRadius: 2,
            overflow: "hidden",
          }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${T.cyan}, ${T.purple})`,
                borderRadius: 2,
                boxShadow: `0 0 8px ${T.cyan}`,
              }}
            />
          </div>

          <p style={{ fontSize: 12, color: T.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>
            Loading platform…
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
