import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated, config } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import { Environment, Center, Float, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { playEasterEggSplashSound } from '../audioManager';

// --- Geometry Generators (Matching the Circular Logo) ---
// 1. Outer Rim Shape (Thick orange border)
const rimShape = new THREE.Shape();
rimShape.absarc(0, 0, 1.3, 0, Math.PI * 2, false);
const rimHole = new THREE.Path();
rimHole.absarc(0, 0, 1.15, 0, Math.PI * 2, true);
rimShape.holes.push(rimHole);

// 2. Base Core Shape (Inner vibrant orange circle)
const coreShape = new THREE.Shape();
coreShape.absarc(0, 0, 1.15, 0, Math.PI * 2, false);

// 3. Custom Stylized "D" Logo Shape (Clean Pixel-Perfect Schematic)
const dShape = new THREE.Shape();
// Outer shape CCW
dShape.moveTo(-0.28, 0.36);
dShape.lineTo(-0.28, -0.04);
dShape.lineTo(-0.10, -0.04);
dShape.lineTo(-0.22, -0.36);
dShape.lineTo(0.16, -0.36);
dShape.bezierCurveTo(0.60, -0.36, 0.60, 0.36, 0.16, 0.36);
dShape.lineTo(-0.28, 0.36);

const dHole = new THREE.Path();
// Hole shape CW
dHole.moveTo(-0.06, 0.16);
dHole.lineTo(0.14, 0.16);
dHole.bezierCurveTo(0.40, 0.16, 0.40, -0.16, 0.14, -0.16);
dHole.lineTo(0.04, -0.16);
dHole.lineTo(0.10, -0.04);
dHole.lineTo(-0.06, -0.04);
dHole.lineTo(-0.06, 0.16);
dShape.holes.push(dHole);

// --- Premium Logo Materials ---
const rimMat = new THREE.MeshPhysicalMaterial({
  color: "#f27900", // Darker edge orange
  metalness: 0.2,
  roughness: 0.3,
  clearcoat: 0.3
});

const coreMat = new THREE.MeshPhysicalMaterial({
  color: "#ffa01a", // Vibrant inner orange
  metalness: 0.1,
  roughness: 0.4,
  clearcoat: 0.8,
  clearcoatRoughness: 0.1
});

const grooveMat = new THREE.MeshPhysicalMaterial({
  color: "#d66700", // Dark engraved line
  metalness: 0.5,
  roughness: 0.5
});

const dMat = new THREE.MeshPhysicalMaterial({
  color: "#fff4e6", // Creamy white
  emissive: "#3a2515",
  emissiveIntensity: 0.2,
  metalness: 0.1,
  roughness: 0.1,
  clearcoat: 1.0
});

function CoinMesh({ spinBoost = false }) {
  const meshRef = useRef();

  const [{ rotation, scale }, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    scale: 1,
    config: { mass: 2, tension: 400, friction: 30 }
  }));

  useFrame((state, delta) => {
    if (!api.isDragging && meshRef.current) {
      meshRef.current.rotation.y += delta * (spinBoost ? 3.5 : 0.4);
    }
  });

  const bind = useDrag(({ active, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy] }) => {
    api.isDragging = active;
    if (active) {
      api.start({ scale: 1.1, rotation: [my / 50, mx / 50, 0], config: config.stiff });
    } else {
      const momentumX = vx * dx * 5;
      api.start({
        scale: 1.0,
        rotation: [0, meshRef.current.rotation.y + momentumX, 0],
        config: { mass: 1, tension: 200, friction: 50 },
      });
      meshRef.current.rotation.x = 0; 
      meshRef.current.rotation.z = 0;
    }
  });

  const { rimGeo, coreGeo, dGeo } = useMemo(() => {
    // Reduce geometry segments slightly for faster initial generation, still looks smooth
    const rg = new THREE.ExtrudeGeometry(rimShape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, curveSegments: 32 });
    rg.center();
    
    const cg = new THREE.ExtrudeGeometry(coreShape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, curveSegments: 32 });
    cg.center();
    
    const dg = new THREE.ExtrudeGeometry(dShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, curveSegments: 16 });
    dg.center();
    
    return { rimGeo: rg, coreGeo: cg, dGeo: dg };
  }, []);

  return (
    <animated.group {...bind()} ref={meshRef} scale={scale} rotation={rotation}>
      
      {/* 1. Base Core (Vibrant Orange) */}
      <mesh geometry={coreGeo} material={coreMat} castShadow receiveShadow />

      {/* 2. Outer Rim (Darker Orange Edge) */}
      <mesh geometry={rimGeo} material={rimMat} castShadow receiveShadow />

      {/* 3. Engraved Inner Groove */}
      {/* Front groove */}
      <mesh position={[0, 0, 0.105]} material={grooveMat}>
        <torusGeometry args={[0.95, 0.015, 16, 32]} />
      </mesh>
      {/* Back groove */}
      <mesh position={[0, 0, -0.105]} material={grooveMat}>
        <torusGeometry args={[0.95, 0.015, 16, 32]} />
      </mesh>

      {/* 4. Center Logo Letter "D" (Scaled up and embossed) */}
      {/* Front Face D */}
      <mesh 
        geometry={dGeo} 
        material={dMat} 
        position={[0, 0, 0.155]} // 0.105 (core face) + 0.05 (half depth of D) -> exactly touching!
        scale={[1.2, 1.2, 1.2]}
        castShadow 
      />
      {/* Back Face D */}
      <mesh 
        geometry={dGeo} 
        material={dMat} 
        position={[0, 0, -0.155]} 
        rotation={[0, Math.PI, 0]} 
        scale={[1.2, 1.2, 1.2]}
        castShadow 
      />
      
    </animated.group>
  );
}

export default function DopaCoin3D({ active = true }) {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);
  const [showSplash, setShowSplash] = useState(false);
  const [spinBoost, setSpinBoost] = useState(false);

  if (!active) return null;

  const handleCoinClick = (e) => {
    e.stopPropagation();
    clickCountRef.current += 1;

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      
      // Trigger Easter Egg
      playEasterEggSplashSound();
      setSpinBoost(true);
      setShowSplash(true);

      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ffb03a', '#ff6f00', '#ffffff', '#ffd700']
        });
      } catch (err) {}

      setTimeout(() => {
        setSpinBoost(false);
      }, 2500);

      setTimeout(() => {
        setShowSplash(false);
      }, 3500);
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1200);
    }
  };
  
  return (
    <div 
      onClick={handleCoinClick}
      className="w-full h-full relative z-10 min-h-[250px] touch-none cursor-pointer select-none" 
    >
      {/* Easter Egg Floating Splash Badge */}
      {showSplash && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none whitespace-nowrap">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-white font-black px-4 py-2 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.9)] border-2 border-white flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest">
            <span>🌟</span>
            <span>EASTER EGG! MOEDA MÁGICA!</span>
            <span>🚀</span>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]} // Capped max pixel ratio for much better performance on mobile
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff8a65" />
        
        {/* Floating effect + Center it perfectly */}
        <Center>
          <Float speed={spinBoost ? 6 : 2} rotationIntensity={spinBoost ? 0.8 : 0.2} floatIntensity={spinBoost ? 1.5 : 0.5}>
            <CoinMesh spinBoost={spinBoost} />
          </Float>
        </Center>
        
        {/* Magic Particles */}
        <Sparkles count={spinBoost ? 180 : 50} scale={4} size={spinBoost ? 5 : 3} speed={spinBoost ? 2.5 : 0.4} opacity={0.8} color="#ffd700" />

        {/* Fake ground shadow */}
        <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#000000" />
        
        {/* Beautiful Studio Lighting Reflections - loaded asynchronously so the coin appears instantly */}
        <Suspense fallback={null}>
            <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
