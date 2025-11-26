// components/3d/Level.tsx
'use client';

import { useGLTF, Clone, Float } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

// 1. PRELOAD ASSETS
// Kita load aset di awal supaya tidak "pop-in" saat game jalan
useGLTF.preload('/Platforms/Platform_CenterPlate.gltf');
useGLTF.preload('/Platforms/Platform_Metal.gltf');
useGLTF.preload('/Platforms/Platform_Rails_4Wide.gltf');
useGLTF.preload('/Props/Prop_Crate3.gltf');
useGLTF.preload('/Props/Prop_Computer.gltf');
useGLTF.preload('/Columns/Column_Pipes.gltf');
useGLTF.preload('/Props/Prop_Vent_Wide.gltf');
useGLTF.preload('/Decals/Decal_Logo.gltf');

export function Level() {
  // 2. LOAD MODELS
  // Kita ambil "scene" dari setiap file GLTF
  const { scene: floorMain } = useGLTF('/Platforms/Platform_CenterPlate.gltf');
  const { scene: floorMetal } = useGLTF('/Platforms/Platform_Metal.gltf');
  const { scene: rails } = useGLTF('/Platforms/Platform_Rails_4Wide.gltf');
  const { scene: crate } = useGLTF('/Props/Prop_Crate3.gltf');
  const { scene: computer } = useGLTF('/Props/Prop_Computer.gltf');
  const { scene: column } = useGLTF('/Columns/Column_Pipes.gltf');
  const { scene: vent } = useGLTF('/Props/Prop_Vent_Wide.gltf');
  const { scene: logo } = useGLTF('/Decals/Decal_Logo.gltf');

  // Ukuran Tile standar (biasanya 4 unit di Blender/Kenney assets)
  const TILE_SIZE = 4;
  const ARENA_SIZE = 6; // 6x6 tiles (24x24 meters)

  return (
    <group dispose={null}>

      {/* --- A. LANTAI (FLOOR) --- */}
      {/* Kita buat grid lantai 6x6 */}
      {Array.from({ length: ARENA_SIZE }).map((_, row) =>
        Array.from({ length: ARENA_SIZE }).map((_, col) => {
          // Posisi tile
          const x = (row - ARENA_SIZE / 2) * TILE_SIZE + TILE_SIZE / 2;
          const z = (col - ARENA_SIZE / 2) * TILE_SIZE + TILE_SIZE / 2;

          // Variasi: Bagian tengah pakai metal, pinggir pakai plate biasa
          const isCenter = row > 1 && row < 4 && col > 1 && col < 4;
          const model = isCenter ? floorMetal : floorMain;

          return (
            <group key={`floor-${row}-${col}`} position={[x, 0, z]}>
              <Clone object={model} />

              {/* Jika di pinggir arena, tambahkan Pagar (Rails) */}
              {row === 0 && <Clone object={rails} position={[0, 0, -2]} />}
              {row === ARENA_SIZE - 1 && <Clone object={rails} position={[0, 0, 2]} rotation-y={Math.PI} />}
              {col === 0 && <Clone object={rails} position={[-2, 0, 0]} rotation-y={Math.PI / 2} />}
              {col === ARENA_SIZE - 1 && <Clone object={rails} position={[2, 0, 0]} rotation-y={-Math.PI / 2} />}
            </group>
          );
        })
      )}

      {/* --- B. OBSTACLES & PROPS (Rintangan) --- */}

      {/* 1. Tumpukan Peti (Crates) - Bisa buat lindung/hiasan */}
      {/* Kita bungkus RigidBody tipe "fixed" supaya bisa ditabrak player */}
      <RigidBody type="fixed" colliders="hull">
        <group position={[8, 0.5, 8]} rotation={[0, 0.5, 0]}>
          <Clone object={crate} />
          <Clone object={crate} position={[0, 1, 0]} rotation-y={0.2} />
          <Clone object={crate} position={[1.2, 0, 0.2]} rotation-y={-0.4} />
        </group>
      </RigidBody>

      <RigidBody type="fixed" colliders="hull">
        <group position={[-8, 0.5, -8]} rotation={[0, -0.5, 0]}>
          <Clone object={crate} />
          <Clone object={crate} position={[0, 0, 1.2]} />
        </group>
      </RigidBody>

      {/* 2. Server Computers (Hiasan Cyber) */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[-5, 0, 5]} rotation={[0, Math.PI / 4, 0]}>
          <Clone object={computer} />
          <Clone object={computer} position={[1.5, 0, 0]} />
          {/* Tambahkan lampu kecil di server */}
          <pointLight position={[0.75, 1, 0.5]} color="#00ffff" intensity={2} distance={3} />
        </group>
      </RigidBody>

      {/* --- C. DEKORASI DINDING & PILAR --- */}

      {/* Pilar di 4 Sudut */}
      {[
        [-10, -10], [10, -10], [-10, 10], [10, 10]
      ].map(([x, z], i) => (
        <group key={`col-${i}`} position={[x, 0, z]}>
          <Clone object={column} scale={[1, 1.5, 1]} />
          {/* Lampu merah di atas pilar */}
          <pointLight position={[0, 4, 0]} color="#ff0000" intensity={3} distance={5} />
        </group>
      ))}

      {/* Ventilasi Besar di Dinding (Imajiner) */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Clone object={vent} position={[0, 4, -12]} scale={2} rotation-x={Math.PI / 6} />
      </Float>

      {/* --- D. LOGO ARENA --- */}
      {/* Logo melayang di tengah atas */}
      <Float speed={4} rotationIntensity={0} floatIntensity={1}>
        <group position={[0, 6, 0]}>
          <Clone object={logo} scale={3} />
          <pointLight color="#ff00ff" intensity={5} distance={10} />
        </group>
      </Float>

      {/* --- E. CAHAYA ENVIRONMENT (Tambahan) --- */}
      {/* Cahaya biru misterius dari bawah grid */}
      <pointLight position={[0, -2, 0]} color="#00ffff" intensity={10} distance={50} />

    </group>
  );
}