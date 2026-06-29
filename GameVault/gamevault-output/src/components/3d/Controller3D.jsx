import { useRef, useState, useEffect, Suspense, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// ─── Error boundary so a 3D failure never breaks the page ────────────────────
class R3FErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

// ─── Materials (created once, reused across meshes) ──────────────────────────
const createMats = () => ({
  body: new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0A1428"),
    metalness: 0.85,
    roughness: 0.25,
    envMapIntensity: 1.2,
  }),
  bodyEdge: new THREE.MeshStandardMaterial({
    color: new THREE.Color("#111E38"),
    metalness: 0.7,
    roughness: 0.3,
  }),
  dark: new THREE.MeshStandardMaterial({
    color: new THREE.Color("#040810"),
    metalness: 0.9,
    roughness: 0.15,
  }),
  accent: new THREE.MeshStandardMaterial({
    color: new THREE.Color("#1A2640"),
    metalness: 0.6,
    roughness: 0.4,
  }),
  btnRed: new THREE.MeshStandardMaterial({ color: "#EF4444", emissive: "#EF4444", emissiveIntensity: 1.4, roughness: 0.3 }),
  btnYellow: new THREE.MeshStandardMaterial({ color: "#F59E0B", emissive: "#F59E0B", emissiveIntensity: 1.4, roughness: 0.3 }),
  btnBlue: new THREE.MeshStandardMaterial({ color: "#3B82F6", emissive: "#3B82F6", emissiveIntensity: 1.4, roughness: 0.3 }),
  btnGreen: new THREE.MeshStandardMaterial({ color: "#10B981", emissive: "#10B981", emissiveIntensity: 1.4, roughness: 0.3 }),
  stickCyan: new THREE.MeshStandardMaterial({ color: "#00D4FF", emissive: "#00D4FF", emissiveIntensity: 0.6, metalness: 0.5, roughness: 0.4 }),
  stickPurple: new THREE.MeshStandardMaterial({ color: "#8B5CF6", emissive: "#8B5CF6", emissiveIntensity: 0.6, metalness: 0.5, roughness: 0.4 }),
  dpad: new THREE.MeshStandardMaterial({ color: "#00D4FF", emissive: "#00D4FF", emissiveIntensity: 1.0 }),
  center: new THREE.MeshStandardMaterial({ color: "#8B5CF6", emissive: "#8B5CF6", emissiveIntensity: 1.2 }),
  glowStrip: new THREE.MeshStandardMaterial({ color: "#00D4FF", emissive: "#00D4FF", emissiveIntensity: 3.0 }),
  glowPurple: new THREE.MeshStandardMaterial({ color: "#8B5CF6", emissive: "#8B5CF6", emissiveIntensity: 2.5 }),
});

// ─── The 3D Controller Geometry ──────────────────────────────────────────────
function ControllerMesh({ mats }) {
  return (
    <group>
      {/* ── MAIN BODY CENTER ── */}
      <mesh material={mats.body}>
        <boxGeometry args={[2.7, 1.35, 0.56]} />
      </mesh>

      {/* ── SHOULDER WINGS ── */}
      <mesh position={[-1.52, 0.0, 0]} material={mats.body}>
        <boxGeometry args={[0.72, 1.18, 0.53]} />
      </mesh>
      <mesh position={[1.52, 0.0, 0]} material={mats.body}>
        <boxGeometry args={[0.72, 1.18, 0.53]} />
      </mesh>

      {/* ── GRIP CYLINDERS ── */}
      <mesh position={[-1.52, -1.1, 0.0]} rotation={[0.06, 0, 0.04]} material={mats.body}>
        <cylinderGeometry args={[0.31, 0.26, 1.05, 20]} />
      </mesh>
      <mesh position={[1.52, -1.1, 0.0]} rotation={[0.06, 0, -0.04]} material={mats.body}>
        <cylinderGeometry args={[0.31, 0.26, 1.05, 20]} />
      </mesh>

      {/* ── GRIP CAP SPHERES ── */}
      <mesh position={[-1.52, -1.68, 0.0]} material={mats.body}>
        <sphereGeometry args={[0.26, 18, 18]} />
      </mesh>
      <mesh position={[1.52, -1.68, 0.0]} material={mats.body}>
        <sphereGeometry args={[0.26, 18, 18]} />
      </mesh>

      {/* ── FACE BUTTONS (ABXY) ── */}
      <mesh position={[1.05, 0.18, 0.32]} material={mats.btnRed}>
        <sphereGeometry args={[0.115, 22, 22]} />
      </mesh>
      <mesh position={[0.83, 0.42, 0.32]} material={mats.btnYellow}>
        <sphereGeometry args={[0.115, 22, 22]} />
      </mesh>
      <mesh position={[0.61, 0.18, 0.32]} material={mats.btnBlue}>
        <sphereGeometry args={[0.115, 22, 22]} />
      </mesh>
      <mesh position={[0.83, -0.06, 0.32]} material={mats.btnGreen}>
        <sphereGeometry args={[0.115, 22, 22]} />
      </mesh>

      {/* ── LEFT ANALOG STICK ── */}
      <mesh position={[-0.56, -0.2, 0.29]} material={mats.dark}>
        <cylinderGeometry args={[0.22, 0.22, 0.09, 26]} />
      </mesh>
      <mesh position={[-0.56, -0.2, 0.37]} material={mats.stickCyan}>
        <sphereGeometry args={[0.19, 26, 26]} />
      </mesh>
      {/* Cyan ring around left stick */}
      <mesh position={[-0.56, -0.2, 0.28]} material={mats.dpad}>
        <torusGeometry args={[0.28, 0.022, 8, 32]} />
      </mesh>

      {/* ── RIGHT ANALOG STICK ── */}
      <mesh position={[0.56, -0.46, 0.29]} material={mats.dark}>
        <cylinderGeometry args={[0.22, 0.22, 0.09, 26]} />
      </mesh>
      <mesh position={[0.56, -0.46, 0.37]} material={mats.stickPurple}>
        <sphereGeometry args={[0.19, 26, 26]} />
      </mesh>
      {/* Purple ring around right stick */}
      <mesh position={[0.56, -0.46, 0.28]} material={mats.glowPurple}>
        <torusGeometry args={[0.28, 0.022, 8, 32]} />
      </mesh>

      {/* ── D-PAD (vertical + horizontal cross) ── */}
      <mesh position={[-1.01, -0.12, 0.31]} material={mats.dpad}>
        <boxGeometry args={[0.12, 0.46, 0.07]} />
      </mesh>
      <mesh position={[-1.01, -0.12, 0.31]} material={mats.dpad}>
        <boxGeometry args={[0.46, 0.12, 0.07]} />
      </mesh>
      {/* D-pad center sphere */}
      <mesh position={[-1.01, -0.12, 0.33]} material={mats.dpad}>
        <sphereGeometry args={[0.07, 14, 14]} />
      </mesh>

      {/* ── CENTER LOGO BUTTON ── */}
      <mesh position={[0, 0.02, 0.3]} material={mats.accent}>
        <cylinderGeometry args={[0.26, 0.26, 0.07, 32]} />
      </mesh>
      <mesh position={[0, 0.02, 0.36]} material={mats.center}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
      </mesh>

      {/* ── MENU / VIEW BUTTONS ── */}
      <mesh position={[-0.29, 0.2, 0.31]} material={mats.accent}>
        <boxGeometry args={[0.22, 0.1, 0.05]} />
      </mesh>
      <mesh position={[0.29, 0.2, 0.31]} material={mats.accent}>
        <boxGeometry args={[0.22, 0.1, 0.05]} />
      </mesh>

      {/* ── BUMPERS (LB / RB) ── */}
      <mesh position={[-1.52, 0.75, -0.06]} rotation={[0.38, 0, 0.02]} material={mats.bodyEdge}>
        <boxGeometry args={[0.6, 0.22, 0.34]} />
      </mesh>
      <mesh position={[1.52, 0.75, -0.06]} rotation={[0.38, 0, -0.02]} material={mats.bodyEdge}>
        <boxGeometry args={[0.6, 0.22, 0.34]} />
      </mesh>

      {/* ── TRIGGERS (LT / RT) ── */}
      <mesh position={[-1.52, 1.04, -0.22]} rotation={[0.62, 0, 0]} material={mats.bodyEdge}>
        <boxGeometry args={[0.54, 0.24, 0.36]} />
      </mesh>
      <mesh position={[1.52, 1.04, -0.22]} rotation={[0.62, 0, 0]} material={mats.bodyEdge}>
        <boxGeometry args={[0.54, 0.24, 0.36]} />
      </mesh>

      {/* ── GLOW STRIP (bottom edge LED) ── */}
      <mesh position={[0, -0.64, 0.29]} material={mats.glowStrip}>
        <boxGeometry args={[2.1, 0.055, 0.03]} />
      </mesh>

      {/* ── SIDE ACCENT LINES ── */}
      <mesh position={[-1.88, 0, 0.14]} rotation={[0, 0, 0]} material={mats.glowStrip}>
        <boxGeometry args={[0.03, 0.9, 0.03]} />
      </mesh>
      <mesh position={[1.88, 0, 0.14]} material={mats.glowPurple}>
        <boxGeometry args={[0.03, 0.9, 0.03]} />
      </mesh>
    </group>
  );
}

// ─── Scene root with lighting + float + mouse rotation ───────────────────────
function ControllerScene({ mouseX, mouseY }) {
  const groupRef = useRef(null);
  const mats = useRef(null);

  if (!mats.current) mats.current = createMats();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouseX * 0.55 + Math.sin(t * 0.35) * 0.18,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouseY * 0.25 + Math.sin(t * 0.22) * 0.07 + 0.12,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      {/* Ambient */}
      <ambientLight intensity={0.55} />
      {/* Cyan key light */}
      <pointLight position={[5, 5, 5]} color="#00D4FF" intensity={14} decay={2} />
      {/* Purple fill */}
      <pointLight position={[-5, -3, 3]} color="#8B5CF6" intensity={9} decay={2} />
      {/* Green accent */}
      <pointLight position={[0, -6, 4]} color="#10B981" intensity={3} decay={2} />
      {/* Warm rim */}
      <pointLight position={[0, 6, -2]} color="#F59E0B" intensity={2} decay={3} />

      <Float speed={1.5} rotationIntensity={0.06} floatIntensity={0.45}>
        <ControllerMesh mats={mats.current} />
      </Float>
    </group>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
export default function Controller3D({ className, style }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <R3FErrorBoundary fallback={null}>
      <Canvas
        className={className}
        style={{ background: "transparent", ...style }}
        camera={{ position: [0, 0, 7.2], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ControllerScene mouseX={mouse.x} mouseY={mouse.y} />
        </Suspense>
      </Canvas>
    </R3FErrorBoundary>
  );
}
