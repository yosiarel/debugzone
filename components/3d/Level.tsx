// 🌌 DEBUGZONE: THE CYBERVERSE
// High-end Sci-Fi Environment dengan estetika TRON Legacy

'use client';

import { useRef } from 'react';
import { Mesh, Color } from 'three';
import { useFrame } from '@react-three/fiber';

export function Level() {
  const gridRef = useRef<Mesh>(null);

  // Animasi grid bergerak
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 10;
    }
  });

  return (
    <>
      {/* 🌟 STARFIELD BACKGROUND */}
      <Stars />

      {/* 💡 DRAMATIC LIGHTING SYSTEM */}
      <ambientLight intensity={0.3} />
      
      {/* Cyan Key Light */}
      <pointLight
        position={[10, 8, 10]}
        intensity={80}
        color="#00ffff"
        distance={40}
        castShadow
      />
      
      {/* Magenta Fill Light */}
      <pointLight
        position={[-10, 6, -10]}
        intensity={60}
        color="#ff00ff"
        distance={35}
      />
      
      {/* Neon Accent Lights */}
      <pointLight
        position={[0, 4, 15]}
        intensity={40}
        color="#00ff88"
        distance={25}
      />
      <pointLight
        position={[0, 4, -15]}
        intensity={40}
        color="#ff0088"
        distance={25}
      />
      
      {/* Additional Fill Lights for better visibility */}
      <pointLight
        position={[0, 10, 0]}
        intensity={30}
        color="#ffffff"
        distance={50}
      />

      {/* 🌫️ VOLUMETRIC FOG */}
      <fog attach="fog" args={['#0a0a1e', 30, 80]} />

      {/* 🏗️ FLOOR - NEON GRID */}
      <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100, 20, 20]} />
        <meshStandardMaterial
          color="#0a0a1e"
          wireframe
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Base Floor untuk physics */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0a0a2e" emissive="#00ffff" emissiveIntensity={0.05} />
      </mesh>

      {/* 🏛️ MODULAR ARCHITECTURE */}
      <CyberWalls />
      <NeonPillars />
      <DataCubes />
    </>
  );
}

// ⭐ Starfield Component
function Stars() {
  const starsRef = useRef<any>(null);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }
  });

  const starPositions = Array.from({ length: 1000 }, () => ({
    x: (Math.random() - 0.5) * 200,
    y: Math.random() * 50 + 10,
    z: (Math.random() - 0.5) * 200,
  }));

  return (
    <group ref={starsRef}>
      {starPositions.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

// 🧱 Cyber Walls (No physics here - handled in Scene.tsx)
function CyberWalls() {
  const walls = [
    // Front walls
    { pos: [-25, 2.5, 0], scale: [1, 5, 50] },
    { pos: [25, 2.5, 0], scale: [1, 5, 50] },
    // Back walls
    { pos: [0, 2.5, -25], scale: [50, 5, 1] },
    { pos: [0, 2.5, 25], scale: [50, 5, 1] },
  ];

  return (
    <>
      {walls.map((wall, i) => (
        <mesh key={`wall-${i}`} position={wall.pos as [number, number, number]} castShadow>
          <boxGeometry args={wall.scale as [number, number, number]} />
          <meshStandardMaterial
            color="#0a0a2e"
            emissive="#00ffff"
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}
    </>
  );
}

// 🏛️ Neon Pillars
function NeonPillars() {
  const pillars = [
    { pos: [-15, 3, 15], color: '#00ffff' },
    { pos: [15, 3, 15], color: '#ff00ff' },
    { pos: [-15, 3, -15], color: '#ff00ff' },
    { pos: [15, 3, -15], color: '#00ffff' },
    { pos: [-15, 3, 0], color: '#00ff88' },
    { pos: [15, 3, 0], color: '#ff0088' },
  ];

  return (
    <>
      {pillars.map((pillar, i) => (
        <group key={`pillar-${i}`} position={pillar.pos as [number, number, number]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.5, 6, 8]} />
            <meshStandardMaterial
              color={pillar.color}
              emissive={pillar.color}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>
          {/* Glowing top */}
          <pointLight position={[0, 3.5, 0]} intensity={10} color={pillar.color} distance={8} />
        </group>
      ))}
    </>
  );
}

// 📦 Floating Data Cubes
function DataCubes() {
  const cubes = [
    { pos: [-8, 1, 8], color: '#00ffff' },
    { pos: [8, 1, -8], color: '#ff00ff' },
    { pos: [0, 1.5, 0], color: '#00ff88' },
    { pos: [-5, 1, -10], color: '#ff0088' },
    { pos: [10, 1.2, 5], color: '#00ffff' },
  ];

  return (
    <>
      {cubes.map((cube, i) => (
        <FloatingCube
          key={`cube-${i}`}
          position={cube.pos as [number, number, number]}
          color={cube.color}
          delay={i * 0.5}
        />
      ))}
    </>
  );
}

// Animated Floating Cube
function FloatingCube({ position, color, delay }: { position: [number, number, number]; color: string; delay: number }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        wireframe
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
