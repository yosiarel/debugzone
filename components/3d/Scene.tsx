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
      shadows
      camera={{ position: [0, 2, 8], fov: 75 }}
      style={{ background: '#0a0a1e' }}
      gl={{ antialias: true, alpha: false }}
    >
      <Physics gravity={[0, -9.81, 0]}>
        {/* Environment */}
        <Level />

        {/* Physics Boundaries (Invisible Walls) */}
        <RigidBody type="fixed" position={[-25, 2.5, 0]}>
          <CuboidCollider args={[0.5, 2.5, 25]} />
        </RigidBody>
        <RigidBody type="fixed" position={[25, 2.5, 0]}>
          <CuboidCollider args={[0.5, 2.5, 25]} />
        </RigidBody>
        <RigidBody type="fixed" position={[0, 2.5, -25]}>
          <CuboidCollider args={[25, 2.5, 0.5]} />
        </RigidBody>
        <RigidBody type="fixed" position={[0, 2.5, 25]}>
          <CuboidCollider args={[25, 2.5, 0.5]} />
        </RigidBody>
        {/* Floor Collider */}
        <RigidBody type="fixed" position={[0, -0.1, 0]}>
          <CuboidCollider args={[50, 0.1, 50]} />
        </RigidBody>

        {/* Debug: Visible Reference Cube at center */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>

        {/* Player */}
        <Player />

        {/* Enemies */}
        {enemies.map((enemy) => (
          <Enemy key={enemy.id} enemy={enemy} />
        ))}
      </Physics>

      {/* 🎨 POST-PROCESSING EFFECTS */}
      <EffectComposer>
        {/* Bloom for Neon Glow */}
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        {/* Vignette for Cinematic Look */}
        <Vignette
          offset={0.5}
          darkness={0.3}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
        {/* Chromatic Aberration for Cyberpunk Style */}
        <ChromaticAberration
          offset={[0.001, 0.001]}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </Canvas>
  );
}
