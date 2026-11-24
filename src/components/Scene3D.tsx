import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, RoundedBox, Sparkles, Torus } from '@react-three/drei';
import * as THREE from 'three';
import SafeCanvas from './SafeCanvas';

type Variant = 'orbit' | 'servers' | 'blob' | 'cubes';

/** Reads the live accent colour so 3D matches the colour switcher. */
function useAccent() {
  const read = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff7a45';
  const [c, setC] = useState(read);
  useEffect(() => {
    const mo = new MutationObserver(() => setC(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-accent', 'data-theme'] });
    return () => mo.disconnect();
  }, []);
  return c;
}

/** Whole scene leans toward the pointer. */
function PointerRig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ pointer }, dt) => {
    if (!g.current) return;
    const k = 1 - Math.pow(0.002, dt);
    g.current.rotation.y += (pointer.x * 0.45 - g.current.rotation.y) * k;
    g.current.rotation.x += (-pointer.y * 0.3 - g.current.rotation.x) * k;
  });
  return <group ref={g}>{children}</group>;
}

/* ---------- Orbit: glass core + rings + orbiting nodes (skills) ---------- */
function Orbit({ accent }: { accent: string }) {
  const nodes = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (nodes.current) nodes.current.rotation.y += dt * 0.4;
    if (core.current) { core.current.rotation.x += dt * 0.2; core.current.rotation.y += dt * 0.3; }
  });
  return (
    <>
      <Float speed={2} floatIntensity={0.6}>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.9, 0]} />
          <meshPhysicalMaterial color={accent} roughness={0.15} metalness={0.2} clearcoat={1} flatShading />
        </mesh>
        <mesh scale={1.04}>
          <icosahedronGeometry args={[0.9, 0]} />
          <meshBasicMaterial color={accent} wireframe transparent opacity={0.35} />
        </mesh>
      </Float>
      {[1.5, 1.95].map((r, i) => (
        <Torus key={r} args={[r, 0.012, 16, 120]} rotation={[Math.PI / 2.3 + i * 0.5, i * 0.6, 0]}>
          <meshBasicMaterial color={accent} transparent opacity={0.45} />
        </Torus>
      ))}
      <group ref={nodes}>
        {Array.from({ length: 7 }).map((_, i) => {
          const a = (i / 7) * Math.PI * 2;
          const r = i % 2 ? 1.5 : 1.95;
          return (
            <mesh key={i} position={[Math.cos(a) * r, Math.sin(a * 2) * 0.35, Math.sin(a) * r]}>
              <sphereGeometry args={[0.09, 24, 24]} />
              <meshStandardMaterial color="#ffffff" emissive={accent} emissiveIntensity={1.2} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

/* ---------- Servers: stacked rack units with blinking LEDs (experience) ---------- */
function Servers({ accent }: { accent: string }) {
  const leds = useRef<THREE.MeshStandardMaterial[]>([]);
  const stack = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    leds.current.forEach((m, i) => { if (m) m.emissiveIntensity = 0.6 + Math.max(0, Math.sin(t * 3 + i * 1.7)) * 2.4; });
    if (stack.current) stack.current.rotation.y = Math.sin(t * 0.4) * 0.35 - 0.5;
  });
  return (
    <group ref={stack}>
      {[0, 1, 2, 3].map((i) => (
        <Float key={i} speed={1.5} floatIntensity={0.25} rotationIntensity={0.05}>
          <group position={[0, (i - 1.5) * 0.52, 0]}>
            <RoundedBox args={[2, 0.4, 1.3]} radius={0.06} smoothness={4}>
              <meshPhysicalMaterial color="#1c1917" roughness={0.35} metalness={0.6} clearcoat={0.6} />
            </RoundedBox>
            {[0, 1, 2].map((j) => (
              <mesh key={j} position={[-0.75 + j * 0.16, 0, 0.66]}>
                <sphereGeometry args={[0.035, 16, 16]} />
                <meshStandardMaterial
                  ref={(m) => { if (m) leds.current[i * 3 + j] = m; }}
                  color={accent}
                  emissive={j === 2 ? '#34d399' : accent}
                />
              </mesh>
            ))}
            {Array.from({ length: 6 }).map((_, k) => (
              <mesh key={k} position={[0.05 + k * 0.13, 0, 0.66]}>
                <boxGeometry args={[0.06, 0.2, 0.01]} />
                <meshStandardMaterial color="#3a3530" />
              </mesh>
            ))}
          </group>
        </Float>
      ))}
    </group>
  );
}

/* ---------- Blob: liquid metal sphere (contact) ---------- */
function Blob({ accent }: { accent: string }) {
  const m = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (m.current) m.current.rotation.y += dt * 0.25; });
  return (
    <Float speed={1.6} floatIntensity={0.8}>
      <mesh ref={m}>
        <sphereGeometry args={[1.25, 128, 128]} />
        <MeshDistortMaterial color={accent} distort={0.42} speed={2.2} roughness={0.1} metalness={0.55} />
      </mesh>
    </Float>
  );
}

/* ---------- Cubes: floating rotating cube cluster (projects) ---------- */
function Cubes({ accent }: { accent: string }) {
  const g = useRef<THREE.Group>(null);
  const cubes = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({
      p: [(i % 3 - 1) * 0.9, (Math.floor(i / 3) - 1) * 0.9, (Math.random() - 0.5) * 0.6] as [number, number, number],
      s: 0.45 + Math.random() * 0.25,
      tint: i % 3 === 0,
    })),
    []
  );
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = clock.elapsedTime;
    g.current.rotation.y = t * 0.25;
    g.current.rotation.x = Math.sin(t * 0.3) * 0.3;
    g.current.children.forEach((c, i) => {
      const base = cubes[i]?.p;
      if (!base) return;
      const k = 1 + Math.sin(t * 1.2 + i) * 0.12;
      c.position.set(base[0] * k, base[1] * k, base[2] * k);
    });
  });
  return (
    <group ref={g}>
      {cubes.map((c, i) => (
        <RoundedBox
          key={i}
          args={[c.s, c.s, c.s]}
          radius={0.06}
          position={c.p}
        >
          <meshPhysicalMaterial color={c.tint ? accent : '#e7e2dc'} roughness={0.2} metalness={0.1} clearcoat={1} />
        </RoundedBox>
      ))}
    </group>
  );
}

export default function Scene3D({ variant, className }: { variant: Variant; className?: string }) {
  const accent = useAccent();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Only render frames while on screen — keeps scrolling smooth.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`scene3d ${className ?? ''}`}>
      <SafeCanvas>
        <Canvas
          frameloop={visible ? 'always' : 'never'}
          dpr={[1, 1.25]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 5], fov: 40 }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 5]} intensity={1.6} />
          <pointLight position={[-3, -2, 2]} intensity={18} color={accent} />
          <Suspense fallback={null}>
            <PointerRig>
              {variant === 'orbit' && <Orbit accent={accent} />}
              {variant === 'servers' && <Servers accent={accent} />}
              {variant === 'blob' && <Blob accent={accent} />}
              {variant === 'cubes' && <Cubes accent={accent} />}
            </PointerRig>
            <Sparkles count={40} scale={5} size={2} speed={0.4} color={accent} opacity={0.6} />
          </Suspense>
        </Canvas>
      </SafeCanvas>
    </div>
  );
}
