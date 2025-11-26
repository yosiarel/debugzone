// components/3d/Enemy.tsx
'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Text, Clone } from '@react-three/drei'; // Import Clone & useGLTF
import { Mesh, Vector3, Group } from 'three';
import { useGameStore } from '@/stores/gameStore';
import { EnemyState } from '@/types/game';

// 1. Preload Model supaya tidak lag saat muncul
useGLTF.preload('/Aliens/Alien_Scolitex.gltf');
useGLTF.preload('/Aliens/Alien_Cyclop.gltf');
useGLTF.preload('/Aliens/Alien_Oculichrysalis.gltf');

interface EnemyProps {
  enemy: EnemyState;
}

export function Enemy({ enemy }: EnemyProps) {
  const groupRef = useRef<Group>(null);
  const { camera } = useThree();
  const startBattle = useGameStore((state) => state.startBattle);
  const inBattle = useGameStore((state) => state.inBattle);
  const playerPosition = useGameStore((state) => state.player.position);

  const [proximityWarning, setProximityWarning] = useState(false);
  const battleTriggered = useRef(false);

  // 2. Pilih Model Berdasarkan Tipe Enemy
  const modelPath = useMemo(() => {
    switch (enemy.type) {
      case 'glitch': return '/Aliens/Alien_Scolitex.gltf';
      case 'bug': return '/Aliens/Alien_Cyclop.gltf';
      case 'virus': return '/Aliens/Alien_Oculichrysalis.gltf';
      default: return '/Aliens/Alien_Scolitex.gltf';
    }
  }, [enemy.type]);

  // Load modelnya
  const { scene } = useGLTF(modelPath);

  // Floating & Logic Loop
  useFrame((state) => {
    if (!groupRef.current || enemy.isDefeated) return;

    // Animasi Melayang (Floating)
    groupRef.current.position.y = enemy.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;

    // Rotasi pelan
    groupRef.current.rotation.y += 0.01;

    // Logika Jarak (Sama seperti sebelumnya)
    const enemyPos = new Vector3(...enemy.position);
    const playerPos = new Vector3(...playerPosition);
    const distance = enemyPos.distanceTo(playerPos);

    if (distance < 5 && distance > 3 && !enemy.isDefeated) {
      setProximityWarning(true);
    } else {
      setProximityWarning(false);
    }

    if (distance < 3 && !battleTriggered.current && !inBattle && !enemy.isDefeated) {
      battleTriggered.current = true;
      startBattle(enemy.id);
    }

    if (distance > 5) battleTriggered.current = false;
  });

  if (enemy.isDefeated) return null; // Atau ganti dengan partikel ledakan

  // Warna berdasarkan tipe dan boss status
  const enemyColor = enemy.type === 'glitch' ? '#ff0000' : enemy.type === 'bug' ? '#ff8800' : '#ff00ff';
  const scale = enemy.isBoss ? 1.5 : 1; // Boss lebih besar
  const glowIntensity = enemy.isBoss ? 15 : 8;

  return (
    <group ref={groupRef} position={enemy.position}>

      {/* Boss Crown/Indicator */}
      {enemy.isBoss && (
        <>
          <mesh position={[0, 3, 0]}>
            <torusGeometry args={[0.8, 0.1, 16, 32]} />
            <meshBasicMaterial color="#ffff00" />
          </mesh>
          <Text
            position={[0, 3.5, 0]}
            fontSize={0.3}
            color="#ffff00"
            anchorX="center"
            anchorY="middle"
          >
            👑 BOSS
          </Text>
        </>
      )}

      {/* 3. Render Model 3D Menggunakan <Clone> */}
      {/* Clone memungkinkan kita menggunakan 1 file model untuk BANYAK musuh tanpa berat */}
      <group scale={0.5 * scale} position={[0, -0.5, 0]}>
        <Clone object={scene} />
      </group>

      {/* Point Light untuk efek glowing */}
      <pointLight intensity={glowIntensity} color={enemyColor} distance={enemy.isBoss ? 8 : 3} position={[0, 0.5, 0]} />

      {/* Label Nama */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.3}
        color={enemyColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {enemy.type.toUpperCase()}
      </Text>

      {/* Health Bar */}
      <HealthBar3D health={enemy.health} maxHealth={enemy.maxHealth} color={enemyColor} />

      {/* Proximity Warning Ring */}
      {proximityWarning && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <ringGeometry args={[1.5, 1.6, 32]} />
          <meshBasicMaterial color="red" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// Komponen HealthBar kecil
function HealthBar3D({ health, maxHealth, color }: { health: number; maxHealth: number; color: string }) {
  const percentage = health / maxHealth;
  return (
    <group position={[0, 1.5, 0]}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.2, 0.15]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh position={[-(1.2 * (1 - percentage)) / 2, 0, 0]}>
        <planeGeometry args={[1.2 * percentage, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}