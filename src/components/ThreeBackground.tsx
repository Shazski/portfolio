import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../lib/scrollState';

function Starfield() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const COUNT = 600;
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 8 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, dt) => {
    const p = ref.current;
    if (!p) return;
    const s = scrollState.progress;
    p.rotation.y += dt * 0.02;
    p.rotation.x = s * Math.PI * 0.4;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#a8ffe6"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

export default function ThreeBackground() {
  return (
    <Canvas
      dpr={[1, 1.25]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 6], fov: 55 }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <Starfield />
      </Suspense>
    </Canvas>
  );
}
