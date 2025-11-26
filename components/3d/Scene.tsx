// 🎮 DEBUGZONE: MAIN SCENE
// The complete 3D experience with Post-Processing

'use client';

import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Level } from './Level';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { useGameStore } from '@/stores/gameStore';

export function Scene() {
  const enemies = useGameStore((state) => state.enemies);

  return (
    <Canvas
      shadows="basic"
      camera={{ position: [0, 2, 8], fov: 75 }}
      style={{ background: '#0a0a1e' }}
      gl={{ 
        antialias: false, 
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true
      }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      frameloop="demand"
    >
      <Physics gravity={[0, -9.81, 0]}>
        {/* Environment */}
        <Level />

        {/* Physics Boundaries (Invisible Walls) - DIPERLUAS UNTUK MULTI-ROOM */}
        <RigidBody type="fixed" position={[-80, 2.5, 0]}>
          <CuboidCollider args={[0.5, 2.5, 80]} />
        </RigidBody>
        <RigidBody type="fixed" position={[80, 2.5, 0]}>
          <CuboidCollider args={[0.5, 2.5, 80]} />
        </RigidBody>
        <RigidBody type="fixed" position={[0, 2.5, -80]}>
          <CuboidCollider args={[80, 2.5, 0.5]} />
        </RigidBody>
        <RigidBody type="fixed" position={[0, 2.5, 80]}>
          <CuboidCollider args={[80, 2.5, 0.5]} />
        </RigidBody>
        {/* Floor Collider */}
        <RigidBody type="fixed" position={[0, -0.1, 0]}>
          <CuboidCollider args={[100, 0.1, 100]} />
        </RigidBody>

        {/* Player */}
        <Player />

        {/* Enemies */}
        {enemies.map((enemy) => (
          <Enemy key={enemy.id} enemy={enemy} />
        ))}
      </Physics>

      {/* 🎨 POST-PROCESSING EFFECTS - OPTIMIZED */}
      <EffectComposer multisampling={0}>
        {/* Bloom for Neon Glow - Reduced */}
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.7}
          height={300}
        />
        {/* Vignette for Cinematic Look */}
        <Vignette
          offset={0.5}
          darkness={0.2}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </Canvas>
  );
}
