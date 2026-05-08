import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/* Minimal scroll-driven space:
   - Background line field: always-visible short marks that stretch and
     brighten while scrolling.
   - 3 abstract wireframe forms drawn from clean edge geometry —
     icosahedron, triple-ring gyroscope, torus knot. They sit at
     staggered depths and you fly past each as you scroll.
   - Camera flies forward as you scroll; idle drift keeps it alive.
   Monochrome white on near-black. Senior-engineer / architectural feel. */

const LINE_COUNT = 160;
const FIELD_DEPTH = 90;
const FIELD_WIDTH = 22;
const FIELD_HEIGHT = 14;
const SCROLL_TRAVEL = 70;
const IDLE_FORWARD_SPEED = 0.4;

/* ----------------- Camera rig ----------------- */
function CameraRig() {
  const { camera } = useThree();
  const scrollY = useRef(0);
  const idleZ = useRef(0);
  const tilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY; };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame((state, delta) => {
    const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(scrollY.current / docHeight, 0), 1);
    idleZ.current -= IDLE_FORWARD_SPEED * delta;
    const targetZ = 6 - progress * SCROLL_TRAVEL + idleZ.current;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    tilt.current.x += (-state.pointer.y * 0.04 - tilt.current.x) * 0.06;
    tilt.current.y += (state.pointer.x * 0.06  - tilt.current.y) * 0.06;
    camera.rotation.x = tilt.current.x;
    camera.rotation.y = tilt.current.y;
  });

  return null;
}

/* ----------------- Background line field ------------------
   Sparse, always-visible line dashes. Each line has:
   - a random 3D base direction (so dashes point every which way)
   - a per-line pulse phase (opacity breathes asynchronously)
   - a subtle per-line color tint (mostly white, hints of cool/warm)
   On scroll, every line gets an additional -z stretch on top of its
   random base direction, giving a motion-blur warp feel without
   losing the at-rest variety. */
const linesVertex = /* glsl */ `
  attribute float aIsTail;
  attribute float aBaseLen;
  attribute vec3  aDir;
  attribute float aSeed;
  attribute vec3  aColor;
  uniform float uStretch;
  uniform float uTime;
  varying float vAlpha;
  varying vec3  vColor;
  void main() {
    vec3 pos = position;

    // Per-line position wobble — every line oscillates slightly on its own
    // independent phase so the field never feels static.
    float t = uTime;
    vec3 wobble = vec3(
      sin(t * 1.7 + aSeed * 6.28) * 0.10,
      cos(t * 1.4 + aSeed * 9.71) * 0.10,
      sin(t * 1.1 + aSeed * 4.13) * 0.06
    );
    pos += wobble;

    // base random-direction offset + scroll-driven -z extension
    pos += aIsTail * (aDir * aBaseLen + vec3(0.0, 0.0, -uStretch));

    // Faster, more dramatic per-line breathing pulse.
    float pulse = 0.30 + 0.70 * (sin(t * 2.4 + aSeed * 6.2831) * 0.5 + 0.5);
    // Occasional bright flare per line.
    float flare = pow(max(sin(t * 0.7 + aSeed * 11.13), 0.0), 14.0);
    vAlpha = (1.0 - aIsTail * 0.75) * (pulse + flare * 0.8);
    vColor = aColor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const linesFragment = /* glsl */ `
  uniform float uOpacity;
  varying float vAlpha;
  varying vec3  vColor;
  void main() { gl_FragColor = vec4(vColor, vAlpha * uOpacity); }
`;

function BackgroundLines() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const posAttrRef = useRef<THREE.BufferAttribute>(null!);
  const { camera } = useThree();
  const lastScroll = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const scrollVel = useRef(0);

  const positions = useMemo(() => {
    const arr = new Float32Array(LINE_COUNT * 2 * 3);
    for (let i = 0; i < LINE_COUNT; i++) {
      const x = (Math.random() - 0.5) * FIELD_WIDTH * 1.4;
      const y = (Math.random() - 0.5) * FIELD_HEIGHT * 1.4;
      const z = -Math.random() * FIELD_DEPTH + 4;
      const k = i * 6;
      arr[k]     = x; arr[k + 1] = y; arr[k + 2] = z;
      arr[k + 3] = x; arr[k + 4] = y; arr[k + 5] = z;
    }
    return arr;
  }, []);

  const isTail = useMemo(() => {
    const arr = new Float32Array(LINE_COUNT * 2);
    for (let i = 0; i < LINE_COUNT; i++) { arr[i * 2] = 0; arr[i * 2 + 1] = 1; }
    return arr;
  }, []);

  const baseLen = useMemo(() => {
    const arr = new Float32Array(LINE_COUNT * 2);
    for (let i = 0; i < LINE_COUNT; i++) {
      const len = 0.18 + Math.random() * 0.30; // longer + more varied at rest
      arr[i * 2] = len; arr[i * 2 + 1] = len;
    }
    return arr;
  }, []);

  // Random 3D unit-vector direction per line — gives the field variety.
  const dirs = useMemo(() => {
    const arr = new Float32Array(LINE_COUNT * 2 * 3);
    for (let i = 0; i < LINE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const dx = Math.sin(phi) * Math.cos(theta);
      const dy = Math.sin(phi) * Math.sin(theta);
      const dz = Math.cos(phi);
      const k = i * 6;
      arr[k]     = dx; arr[k + 1] = dy; arr[k + 2] = dz;
      arr[k + 3] = dx; arr[k + 4] = dy; arr[k + 5] = dz;
    }
    return arr;
  }, []);

  // Per-line pulse phase seed (same on both vertices of a line).
  const seeds = useMemo(() => {
    const arr = new Float32Array(LINE_COUNT * 2);
    for (let i = 0; i < LINE_COUNT; i++) {
      const s = Math.random();
      arr[i * 2] = s; arr[i * 2 + 1] = s;
    }
    return arr;
  }, []);

  // Subtle per-line color tint — mostly white, occasional cool/warm.
  const colors = useMemo(() => {
    const arr = new Float32Array(LINE_COUNT * 2 * 3);
    for (let i = 0; i < LINE_COUNT; i++) {
      const r = Math.random();
      let cr = 1.0, cg = 1.0, cb = 1.0;
      if (r > 0.6 && r < 0.85) {        // cool blue (~25%)
        cr = 0.72; cg = 0.83; cb = 1.0;
      } else if (r >= 0.85) {           // warm amber (~15%)
        cr = 1.0; cg = 0.88; cb = 0.77;
      }
      const k = i * 6;
      arr[k]     = cr; arr[k + 1] = cg; arr[k + 2] = cb;
      arr[k + 3] = cr; arr[k + 4] = cg; arr[k + 5] = cb;
    }
    return arr;
  }, []);

  const uniforms = useMemo(() => ({
    uStretch: { value: 0 },
    uOpacity: { value: 0.55 },
    uTime: { value: 0 },
  }), []);

  useFrame((_, delta) => {
    const y = window.scrollY;
    const v = Math.abs((y - lastScroll.current) / Math.max(delta, 0.001));
    scrollVel.current += (v - scrollVel.current) * 0.18;
    lastScroll.current = y;

    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
      const targetStretch = Math.min(scrollVel.current * 0.004, 4.5);
      const targetOpacity = 0.55 + Math.min(scrollVel.current * 0.0006, 0.30);
      const curS = matRef.current.uniforms.uStretch.value as number;
      const curO = matRef.current.uniforms.uOpacity.value as number;
      matRef.current.uniforms.uStretch.value = curS + (targetStretch - curS) * 0.18;
      matRef.current.uniforms.uOpacity.value = curO + (targetOpacity - curO) * 0.10;
    }

    const cz = camera.position.z;
    for (let i = 0; i < LINE_COUNT; i++) {
      const k = i * 6;
      const headZ = positions[k + 2];
      if (headZ > cz + 2) {
        const nx = (Math.random() - 0.5) * FIELD_WIDTH * 1.4;
        const ny = (Math.random() - 0.5) * FIELD_HEIGHT * 1.4;
        const nz = cz - FIELD_DEPTH;
        positions[k]     = nx; positions[k + 1] = ny; positions[k + 2] = nz;
        positions[k + 3] = nx; positions[k + 4] = ny; positions[k + 5] = nz;
      } else if (headZ < cz - FIELD_DEPTH - 5) {
        const nx = (Math.random() - 0.5) * FIELD_WIDTH * 1.4;
        const ny = (Math.random() - 0.5) * FIELD_HEIGHT * 1.4;
        const nz = cz - 2;
        positions[k]     = nx; positions[k + 1] = ny; positions[k + 2] = nz;
        positions[k + 3] = nx; positions[k + 4] = ny; positions[k + 5] = nz;
      }
    }
    if (posAttrRef.current) posAttrRef.current.needsUpdate = true;
  });

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttrRef}
          attach="attributes-position"
          args={[positions, 3]}
          count={LINE_COUNT * 2}
        />
        <bufferAttribute attach="attributes-aIsTail" args={[isTail, 1]} count={LINE_COUNT * 2} />
        <bufferAttribute attach="attributes-aBaseLen" args={[baseLen, 1]} count={LINE_COUNT * 2} />
        <bufferAttribute attach="attributes-aDir" args={[dirs, 3]} count={LINE_COUNT * 2} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} count={LINE_COUNT * 2} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} count={LINE_COUNT * 2} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={linesVertex}
        fragmentShader={linesFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/* ============================================================
   Nebula backdrop — a large noise-displaced sphere rendered
   from the inside, using a shader that paints volumetric-feeling
   3D fbm with a subtle color gradient. Sits far in the back so
   it acts as an ambient atmosphere without ever blocking content.
   This is the "advanced" layer: vertex displacement + multi-octave
   3D noise + fresnel-shaped alpha + slow domain rotation.
   ============================================================ */
const nebulaVertex = /* glsl */ `
  uniform float uTime;
  varying vec3 vPos;
  varying vec3 vNormal;

  // 3D value noise (cheap, smooth)
  float h(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float n3(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(h(i+vec3(0,0,0)), h(i+vec3(1,0,0)), f.x),
          mix(h(i+vec3(0,1,0)), h(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(h(i+vec3(0,0,1)), h(i+vec3(1,0,1)), f.x),
          mix(h(i+vec3(0,1,1)), h(i+vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float fbm3(vec3 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * n3(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    // Static geometry — only the fragment colors animate, no vertex motion.
    vNormal = normalize(normalMatrix * normal);
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const nebulaFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  varying vec3 vPos;
  varying vec3 vNormal;

  float h(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float n3(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(h(i+vec3(0,0,0)), h(i+vec3(1,0,0)), f.x),
          mix(h(i+vec3(0,1,0)), h(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(h(i+vec3(0,0,1)), h(i+vec3(1,0,1)), f.x),
          mix(h(i+vec3(0,1,1)), h(i+vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float fbm3(vec3 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * n3(p); p *= 2.04; a *= 0.5; }
    return v;
  }

  void main() {
    // Domain-warped fbm sampled in object space.
    vec3 p = vPos * 0.22 + vec3(uTime * 0.025, uTime * 0.018, 0.0);
    vec3 q = vec3(fbm3(p), fbm3(p + vec3(5.2, 1.3, 0.0)), fbm3(p + vec3(0.0, 2.4, 6.1)));
    float density = fbm3(p + 1.5 * q);

    // Looser threshold so more of the purple cloud is visible.
    float mask = smoothstep(0.30, 0.78, density);
    vec3 col = mix(uColorA, uColorB, mask);

    // Soft fresnel-style edge fade so it looks volumetric, not like a shell.
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float fade = pow(abs(dot(vNormal, viewDir)), 0.7);
    float a = (0.18 + mask * 0.7) * fade * 0.55;

    gl_FragColor = vec4(col * (0.30 + density * 0.45), a);
  }
`;

function NebulaBackdrop() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#0a1730') }, // deep navy
    uColorB: { value: new THREE.Color('#2a5a9c') }, // mid cobalt blue
  }), []);

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.012;
      meshRef.current.rotation.x += delta * 0.006;
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={-10}>
      <sphereGeometry args={[36, 64, 48]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={nebulaVertex}
        fragmentShader={nebulaFragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* ============================================================
   Procedural realistic planets — solar-system style.
   One unified shader with branched logic per type:
     0 = Earth-like  (ocean + continents + ice caps)
     1 = Mars-like   (rusty surface + polar caps)
     2 = Gas giant   (latitude bands)
     3 = Moon-like   (gray, cratered, no atmosphere)
   Each spins on a tilted axis. Set against the deep purple nebula.
   ============================================================ */
const planetVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const planetFragment = /* glsl */ `
  precision highp float;
  uniform int   uType;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorC;
  uniform vec3  uLightDir;
  uniform vec3  uAtmoColor;
  uniform float uAtmoStrength;

  varying vec3 vNormal;
  varying vec3 vPos;

  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float vnoise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i + vec3(0.0,0.0,0.0));
    float n100 = hash(i + vec3(1.0,0.0,0.0));
    float n010 = hash(i + vec3(0.0,1.0,0.0));
    float n110 = hash(i + vec3(1.0,1.0,0.0));
    float n001 = hash(i + vec3(0.0,0.0,1.0));
    float n101 = hash(i + vec3(1.0,0.0,1.0));
    float n011 = hash(i + vec3(0.0,1.0,1.0));
    float n111 = hash(i + vec3(1.0,1.0,1.0));
    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);
    return mix(nxy0, nxy1, f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * vnoise(p); p *= 2.05; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 surface;
    vec3 nPos = normalize(vPos);
    float lat = nPos.y;

    if (uType == 0) {
      float n = fbm(vPos * 1.6);
      float land = smoothstep(0.48, 0.56, n);
      surface = mix(uColorA, uColorB, land);
      float landDetail = fbm(vPos * 4.0);
      surface = mix(surface, surface * (0.85 + landDetail * 0.3), land);
      float ice = smoothstep(0.74, 0.90, abs(lat));
      surface = mix(surface, uColorC, ice * 0.85);
    }
    else if (uType == 1) {
      float n = fbm(vPos * 2.2);
      float darker = smoothstep(0.42, 0.58, n);
      surface = mix(uColorA, uColorB, darker);
      float micro = fbm(vPos * 6.0);
      surface *= 0.85 + micro * 0.3;
      float ice = smoothstep(0.86, 0.96, abs(lat));
      surface = mix(surface, uColorC, ice * 0.9);
    }
    else if (uType == 2) {
      float disturb = fbm(vec3(lat * 5.0, vPos.x * 0.5, vPos.z * 0.5)) * 0.18;
      float band = sin((lat + disturb) * 11.0) * 0.5 + 0.5;
      band = smoothstep(0.25, 0.75, band);
      surface = mix(uColorA, uColorB, band);
      float storm = fbm(vPos * 4.5) - 0.5;
      surface += storm * 0.07;
      float polar = smoothstep(0.6, 0.95, abs(lat));
      surface = mix(surface, uColorC, polar * 0.4);
    }
    else {
      float craters = fbm(vPos * 4.0);
      float dark = smoothstep(0.40, 0.55, craters);
      surface = mix(uColorA, uColorB, dark);
      float micro = fbm(vPos * 9.0);
      surface *= 0.88 + micro * 0.24;
    }

    vec3 L = normalize(uLightDir);
    float diff = max(dot(vNormal, L), 0.0);
    float ambient = 0.10;
    float lit = pow(diff, 0.9);
    vec3 col = surface * (lit + ambient);

    if (uType != 3) {
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      float rim = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.6);
      rim *= max(diff, 0.15);
      col += uAtmoColor * rim * uAtmoStrength;
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface PlanetSpec {
  position: [number, number, number];
  radius: number;
  rotSpeed: number;
  axisTilt: number;
  lightDir: [number, number, number];
  type: 0 | 1 | 2 | 3;
  colorA: string;
  colorB: string;
  colorC: string;
  atmoColor: string;
  atmoStrength: number;
  ring: { inner: number; outer: number; tilt: number; opacity: number; color: string } | null;
}

function Planet({ spec }: { spec: PlanetSpec }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(() => ({
    uType: { value: spec.type },
    uColorA: { value: new THREE.Color(spec.colorA) },
    uColorB: { value: new THREE.Color(spec.colorB) },
    uColorC: { value: new THREE.Color(spec.colorC) },
    uLightDir: { value: new THREE.Vector3(...spec.lightDir).normalize() },
    uAtmoColor: { value: new THREE.Color(spec.atmoColor) },
    uAtmoStrength: { value: spec.atmoStrength },
  }), [spec]);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * spec.rotSpeed;
  });

  return (
    <group position={spec.position} rotation={[spec.axisTilt, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[spec.radius, 48, 48]} />
        <shaderMaterial vertexShader={planetVertex} fragmentShader={planetFragment} uniforms={uniforms} />
      </mesh>
      {spec.ring && (
        <mesh rotation={[Math.PI / 2 + spec.ring.tilt, 0, 0]}>
          <ringGeometry args={[spec.ring.inner, spec.ring.outer, 96]} />
          <meshBasicMaterial color={spec.ring.color} transparent opacity={spec.ring.opacity} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function Forms() {
  const planets = useMemo<PlanetSpec[]>(
    () => [
      // Earth-like — blue oceans, green continents, white ice caps
      {
        position: [-3.6, 1.4, -16],
        radius: 0.95,
        rotSpeed: 0.15,
        axisTilt: 0.41,
        lightDir: [1.0, 0.4, 0.6],
        type: 0,
        colorA: '#1f4f7d',
        colorB: '#5a8c4f',
        colorC: '#f1f4f7',
        atmoColor: '#7fb6ff',
        atmoStrength: 0.55,
        ring: null,
      },
      // Gas giant — Jupiter-like cream / brown bands
      {
        position: [4.2, -1.6, -34],
        radius: 1.7,
        rotSpeed: 0.10,
        axisTilt: -0.05,
        lightDir: [-0.8, 0.5, 0.5],
        type: 2,
        colorA: '#c79a73',
        colorB: '#e7d3a8',
        colorC: '#9a7a5b',
        atmoColor: '#d8b88f',
        atmoStrength: 0.30,
        ring: null,
      },
      // Mars-like — rusty red with polar ice
      {
        position: [-3.0, 1.8, -54],
        radius: 1.05,
        rotSpeed: 0.13,
        axisTilt: 0.44,
        lightDir: [0.6, 0.3, 0.7],
        type: 1,
        colorA: '#b34a2a',
        colorB: '#7a2f1a',
        colorC: '#e8e1d6',
        atmoColor: '#e09b7c',
        atmoStrength: 0.22,
        ring: null,
      },
      // Saturn-like ringed gas giant
      {
        position: [3.6, 1.0, -74],
        radius: 1.5,
        rotSpeed: 0.08,
        axisTilt: 0.5,
        lightDir: [-0.7, 0.6, 0.5],
        type: 2,
        colorA: '#e0c69a',
        colorB: '#c19a6b',
        colorC: '#a07e58',
        atmoColor: '#d8b88f',
        atmoStrength: 0.26,
        ring: { inner: 2.0, outer: 3.0, tilt: 0.3, opacity: 0.45, color: '#cdb38a' },
      },
    ],
    []
  );

  return (
    <group>
      {planets.map((p, i) => <Planet key={i} spec={p} />)}
    </group>
  );
}

/* ============================================================
   Glowing beacons — small bright spheres that pulse softly.
   Bloom turns them into distant glow points.
   ============================================================ */
function Beacon({
  position, color, size, phase, speed,
}: { position: [number, number, number]; color: string; size: number; phase: number; speed: number }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame((state) => {
    if (matRef.current) {
      const t = state.clock.elapsedTime;
      const s = Math.sin(t * speed + phase) * 0.5 + 0.5;
      const pulse = 0.35 + Math.pow(s, 1.6) * 0.95;
      matRef.current.opacity = pulse;
    }
  });
  return (
    <mesh position={position} renderOrder={2}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial ref={matRef} color={color} transparent opacity={0.8} depthWrite={false} />
    </mesh>
  );
}

function Beacons() {
  // 3 quiet glow points — minimal accents, soft colors, low size.
  const beacons = useMemo(
    () => [
      { position: [-9,  4, -28] as [number, number, number], color: '#8eb8ff', size: 0.07, phase: 0.0, speed: 0.55 },
      { position: [10, -3, -50] as [number, number, number], color: '#c8a4ff', size: 0.07, phase: 2.6, speed: 0.7  },
      { position: [-8,  3, -68] as [number, number, number], color: '#ffc8a0', size: 0.06, phase: 4.8, speed: 0.6  },
    ],
    []
  );
  return (
    <group>
      {beacons.map((b, i) => <Beacon key={i} {...b} />)}
    </group>
  );
}

/* ============================================================
   Comets — short bright thin streaks that race across the scene
   at random angles, then respawn at the opposite edge. Bloom
   gives them soft halos so they read as comets, not just bars.
   ============================================================ */
const COMET_COUNT = 2;

interface CometData {
  pos: [number, number, number];
  vel: [number, number, number];
  length: number;
}

function Comets() {
  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);
  const data = useRef<CometData[]>([]);

  if (data.current.length === 0) {
    for (let i = 0; i < COMET_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 3;
      data.current.push({
        pos: [
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 14,
          -18 - Math.random() * 50,
        ],
        vel: [Math.cos(angle) * speed, Math.sin(angle) * speed, 0],
        length: 0.9 + Math.random() * 0.7,
      });
    }
  }

  useFrame((_, delta) => {
    for (let i = 0; i < COMET_COUNT; i++) {
      const d = data.current[i];
      d.pos[0] += d.vel[0] * delta;
      d.pos[1] += d.vel[1] * delta;

      // Respawn off-screen
      if (Math.abs(d.pos[0]) > 18 || Math.abs(d.pos[1]) > 12) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 3;
        d.pos[0] = -Math.cos(angle) * 17;
        d.pos[1] = -Math.sin(angle) * 11;
        d.vel = [Math.cos(angle) * speed, Math.sin(angle) * speed, 0];
        d.length = 0.9 + Math.random() * 0.7;
      }

      const m = meshRefs.current[i];
      if (m) {
        m.position.set(d.pos[0], d.pos[1], d.pos[2]);
        // Orient the streak along the velocity vector.
        m.lookAt(d.pos[0] + d.vel[0], d.pos[1] + d.vel[1], d.pos[2]);
        m.scale.set(1, 1, d.length);
      }
    }
  });

  return (
    <group>
      {Array.from({ length: COMET_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          renderOrder={2}
        >
          <boxGeometry args={[0.012, 0.012, 1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <CameraRig />
      <NebulaBackdrop />
      <BackgroundLines />
      <Forms />
      <Beacons />
      <Comets />
    </Canvas>
  );
}
