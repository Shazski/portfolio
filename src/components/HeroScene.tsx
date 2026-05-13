import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { scrollState } from '../lib/scrollState';

const SKIN = '#f5d6bd';
const SKIN_SHADOW = '#e8b89d';
const LIP = '#d56b6b';
const HOODIE = '#1d1f2c';
const HOODIE_DARK = '#15161f';
const HOODIE_TRIM = '#ff5fb8';
const TSHIRT = '#0d1117';
const HAIR = '#ff6bc1';
const HAIR_DARK = '#c94aa0';
const EYE_GLOW = '#7afff0';
const EYE_DARK = '#0a0d18';
const NEON_PINK = '#ff5fb8';
const NEON_CYAN = '#7afff0';
const LAPTOP = '#cdd2d8';
const LAPTOP_DARK = '#9aa2ad';
const SCREEN = '#0d1117';
const ACCENT = '#7fffdf';
const ACCENT_STRONG = '#5cdfff';
const ACCENT_WARM = '#ffd166';
const ACCENT_PINK = '#ff79c6';
const MUG = '#f4f6fa';

function heroProgress(s: number) {
  const t = Math.min(1, s / 0.18);
  return 1 - Math.pow(1 - t, 2);
}

function CodeLine({
  y,
  width,
  color,
  indent = 0,
  delay,
  speed = 1.2,
}: {
  y: number;
  width: number;
  color: string;
  indent?: number;
  delay: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const cycle = 5;
    const localT = ((t * speed - delay) % cycle + cycle) % cycle;
    let progress = 0;
    if (localT < 1.2) progress = localT / 1.2;
    else if (localT < 4.5) progress = 1;
    else progress = 0;

    if (ref.current) {
      ref.current.scale.x = progress;
      ref.current.position.x = -0.55 + indent + (width * progress) / 2;
    }
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.9 + Math.sin(t * 4 + delay) * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={[-0.55 + indent, y, 0.022]}>
      <planeGeometry args={[width, 0.025]} />
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={1}
        toneMapped={false}
      />
    </mesh>
  );
}

function LaptopScreen() {
  const cursor = useRef<THREE.Mesh>(null);
  const cursorMat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (cursorMat.current) {
      cursorMat.current.opacity = Math.sin(t * 4) > 0 ? 1 : 0.1;
    }
    if (cursor.current) {
      const cycle = 5;
      const lt = (t * 1.2) % cycle;
      cursor.current.position.y = 0.22 - Math.floor(lt / 0.7) * 0.06;
    }
  });

  return (
    <group>
      {/* bezel */}
      <RoundedBox args={[1.5, 0.95, 0.04]} radius={0.04} smoothness={3} position={[0, 0, 0]}>
        <meshStandardMaterial color={LAPTOP_DARK} roughness={0.4} metalness={0.6} />
      </RoundedBox>

      {/* screen surface */}
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[1.36, 0.82]} />
        <meshStandardMaterial
          color={SCREEN}
          roughness={0.15}
          metalness={0.4}
          emissive={'#1a2030'}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* title bar */}
      <mesh position={[0, 0.35, 0.023]}>
        <planeGeometry args={[1.36, 0.06]} />
        <meshStandardMaterial color="#161b22" emissive="#161b22" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      {[
        { x: -0.6, c: '#ff5d5d' },
        { x: -0.54, c: '#ffd166' },
        { x: -0.48, c: '#5af0a4' },
      ].map((d, i) => (
        <mesh key={i} position={[d.x, 0.35, 0.024]}>
          <circleGeometry args={[0.014, 16]} />
          <meshStandardMaterial color={d.c} emissive={d.c} emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      ))}

      {/* file tab */}
      <mesh position={[-0.27, 0.35, 0.024]}>
        <planeGeometry args={[0.32, 0.04]} />
        <meshStandardMaterial color="#0d1117" emissive="#0d1117" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>

      {/* line numbers gutter */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[-0.62, 0.28 - i * 0.06, 0.023]}>
          <planeGeometry args={[0.05, 0.012]} />
          <meshStandardMaterial color="#3d4858" emissive="#3d4858" emissiveIntensity={0.5} toneMapped={false} />
        </mesh>
      ))}

      {/* code lines */}
      <CodeLine y={ 0.28} width={0.55} color={ACCENT_PINK}   indent={0.08} delay={0}   speed={1.1} />
      <CodeLine y={ 0.22} width={0.42} color={ACCENT_STRONG} indent={0.16} delay={0.5} speed={1.1} />
      <CodeLine y={ 0.16} width={0.36} color={ACCENT_WARM}   indent={0.24} delay={0.9} speed={1.1} />
      <CodeLine y={ 0.10} width={0.50} color={ACCENT}        indent={0.16} delay={1.2} speed={1.1} />
      <CodeLine y={ 0.04} width={0.30} color={ACCENT_STRONG} indent={0.24} delay={1.5} speed={1.1} />
      <CodeLine y={-0.02} width={0.46} color={ACCENT}        indent={0.16} delay={1.8} speed={1.1} />
      <CodeLine y={-0.08} width={0.38} color={ACCENT_PINK}   indent={0.08} delay={2.2} speed={1.1} />
      <CodeLine y={-0.14} width={0.52} color={ACCENT}        indent={0.16} delay={2.5} speed={1.1} />
      <CodeLine y={-0.20} width={0.28} color={ACCENT_WARM}   indent={0.24} delay={2.9} speed={1.1} />
      <CodeLine y={-0.26} width={0.44} color={ACCENT_STRONG} indent={0.08} delay={3.2} speed={1.1} />

      {/* blinking caret */}
      <mesh ref={cursor} position={[-0.05, 0.22, 0.024]}>
        <planeGeometry args={[0.012, 0.04]} />
        <meshStandardMaterial
          ref={cursorMat}
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1.4}
          transparent
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function AppleLogo({ size = 0.18 }: { size?: number }) {
  // Apple-silhouette shape (rounded body with a top dimple for the leaf cutout)
  const bodyShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.05, 0.95);
    s.bezierCurveTo(-0.55, 1.0, -1.0, 0.55, -1.0, -0.05);
    s.bezierCurveTo(-1.0, -0.85, -0.5, -1.1, 0.0, -1.1);
    s.bezierCurveTo(0.5, -1.1, 1.0, -0.85, 1.0, -0.05);
    s.bezierCurveTo(1.0, 0.55, 0.55, 1.0, 0.05, 0.95);
    // tiny top notch where the leaf stem meets the apple
    s.bezierCurveTo(0.04, 1.0, -0.04, 1.0, -0.05, 0.95);
    return s;
  }, []);

  // Leaf shape (small angled almond)
  const leafShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.25, 0);
    s.bezierCurveTo(-0.25, 0.3, 0.0, 0.45, 0.25, 0.25);
    s.bezierCurveTo(0.05, 0.05, 0.0, -0.05, -0.25, 0);
    return s;
  }, []);

  return (
    <group scale={size}>
      {/* apple body */}
      <mesh>
        <shapeGeometry args={[bodyShape]} />
        <meshStandardMaterial
          color="#f6f8fb"
          emissive="#cfe9ff"
          emissiveIntensity={0.55}
          metalness={0.2}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>
      {/* bite cutout: same color as lid, sits on top to "remove" a chunk */}
      <mesh position={[0.95, 0.25, 0.0005]}>
        <circleGeometry args={[0.38, 32]} />
        <meshStandardMaterial color={LAPTOP} roughness={0.3} metalness={0.75} />
      </mesh>
      {/* leaf */}
      <mesh position={[0.05, 1.0, 0.0005]} rotation={[0, 0, -0.4]}>
        <shapeGeometry args={[leafShape]} />
        <meshStandardMaterial
          color="#f6f8fb"
          emissive="#cfe9ff"
          emissiveIntensity={0.55}
          metalness={0.2}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Laptop() {
  const lid = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lid.current) {
      lid.current.rotation.x = -0.42 + Math.sin(t * 0.3) * 0.008;
    }
  });

  // bigger dimensions
  const W = 2.2;
  const D = 1.4;
  const baseH = 0.075;
  const screenW = 2.0;
  const screenH = 1.25;

  return (
    <group position={[0, -0.7, 0.72]} rotation={[-0.16, 0, 0]} scale={1.08}>
      {/* === Base === */}
      <RoundedBox args={[W, baseH, D]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color={LAPTOP} roughness={0.22} metalness={0.85} />
      </RoundedBox>
      {/* base bottom shadow strip */}
      <mesh position={[0, -baseH / 2 - 0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 0.92, D * 0.92]} />
        <meshStandardMaterial color="#9aa2ad" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* front bevel — Apple-style notch where you'd open the lid */}
      <mesh position={[0, 0.005, D / 2 - 0.01]}>
        <boxGeometry args={[0.4, 0.02, 0.04]} />
        <meshStandardMaterial color="#9aa2ad" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* === Trackpad (bigger, more centered) === */}
      <RoundedBox args={[0.95, 0.012, 0.55]} radius={0.02} smoothness={3} position={[0, 0.045, 0.36]}>
        <meshStandardMaterial color="#bcc3cc" roughness={0.18} metalness={0.5} />
      </RoundedBox>

      {/* === Keyboard well (recessed darker area) === */}
      <RoundedBox args={[1.92, 0.012, 0.78]} radius={0.02} smoothness={3} position={[0, 0.044, -0.18]}>
        <meshStandardMaterial color="#15181f" roughness={0.6} metalness={0.3} />
      </RoundedBox>

      {/* === Keys === */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 16 }).map((_, col) => (
          <RoundedBox
            key={`${row}-${col}`}
            args={[0.095, 0.018, 0.105]}
            radius={0.012}
            smoothness={2}
            position={[-0.78 + col * 0.105, 0.054, -0.42 + row * 0.13]}
          >
            <meshStandardMaterial color="#2e333c" roughness={0.45} metalness={0.4} />
          </RoundedBox>
        ))
      )}
      {/* spacebar (wider) */}
      <RoundedBox args={[0.7, 0.018, 0.105]} radius={0.012} smoothness={2} position={[0, 0.054, 0.23]}>
        <meshStandardMaterial color="#2e333c" roughness={0.45} metalness={0.4} />
      </RoundedBox>

      {/* keyboard backlight glow */}
      <pointLight position={[0, 0.2, -0.1]} intensity={0.32} color={ACCENT} distance={1.6} />

      {/* === Hinge === */}
      <mesh position={[0, 0.05, -D / 2 + 0.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.038, 0.038, W * 0.98, 20]} />
        <meshStandardMaterial color="#8a929d" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* === Lid (screen attached) === */}
      <group ref={lid} position={[0, 0.05, -D / 2 + 0.02]} rotation={[-0.42, 0, 0]}>
        <group position={[0, screenH / 2 + 0.02, 0]}>
          {/* === Lid back (aluminum shell) === */}
          <RoundedBox args={[screenW, screenH, 0.05]} radius={0.05} smoothness={4} position={[0, 0, -0.03]}>
            <meshStandardMaterial color={LAPTOP} roughness={0.22} metalness={0.88} />
          </RoundedBox>
          {/* subtle horizontal brush highlight */}
          <mesh position={[0, screenH / 2 - 0.1, -0.056]}>
            <planeGeometry args={[screenW * 0.95, 0.012]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.06} />
          </mesh>

          {/* === Apple logo on the back of the lid === */}
          <group position={[0, -0.05, -0.057]} rotation={[0, Math.PI, 0]}>
            <AppleLogo size={0.21} />
          </group>

          {/* === Front bezel (slimmer) === */}
          <RoundedBox args={[screenW, screenH, 0.05]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
            <meshStandardMaterial color="#0a0c10" roughness={0.4} metalness={0.5} />
          </RoundedBox>

          {/* === Screen content (scaled up to match new size) === */}
          <group scale={[screenW / 1.5, screenH / 0.95, 1]} position={[0, 0, 0.001]}>
            <LaptopScreen />
          </group>

          {/* === Notch (modern MacBook style) === */}
          <RoundedBox args={[0.28, 0.05, 0.012]} radius={0.012} smoothness={3} position={[0, screenH / 2 - 0.03, 0.028]}>
            <meshStandardMaterial color="#000000" roughness={0.3} />
          </RoundedBox>
          {/* webcam dot */}
          <mesh position={[0, screenH / 2 - 0.03, 0.034]}>
            <circleGeometry args={[0.008, 16]} />
            <meshStandardMaterial color="#1a1d24" roughness={0.2} metalness={0.6} />
          </mesh>
          {/* webcam green light (privacy indicator) */}
          <mesh position={[0.04, screenH / 2 - 0.03, 0.034]}>
            <circleGeometry args={[0.005, 12]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function CoffeeMug() {
  const steamRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    steamRefs.current.forEach((m, i) => {
      if (!m) return;
      const phase = (t * 0.6 + i * 0.4) % 1;
      m.position.y = 0.2 + phase * 0.55;
      m.position.x = Math.sin(phase * Math.PI * 2 + i) * 0.04;
      (m.material as THREE.MeshStandardMaterial).opacity = (1 - phase) * 0.4;
      const s = 0.05 + phase * 0.06;
      m.scale.set(s, s, s);
    });
  });

  return (
    <group position={[1.0, -0.7, 0.7]}>
      {/* body */}
      <mesh>
        <cylinderGeometry args={[0.13, 0.11, 0.26, 24]} />
        <meshStandardMaterial color={MUG} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* coffee surface */}
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.12, 24]} />
        <meshStandardMaterial color="#3a2418" roughness={0.7} />
      </mesh>
      {/* handle */}
      <mesh position={[0.15, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.018, 8, 20, Math.PI]} />
        <meshStandardMaterial color={MUG} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* heart logo */}
      <mesh position={[0, 0, 0.12]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial color={ACCENT_PINK} emissive={ACCENT_PINK} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      {/* steam */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} ref={(el) => (steamRefs.current[i] = el)} position={[0, 0.2, 0]}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color="#dfe5ed" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Developer() {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const leftForearm = useRef<THREE.Group>(null);
  const rightForearm = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Group>(null);
  const rightEye = useRef<THREE.Group>(null);
  const watchScreen = useRef<THREE.Mesh>(null);
  const blink = useRef({ next: 2.5, t: 0, dur: 0.13 });

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const s = scrollState.progress;
    const h = heroProgress(s);
    const v = scrollState.velocity;
    const mx = state.pointer.x;
    const my = state.pointer.y;

    if (root.current) {
      // small idle bob, low amplitude so typing looks steady
      root.current.position.y = -0.1 + Math.sin(t * 1.2) * 0.02;
      root.current.rotation.y = mx * 0.12 + h * Math.PI * 1.0 + s * Math.PI * 0.2;
      root.current.rotation.z = Math.sin(t * 0.5) * 0.012 + Math.min(0.15, v * 0.012);
      root.current.rotation.x = 0.14; // hunched forward over the laptop
    }

    if (torso.current) {
      torso.current.rotation.x = Math.sin(t * 2.4) * 0.008 - my * 0.025;
      torso.current.scale.y = 1 + Math.sin(t * 1.5) * 0.01;
    }

    if (head.current) {
      const tx = -my * 0.25 - 0.05;
      const ty = mx * 0.35;
      head.current.rotation.x += (tx - head.current.rotation.x) * 0.08;
      head.current.rotation.y += (ty - head.current.rotation.y) * 0.08;
      head.current.rotation.z = Math.sin(t * 0.9) * 0.02 + h * Math.PI * 0.2;
    }

    // typing — forearms tap at the elbow
    if (leftForearm.current) {
      leftForearm.current.rotation.x = -1.25 + Math.sin(t * 11) * 0.08;
    }
    if (rightForearm.current) {
      rightForearm.current.rotation.x = -1.25 + Math.cos(t * 11 + 1.1) * 0.08;
    }

    // smart watch screen pulse
    if (watchScreen.current) {
      const mat = watchScreen.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.1 + Math.sin(t * 3) * 0.4;
    }

    blink.current.next -= dt;
    if (blink.current.next <= 0) {
      blink.current.t = blink.current.dur;
      blink.current.next = 2.2 + Math.random() * 3.5;
    }
    let bs = 1;
    if (blink.current.t > 0) {
      blink.current.t -= dt;
      const p = blink.current.t / blink.current.dur;
      bs = Math.abs(p - 0.5) * 2;
    }
    if (leftEye.current) leftEye.current.scale.y = bs;
    if (rightEye.current) rightEye.current.scale.y = bs;
  });

  return (
    <group ref={root} position={[0, -0.1, -0.35]}>
      {/* === Torso (hoodie + t-shirt) === */}
      <group ref={torso}>
        {/* hoodie body */}
        <RoundedBox args={[1.0, 0.95, 0.55]} radius={0.18} smoothness={4} position={[0, -0.1, 0]}>
          <meshStandardMaterial color={HOODIE} roughness={0.92} metalness={0.0} />
        </RoundedBox>

        {/* t-shirt collar V */}
        <mesh position={[0, 0.32, 0.28]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.18, 0.18, 0.03]} />
          <meshStandardMaterial color={TSHIRT} roughness={0.85} />
        </mesh>

        {/* drawstrings */}
        <mesh position={[-0.09, 0.18, 0.27]}>
          <cylinderGeometry args={[0.011, 0.011, 0.26, 8]} />
          <meshStandardMaterial color="#bcc4d0" roughness={0.6} />
        </mesh>
        <mesh position={[0.09, 0.18, 0.27]}>
          <cylinderGeometry args={[0.011, 0.011, 0.26, 8]} />
          <meshStandardMaterial color="#bcc4d0" roughness={0.6} />
        </mesh>
        <mesh position={[-0.09, 0.04, 0.275]}>
          <sphereGeometry args={[0.02, 12, 10]} />
          <meshStandardMaterial color="#bcc4d0" roughness={0.5} />
        </mesh>
        <mesh position={[0.09, 0.04, 0.275]}>
          <sphereGeometry args={[0.02, 12, 10]} />
          <meshStandardMaterial color="#bcc4d0" roughness={0.5} />
        </mesh>

        {/* kangaroo pocket */}
        <RoundedBox args={[0.7, 0.22, 0.04]} radius={0.04} smoothness={3} position={[0, -0.32, 0.26]}>
          <meshStandardMaterial color={HOODIE_DARK} roughness={0.9} />
        </RoundedBox>
        {/* zipper */}
        <mesh position={[0, -0.1, 0.276]}>
          <boxGeometry args={[0.012, 0.85, 0.004]} />
          <meshStandardMaterial color="#5c6373" roughness={0.5} metalness={0.6} />
        </mesh>

        {/* === Arms — two-segment, reaching forward onto keyboard === */}
        {/* LEFT ARM */}
        <group position={[-0.46, -0.18, 0]}>
          {/* shoulder pivot — angles down and slightly forward */}
          <group rotation={[0.45, 0, 0.18]}>
            {/* upper arm (sleeve) */}
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.115, 0.36, 8, 14]} />
              <meshStandardMaterial color={HOODIE} roughness={0.92} />
            </mesh>
            {/* sleeve cuff */}
            <mesh position={[0, -0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.118, 0.018, 8, 20]} />
              <meshStandardMaterial color={HOODIE_DARK} roughness={0.92} />
            </mesh>
            {/* elbow joint */}
            <group position={[0, -0.46, 0]}>
              <mesh>
                <sphereGeometry args={[0.12, 18, 14]} />
                <meshStandardMaterial color={HOODIE_DARK} roughness={0.92} />
              </mesh>
              {/* FOREARM — bends forward at elbow so hand reaches keyboard */}
              <group ref={leftForearm} rotation={[-1.25, 0, 0]}>
                {/* forearm sleeve continuation */}
                <mesh position={[0, -0.16, 0]}>
                  <capsuleGeometry args={[0.105, 0.22, 8, 14]} />
                  <meshStandardMaterial color={HOODIE} roughness={0.92} />
                </mesh>
                {/* wrist skin exposed past cuff */}
                <mesh position={[0, -0.33, 0]}>
                  <cylinderGeometry args={[0.085, 0.08, 0.08, 16]} />
                  <meshStandardMaterial color={SKIN} roughness={0.7} />
                </mesh>
                {/* hand — palm-down resting on keys */}
                <mesh position={[0, -0.43, 0.04]} rotation={[Math.PI / 2 - 0.1, 0, 0.05]}>
                  <RoundedBox args={[0.19, 0.13, 0.075]} radius={0.04} smoothness={3}>
                    <meshStandardMaterial color={SKIN} roughness={0.7} />
                  </RoundedBox>
                </mesh>
                {/* tiny finger lines hint */}
                <mesh position={[0, -0.495, 0.06]} rotation={[Math.PI / 2 - 0.1, 0, 0]}>
                  <boxGeometry args={[0.14, 0.012, 0.005]} />
                  <meshStandardMaterial color={SKIN_SHADOW} roughness={0.6} />
                </mesh>
                {/* smart watch on this wrist */}
                <group position={[0, -0.34, 0.085]} rotation={[Math.PI / 2, 0, 0]}>
                  <RoundedBox args={[0.13, 0.085, 0.035]} radius={0.012} smoothness={3}>
                    <meshStandardMaterial color="#15171c" roughness={0.5} metalness={0.5} />
                  </RoundedBox>
                  <mesh ref={watchScreen} position={[0, 0, 0.02]}>
                    <planeGeometry args={[0.105, 0.065]} />
                    <meshStandardMaterial color={ACCENT_STRONG} emissive={ACCENT_STRONG} emissiveIntensity={1.2} toneMapped={false} />
                  </mesh>
                  {[0, 1, 2].map((i) => (
                    <mesh key={i} position={[-0.025 + i * 0.025, 0, 0.022]}>
                      <planeGeometry args={[0.014, 0.014]} />
                      <meshStandardMaterial color="#0d1117" />
                    </mesh>
                  ))}
                </group>
              </group>
            </group>
          </group>
        </group>

        {/* RIGHT ARM (mirrored) */}
        <group position={[0.46, -0.18, 0]}>
          <group rotation={[0.45, 0, -0.18]}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.115, 0.36, 8, 14]} />
              <meshStandardMaterial color={HOODIE} roughness={0.92} />
            </mesh>
            <mesh position={[0, -0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.118, 0.018, 8, 20]} />
              <meshStandardMaterial color={HOODIE_DARK} roughness={0.92} />
            </mesh>
            <group position={[0, -0.46, 0]}>
              <mesh>
                <sphereGeometry args={[0.12, 18, 14]} />
                <meshStandardMaterial color={HOODIE_DARK} roughness={0.92} />
              </mesh>
              <group ref={rightForearm} rotation={[-1.25, 0, 0]}>
                <mesh position={[0, -0.16, 0]}>
                  <capsuleGeometry args={[0.105, 0.22, 8, 14]} />
                  <meshStandardMaterial color={HOODIE} roughness={0.92} />
                </mesh>
                <mesh position={[0, -0.33, 0]}>
                  <cylinderGeometry args={[0.085, 0.08, 0.08, 16]} />
                  <meshStandardMaterial color={SKIN} roughness={0.7} />
                </mesh>
                <mesh position={[0, -0.43, 0.04]} rotation={[Math.PI / 2 - 0.1, 0, -0.05]}>
                  <RoundedBox args={[0.19, 0.13, 0.075]} radius={0.04} smoothness={3}>
                    <meshStandardMaterial color={SKIN} roughness={0.7} />
                  </RoundedBox>
                </mesh>
                <mesh position={[0, -0.495, 0.06]} rotation={[Math.PI / 2 - 0.1, 0, 0]}>
                  <boxGeometry args={[0.14, 0.012, 0.005]} />
                  <meshStandardMaterial color={SKIN_SHADOW} roughness={0.6} />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* neck */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.13, 16]} />
          <meshStandardMaterial color={SKIN_SHADOW} roughness={0.7} />
        </mesh>
      </group>

      {/* === Robotic Head === */}
      <group ref={head} position={[0, 0.66, 0]}>
        {/* main skull — metallic off-white sphere, slightly egg shaped */}
        <mesh scale={[0.98, 1.08, 1]}>
          <sphereGeometry args={[0.34, 40, 30]} />
          <meshStandardMaterial color="#eef1f6" roughness={0.32} metalness={0.55} />
        </mesh>

        {/* chin / lower jaw bevel */}
        <mesh position={[0, -0.2, 0.05]} scale={[0.78, 0.5, 0.85]}>
          <sphereGeometry args={[0.2, 24, 20]} />
          <meshStandardMaterial color="#dde2ea" roughness={0.4} metalness={0.55} />
        </mesh>

        {/* top panel seam (over the crown) */}
        <mesh position={[0, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.35, 0.006, 6, 48, Math.PI]} />
          <meshStandardMaterial color="#a9b1bd" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* center vertical seam (forehead) */}
        <mesh position={[0, 0.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.345, 0.005, 6, 48, Math.PI]} />
          <meshStandardMaterial color="#a9b1bd" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* visor strip (dark glass band across the eyes) */}
        <mesh position={[0, 0.0, 0]} scale={[1, 1, 1]}>
          <sphereGeometry args={[0.347, 48, 32, 0, Math.PI * 2, Math.PI * 0.38, Math.PI * 0.22]} />
          <meshPhysicalMaterial
            color="#0a0d14"
            roughness={0.06}
            metalness={0.4}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.4}
          />
        </mesh>

        {/* glowing left eye inside visor */}
        <group ref={leftEye} position={[-0.11, 0.0, 0.32]}>
          <mesh>
            <circleGeometry args={[0.04, 32]} />
            <meshStandardMaterial color={NEON_CYAN} emissive={NEON_CYAN} emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.001]}>
            <ringGeometry args={[0.042, 0.054, 32]} />
            <meshStandardMaterial color={NEON_CYAN} emissive={NEON_CYAN} emissiveIntensity={1.8} transparent opacity={0.65} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.002]}>
            <circleGeometry args={[0.012, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
        </group>
        {/* glowing right eye */}
        <group ref={rightEye} position={[0.11, 0.0, 0.32]}>
          <mesh>
            <circleGeometry args={[0.04, 32]} />
            <meshStandardMaterial color={NEON_CYAN} emissive={NEON_CYAN} emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.001]}>
            <ringGeometry args={[0.042, 0.054, 32]} />
            <meshStandardMaterial color={NEON_CYAN} emissive={NEON_CYAN} emissiveIntensity={1.8} transparent opacity={0.65} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.002]}>
            <circleGeometry args={[0.012, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
        </group>

        {/* mouth grille (3 vertical bars on a dark inset) */}
        <mesh position={[0, -0.16, 0.32]}>
          <planeGeometry args={[0.18, 0.06]} />
          <meshStandardMaterial color="#0a0d14" roughness={0.3} metalness={0.5} />
        </mesh>
        {[-1, 0, 1].map((i) => (
          <mesh key={i} position={[i * 0.045, -0.16, 0.323]}>
            <boxGeometry args={[0.02, 0.045, 0.005]} />
            <meshStandardMaterial color="#a9b1bd" roughness={0.4} metalness={0.7} />
          </mesh>
        ))}

        {/* cheek vent slats */}
        <group position={[-0.27, -0.05, 0.12]} rotation={[0, -0.7, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, -i * 0.04, 0]}>
              <boxGeometry args={[0.06, 0.012, 0.008]} />
              <meshStandardMaterial color="#1a1d24" roughness={0.4} metalness={0.7} />
            </mesh>
          ))}
        </group>
        <group position={[0.27, -0.05, 0.12]} rotation={[0, 0.7, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, -i * 0.04, 0]}>
              <boxGeometry args={[0.06, 0.012, 0.008]} />
              <meshStandardMaterial color="#1a1d24" roughness={0.4} metalness={0.7} />
            </mesh>
          ))}
        </group>

        {/* ear caps with glowing rings */}
        <mesh position={[-0.34, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 24]} />
          <meshStandardMaterial color="#15171c" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[-0.37, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.06, 0.012, 8, 22]} />
          <meshStandardMaterial color={NEON_CYAN} emissive={NEON_CYAN} emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
        <mesh position={[0.34, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 24]} />
          <meshStandardMaterial color="#15171c" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0.37, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.06, 0.012, 8, 22]} />
          <meshStandardMaterial color={NEON_CYAN} emissive={NEON_CYAN} emissiveIntensity={1.2} toneMapped={false} />
        </mesh>

        {/* antenna with pulsing tip */}
        <mesh position={[0.16, 0.36, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.014, 0.018, 0.2, 10]} />
          <meshStandardMaterial color="#a9b1bd" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0.2, 0.46, 0]}>
          <sphereGeometry args={[0.04, 16, 12]} />
          <meshStandardMaterial color={NEON_PINK} emissive={NEON_PINK} emissiveIntensity={2} toneMapped={false} />
        </mesh>

        {/* status LEDs on temple */}
        <mesh position={[-0.2, 0.22, 0.18]}>
          <circleGeometry args={[0.014, 12]} />
          <meshStandardMaterial color={NEON_CYAN} emissive={NEON_CYAN} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        <mesh position={[-0.16, 0.22, 0.2]}>
          <circleGeometry args={[0.011, 12]} />
          <meshStandardMaterial color={NEON_PINK} emissive={NEON_PINK} emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
        <mesh position={[-0.12, 0.22, 0.22]}>
          <circleGeometry args={[0.009, 12]} />
          <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>

        {/* neck collar (mechanical) */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.1, 0.13, 0.1, 18]} />
          <meshStandardMaterial color="#1a1d24" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <torusGeometry args={[0.11, 0.014, 8, 22]} />
          <meshStandardMaterial color="#a9b1bd" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

type TokenProps = { position: [number, number, number]; glyph?: string; color?: string; size?: number };

function FloatingGlyph({ position, glyph = '{}', color = ACCENT, size = 0.18 }: TokenProps) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const h = heroProgress(scrollState.progress);
    m.rotation.y += dt * 0.5;
    m.rotation.z = h * Math.PI * 2 + Math.sin(t + position[0]) * 0.2;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.7}>
      <group ref={ref} position={position}>
        <Text
          fontSize={size}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.004}
          outlineColor={'#000'}
          outlineOpacity={0.25}
        >
          {glyph}
        </Text>
      </group>
    </Float>
  );
}

function CameraRig() {
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = scrollState.progress;
    const h = heroProgress(s);
    target.set(
      state.pointer.x * 0.3,
      0.05 - state.pointer.y * 0.18 + Math.sin(t * 0.25) * 0.06,
      4.3 - h * 0.4 + s * 0.3
    );
    state.camera.position.lerp(target, 0.07);
    state.camera.lookAt(0, -0.3, 0.2);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.05, 4.3], fov: 42 }}
    >
      <Suspense fallback={null}>
        <CameraRig />

        <ambientLight intensity={0.45} />
        <hemisphereLight args={['#cfe9ff', '#2a1430', 0.5]} />
        <directionalLight position={[3, 4, 5]} intensity={0.85} color="#ffffff" />
        <directionalLight position={[-4, 2, -3]} intensity={0.8} color={NEON_CYAN} />
        <directionalLight position={[4, -1, -2]} intensity={0.55} color={NEON_PINK} />
        {/* screen glow on face from below */}
        <pointLight position={[0, -0.2, 1.0]} intensity={0.9} color={NEON_CYAN} distance={2.6} />
        <pointLight position={[1.2, 0.4, 0.8]} intensity={0.5} color={NEON_PINK} distance={2.4} />

        <Developer />
        <Laptop />
        <CoffeeMug />

        <FloatingGlyph position={[-2.2,  1.1, -0.5]} glyph="{ }"   color={NEON_CYAN} size={0.32} />
        <FloatingGlyph position={[ 2.3,  0.9, -0.3]} glyph="</>"   color={NEON_PINK} size={0.28} />
        <FloatingGlyph position={[-2.0, -0.4,  0.3]} glyph="=>"    color={NEON_CYAN} size={0.24} />
        <FloatingGlyph position={[ 2.2, -0.7,  0.2]} glyph="( )"   color={NEON_PINK} size={0.26} />
        <FloatingGlyph position={[-1.4,  1.7, -0.7]} glyph="&&"    color={NEON_CYAN} size={0.20} />
        <FloatingGlyph position={[ 1.5,  1.75, -0.8]} glyph="[ ]"  color={NEON_PINK} size={0.22} />
        <FloatingGlyph position={[ 0.1,  1.95, -0.9]} glyph=";"    color={NEON_CYAN} size={0.18} />
        <FloatingGlyph position={[-1.7,  0.4,  0.5]} glyph="#"     color={NEON_PINK} size={0.20} />
        <FloatingGlyph position={[ 1.7, -0.2,  0.4]} glyph="||"    color={NEON_CYAN} size={0.22} />
        <FloatingGlyph position={[-2.3,  0.3, -0.8]} glyph="*"     color={NEON_CYAN} size={0.18} />
        <FloatingGlyph position={[ 2.0,  1.5, -0.6]} glyph="++"    color={NEON_PINK} size={0.18} />
        <FloatingGlyph position={[ 0.0, -1.3, -0.5]} glyph="0 1"   color={NEON_CYAN} size={0.14} />

        <ContactShadows
          position={[0, -1.05, 0]}
          opacity={0.5}
          scale={6}
          blur={2.4}
          far={3}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}
