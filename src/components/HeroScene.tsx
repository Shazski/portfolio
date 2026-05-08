import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/* Plexus — a living constellation:
   ~96 points on a sphere, slowly breathing via per-point noise offsets.
   Lines connect any two points within a distance threshold; line opacity
   fades with distance so the network feels alive without being noisy.
   Drag to rotate, hover expands the sphere, click sends a breath pulse. */

const POINT_COUNT = 96;
const MAX_LINES = (POINT_COUNT * (POINT_COUNT - 1)) / 2;
const BASE_RADIUS = 1.5;

function fibSpherePoints(n: number) {
  const arr = new Float32Array(n * 3);
  const golden = Math.PI * (1 + Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
    const theta = golden * i;
    arr[i * 3] = Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = Math.cos(phi);
  }
  return arr;
}

function Plexus({ orbitRef }: { orbitRef: React.MutableRefObject<any> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsAttrRef = useRef<THREE.BufferAttribute>(null!);
  const linesGeoRef = useRef<THREE.BufferGeometry>(null!);
  const linePosAttrRef = useRef<THREE.BufferAttribute>(null!);
  const lineColorAttrRef = useRef<THREE.BufferAttribute>(null!);

  const baseSphere = useMemo(() => fibSpherePoints(POINT_COUNT), []);
  const offsets = useMemo(() => {
    const arr = new Float32Array(POINT_COUNT * 3);
    for (let i = 0; i < arr.length; i++) arr[i] = Math.random() * 100;
    return arr;
  }, []);
  const animated = useMemo(() => new Float32Array(POINT_COUNT * 3), []);
  const linePositions = useMemo(() => new Float32Array(MAX_LINES * 2 * 3), []);
  const lineColors = useMemo(() => new Float32Array(MAX_LINES * 2 * 3), []);

  const radiusTarget = useRef(BASE_RADIUS);
  const radiusCurrent = useRef(BASE_RADIUS);
  const pulse = useRef(0);
  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Smooth radius (hover/click)
    radiusCurrent.current += (radiusTarget.current + pulse.current - radiusCurrent.current) * 0.08;
    pulse.current *= 0.92;

    // Update point positions with breathing offsets
    const r = radiusCurrent.current;
    for (let i = 0; i < POINT_COUNT; i++) {
      const i3 = i * 3;
      const ox = offsets[i3], oy = offsets[i3 + 1], oz = offsets[i3 + 2];
      const wob = 0.08;
      const dx = Math.sin(t * 0.5 + ox) * wob;
      const dy = Math.cos(t * 0.6 + oy) * wob;
      const dz = Math.sin(t * 0.4 + oz) * wob;
      animated[i3] = baseSphere[i3] * r + dx;
      animated[i3 + 1] = baseSphere[i3 + 1] * r + dy;
      animated[i3 + 2] = baseSphere[i3 + 2] * r + dz;
    }
    if (pointsAttrRef.current) pointsAttrRef.current.needsUpdate = true;

    // Build lines for nearby pairs
    const threshold = 0.85;
    const t2 = threshold * threshold;
    let li = 0;
    for (let i = 0; i < POINT_COUNT; i++) {
      const i3 = i * 3;
      const ax = animated[i3], ay = animated[i3 + 1], az = animated[i3 + 2];
      for (let j = i + 1; j < POINT_COUNT; j++) {
        const j3 = j * 3;
        const bx = animated[j3], by = animated[j3 + 1], bz = animated[j3 + 2];
        const dx = ax - bx, dy = ay - by, dz = az - bz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < t2) {
          const k = li * 6;
          linePositions[k] = ax; linePositions[k + 1] = ay; linePositions[k + 2] = az;
          linePositions[k + 3] = bx; linePositions[k + 4] = by; linePositions[k + 5] = bz;
          const a = 1 - Math.sqrt(d2) / threshold;
          for (let n = 0; n < 6; n++) lineColors[k + n] = a * 0.9;
          li++;
        }
      }
    }
    if (linePosAttrRef.current) linePosAttrRef.current.needsUpdate = true;
    if (lineColorAttrRef.current) lineColorAttrRef.current.needsUpdate = true;
    if (linesGeoRef.current) linesGeoRef.current.setDrawRange(0, li * 2);

    // Gentle group rotation in addition to orbit auto-rotate (for slight 3D wobble)
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.12;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => {
        setHovered(true);
        radiusTarget.current = BASE_RADIUS * 1.12;
        gl.domElement.style.cursor = 'grab';
        if (orbitRef.current) orbitRef.current.autoRotateSpeed = 1.4;
      }}
      onPointerOut={() => {
        setHovered(false);
        radiusTarget.current = BASE_RADIUS;
        gl.domElement.style.cursor = '';
        if (orbitRef.current) orbitRef.current.autoRotateSpeed = 0.5;
      }}
      onPointerDown={() => {
        pulse.current = 0.35;
        gl.domElement.style.cursor = 'grabbing';
      }}
      onPointerUp={() => {
        gl.domElement.style.cursor = hovered ? 'grab' : '';
      }}
    >
      {/* Big invisible hit sphere so the whole region is interactive */}
      <mesh>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute
            ref={pointsAttrRef}
            attach="attributes-position"
            args={[animated, 3]}
            count={POINT_COUNT}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>

      <lineSegments>
        <bufferGeometry ref={linesGeoRef}>
          <bufferAttribute
            ref={linePosAttrRef}
            attach="attributes-position"
            args={[linePositions, 3]}
            count={MAX_LINES * 2}
          />
          <bufferAttribute
            ref={lineColorAttrRef}
            attach="attributes-color"
            args={[lineColors, 3]}
            count={MAX_LINES * 2}
          />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.55} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export default function HeroScene() {
  const orbitRef = useRef<any>(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
      >
        <Plexus orbitRef={orbitRef} />
        <OrbitControls
          ref={orbitRef}
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          rotateSpeed={0.7}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
      <span
        style={{
          position: 'absolute',
          bottom: 8,
          right: 12,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          color: 'var(--text-dim)',
          letterSpacing: '0.04em',
          pointerEvents: 'none',
          opacity: 0.7,
        }}
      >
        ⟲ drag · hover · click
      </span>
    </div>
  );
}
