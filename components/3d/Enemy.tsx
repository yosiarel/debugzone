// ⚔️ DEBUGZONE: ENEMY SYSTEM
// AI-driven Glitches dengan Proximity Detection

'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useGameStore } from '@/stores/gameStore';
import { EnemyState } from '@/types/game';
import { Text } from '@react-three/drei';

interface EnemyProps {
  enemy: EnemyState;
}

export function Enemy({ enemy }: EnemyProps) {
  const meshRef = useRef<Mesh>(null);
  const { camera } = useThree();
  const startBattle = useGameStore((state) => state.startBattle);
  const inBattle = useGameStore((state) => state.inBattle);
  const playerPosition = useGameStore((state) => state.player.position);
  
  const [proximityWarning, setProximityWarning] = useState(false);
  const battleTriggered = useRef(false);

  // Floating animation
  useFrame((state) => {
    if (!meshRef.current || enemy.isDefeated) return;

    // Rotate enemy
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    meshRef.current.position.y =
      enemy.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;

    // Check distance to player (gunakan player position, bukan camera)
    const enemyPos = new Vector3(...enemy.position);
    const playerPos = new Vector3(...playerPosition);
    const distance = enemyPos.distanceTo(playerPos);

    // Proximity warning (3-5 meters)
    if (distance < 5 && distance > 3 && !enemy.isDefeated) {
      setProximityWarning(true);
    } else {
      setProximityWarning(false);
    }

    // Battle trigger (< 3 meters)
    if (distance < 3 && !battleTriggered.current && !inBattle && !enemy.isDefeated) {
      battleTriggered.current = true;
      startBattle(enemy.id);
    }

    // Reset battle trigger saat jauh
    if (distance > 5) {
      battleTriggered.current = false;
    }
  });

  if (enemy.isDefeated) {
    return (
      <group position={enemy.position}>
        {/* Defeated effect - scattered particles */}
        <DefeatedParticles position={enemy.position} />
      </group>
    );
  }

  // Get enemy color based on type
  const getEnemyColor = () => {
    switch (enemy.type) {
      case 'glitch':
        return '#ff0000';
      case 'bug':
        return '#ff8800';
      case 'virus':
        return '#ff00ff';
      default:
        return '#ff0000';
    }
  };

  const enemyColor = getEnemyColor();

  return (
    <group position={enemy.position}>
      {/* Enemy Body - Geometric Shape */}
      <mesh ref={meshRef} castShadow>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color={enemyColor}
          emissive={enemyColor}
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.8}
          wireframe={proximityWarning}
        />
      </mesh>

      {/* Inner Core */}
      <mesh>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color={enemyColor} />
      </mesh>

      {/* Glowing Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.05, 8, 16]} />
        <meshBasicMaterial color={enemyColor} />
      </mesh>

      {/* Point Light */}
      <pointLight intensity={5} color={enemyColor} distance={8} />

      {/* Enemy Type Label */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color={enemyColor}
        anchorX="center"
        anchorY="middle"
      >
        {enemy.type.toUpperCase()}
      </Text>

      {/* Health Bar 3D */}
      <HealthBar3D health={enemy.health} maxHealth={enemy.maxHealth} />

      {/* Proximity Warning */}
      {proximityWarning && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.25}
          color="#ffff00"
          anchorX="center"
          anchorY="middle"
        >
          ⚠️ BATTLE ZONE
        </Text>
      )}
    </group>
  );
}

// 3D Health Bar
function HealthBar3D({ health, maxHealth }: { health: number; maxHealth: number }) {
  const percentage = health / maxHealth;

  return (
    <group position={[0, -1.2, 0]}>
      {/* Background */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.5, 0.15]} />
        <meshBasicMaterial color="#333333" transparent opacity={0.8} />
      </mesh>
      {/* Health Fill */}
      <mesh position={[-(1.5 / 2) * (1 - percentage), 0, 0]}>
        <planeGeometry args={[1.5 * percentage, 0.15]} />
        <meshBasicMaterial
          color={percentage > 0.5 ? '#00ff00' : percentage > 0.25 ? '#ffaa00' : '#ff0000'}
        />
      </mesh>
    </group>
  );
}

// Defeated Enemy Particles
function DefeatedParticles({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = Math.random() * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.random() * 2,
              Math.sin(angle) * radius,
            ]}
          >
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
          </mesh>
        );
      })}
      <Text position={[0, 1, 0]} fontSize={0.4} color="#00ff00">
        DEFEATED
      </Text>
    </group>
  );
}
