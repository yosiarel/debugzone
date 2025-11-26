// components/3d/Level.tsx
'use client';

import { useGLTF, Clone, Float } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

// 1. PRELOAD ASSETS
// Kita load aset di awal supaya tidak "pop-in" saat game jalan
useGLTF.preload('/Platforms/Platform_CenterPlate.gltf');
useGLTF.preload('/Platforms/Platform_Metal.gltf');
useGLTF.preload('/Platforms/Platform_Simple.gltf');
useGLTF.preload('/Platforms/Platform_Rails_4Wide.gltf');
useGLTF.preload('/Walls/WallAstra_Straight.gltf');
useGLTF.preload('/Walls/ShortWall_MetalPlates_Straight.gltf');
useGLTF.preload('/Platforms/Door_Metal.gltf');
useGLTF.preload('/Props/Prop_Crate3.gltf');
useGLTF.preload('/Props/Prop_Crate4.gltf');
useGLTF.preload('/Props/Prop_Computer.gltf');
useGLTF.preload('/Props/Prop_Barrel_Large.gltf');
useGLTF.preload('/Columns/Column_Pipes.gltf');
useGLTF.preload('/Columns/Column_Astra.gltf');
useGLTF.preload('/Props/Prop_Vent_Wide.gltf');
useGLTF.preload('/Props/Prop_Light_Wide.gltf');
useGLTF.preload('/Decals/Decal_Logo.gltf');

export function Level() {
  // 2. LOAD MODELS
  // Kita ambil "scene" dari setiap file GLTF
  const { scene: floorMain } = useGLTF('/Platforms/Platform_CenterPlate.gltf');
  const { scene: floorMetal } = useGLTF('/Platforms/Platform_Metal.gltf');
  const { scene: floorSimple } = useGLTF('/Platforms/Platform_Simple.gltf');
  const { scene: rails } = useGLTF('/Platforms/Platform_Rails_4Wide.gltf');
  const { scene: wall } = useGLTF('/Walls/WallAstra_Straight.gltf');
  const { scene: shortWall } = useGLTF('/Walls/ShortWall_MetalPlates_Straight.gltf');
  const { scene: door } = useGLTF('/Platforms/Door_Metal.gltf');
  const { scene: crate3 } = useGLTF('/Props/Prop_Crate3.gltf');
  const { scene: crate4 } = useGLTF('/Props/Prop_Crate4.gltf');
  const { scene: computer } = useGLTF('/Props/Prop_Computer.gltf');
  const { scene: barrel } = useGLTF('/Props/Prop_Barrel_Large.gltf');
  const { scene: columnPipe } = useGLTF('/Columns/Column_Pipes.gltf');
  const { scene: columnAstra } = useGLTF('/Columns/Column_Astra.gltf');
  const { scene: vent } = useGLTF('/Props/Prop_Vent_Wide.gltf');
  const { scene: light } = useGLTF('/Props/Prop_Light_Wide.gltf');
  const { scene: logo } = useGLTF('/Decals/Decal_Logo.gltf');

  // Ukuran Tile standar (biasanya 4 unit di Blender/Kenney assets)
  const TILE_SIZE = 4;

  // === FUNGSI HELPER: BUAT RUANGAN ===
  const createRoom = (startX: number, startZ: number, sizeX: number, sizeZ: number, floorType: 'main' | 'metal' | 'simple' = 'main') => {
    const tiles = [];
    for (let row = 0; row < sizeX; row++) {
      for (let col = 0; col < sizeZ; col++) {
        const x = startX + row * TILE_SIZE;
        const z = startZ + col * TILE_SIZE;
        
        // Pilih model floor
        let model = floorMain;
        if (floorType === 'metal') {
          const isCenter = row > 0 && row < sizeX - 1 && col > 0 && col < sizeZ - 1;
          model = isCenter ? floorMetal : floorMain;
        } else if (floorType === 'simple') {
          model = floorSimple;
        }

        tiles.push(
          <group key={`tile-${startX}-${startZ}-${row}-${col}`} position={[x, 0, z]}>
            <Clone object={model} />
            
            {/* Rails di pinggir ruangan */}
            {row === 0 && <Clone object={rails} position={[0, 0, -2]} />}
            {row === sizeX - 1 && <Clone object={rails} position={[0, 0, 2]} rotation-y={Math.PI} />}
            {col === 0 && <Clone object={rails} position={[-2, 0, 0]} rotation-y={Math.PI / 2} />}
            {col === sizeZ - 1 && <Clone object={rails} position={[2, 0, 0]} rotation-y={-Math.PI / 2} />}
          </group>
        );
      }
    }
    return tiles;
  };

  // === FUNGSI HELPER: BUAT LORONG ===
  const createCorridor = (startX: number, startZ: number, length: number, direction: 'horizontal' | 'vertical') => {
    const tiles = [];
    const corridorWidth = 2; // Lorong lebar 2 tile
    
    for (let i = 0; i < length; i++) {
      for (let w = 0; w < corridorWidth; w++) {
        const x = direction === 'horizontal' ? startX + i * TILE_SIZE : startX + w * TILE_SIZE;
        const z = direction === 'vertical' ? startZ + i * TILE_SIZE : startZ + w * TILE_SIZE;
        
        tiles.push(
          <group key={`corridor-${startX}-${startZ}-${i}-${w}`} position={[x, 0, z]}>
            <Clone object={floorSimple} />
          </group>
        );
      }
    }
    return tiles;
  };

  // === FUNGSI HELPER: BUAT DINDING ===
  const createWallSegments = (positions: number[][], rotation: number, keyPrefix: string) => {
    return positions.map(([x, z], i) => (
      <RigidBody key={`${keyPrefix}-${i}`} type="fixed" colliders="cuboid" position={[x, 0, z]} rotation-y={rotation}>
        <Clone object={wall} scale={[1, 2, 1]} />
        <mesh visible={false}>
          <boxGeometry args={[4, 6, 2]} />
        </mesh>
      </RigidBody>
    ));
  };

  return (
    <group dispose={null}>

      {/* --- A. RUANGAN UTAMA (CENTER) - 8x8 tiles --- */}
      {createRoom(-16, -16, 8, 8, 'metal')}
      
      {/* DINDING DINONAKTIFKAN SEMENTARA */}
      {/* {createWallSegments([[-12, -18], [-8, -18], [-4, -18], [4, -18], [8, -18], [12, -18]], 0, 'main-north')} */}
      {/* {createWallSegments([[-12, 18], [-8, 18], [-4, 18], [4, 18], [8, 18], [12, 18]], 0, 'main-south')} */}
      {/* {createWallSegments([[-18, -12], [-18, -8], [-18, -4], [-18, 4], [-18, 8], [-18, 12]], Math.PI / 2, 'main-west')} */}
      {/* {createWallSegments([[18, -12], [18, -8], [18, -4], [18, 4], [18, 8], [18, 12]], Math.PI / 2, 'main-east')} */}
      
      {/* Pilar di sudut ruangan utama */}
      {[[-14, -14], [14, -14], [-14, 14], [14, 14]].map(([x, z], i) => (
        <group key={`main-col-${i}`} position={[x, 0, z]}>
          <Clone object={columnPipe} scale={[1, 1.5, 1]} />
          <pointLight position={[0, 4, 0]} color="#00ffff" intensity={3} distance={8} />
        </group>
      ))}
      
      {/* Props Main Room - Computers & Crates */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[-8, 0, -8]}>
          <Clone object={computer} />
          <pointLight position={[0, 1, 0]} color="#00ffff" intensity={3} distance={4} />
        </group>
      </RigidBody>
      
      <RigidBody type="fixed" colliders="hull">
        <group position={[10, 0.5, -10]} rotation-y={0.5}>
          <Clone object={crate3} />
          <Clone object={crate4} position={[1.2, 0, 0]} />
        </group>
      </RigidBody>
      
      <RigidBody type="fixed" colliders="hull">
        <group position={[-10, 0.5, 10]} rotation-y={-0.3}>
          <Clone object={crate3} />
          <Clone object={crate3} position={[0, 1, 0]} rotation-y={0.2} />
        </group>
      </RigidBody>

      {/* --- TRAINING TERMINAL (CORNER OF MAIN ROOM) --- */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[-12, 0, -12]}>
          {/* Base platform */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
            <meshStandardMaterial 
              color="#003366" 
              emissive="#0066ff"
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Terminal pedestal */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 1, 16]} />
            <meshStandardMaterial 
              color="#004488" 
              emissive="#0088ff"
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Screen */}
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[1, 0.8, 0.1]} />
            <meshStandardMaterial 
              color="#001122" 
              emissive="#00ffff"
              emissiveIntensity={0.8}
            />
          </mesh>
          
          {/* Holographic rings */}
          <mesh position={[0, 1.8, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.6, 0.05, 16, 32]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 2.2, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.5, 0.03, 16, 32]} />
            <meshBasicMaterial color="#0088ff" transparent opacity={0.4} />
          </mesh>
          
          {/* Glow lights */}
          <pointLight position={[0, 1.5, 0]} color="#00ffff" intensity={10} distance={8} />
          <pointLight position={[0, 2, 0]} color="#0088ff" intensity={5} distance={6} />
        </group>
      </RigidBody>

      {/* --- B. LORONG UTARA BERLIKU (ke Ruang Server) --- */}
      {/* Segmen 1: Keluar dari Main Room ke utara */}
      {createCorridor(-4, -20, 3, 'vertical')}
      
      {/* Belokan 1: Area persimpangan kanan */}
      {createCorridor(0, -28, 3, 'horizontal')}
      {createCorridor(4, -28, 2, 'vertical')}
      
      {/* Segmen 2: Lanjut ke utara */}
      {createCorridor(8, -36, 4, 'vertical')}
      
      {/* Belokan 2: Area persimpangan kiri */}
      {createCorridor(-4, -48, 4, 'horizontal')}
      {createCorridor(4, -48, 2, 'vertical')}
      
      {/* Segmen 3: Masuk ke Server Room */}
      {createCorridor(-4, -56, 3, 'vertical')}

      {/* --- C. RUANG SERVER (NORTH) - 6x6 tiles --- */}
      {createRoom(-12, -64, 6, 6, 'main')}
      
      {/* DINDING DINONAKTIFKAN SEMENTARA */}
      {/* {createWallSegments([[-10, -66], [-6, -66], [-2, -66], [2, -66], [6, -66], [10, -66]], 0, 'server-north')} */}
      {/* {createWallSegments([[-14, -62], [-14, -58], [-14, -54], [-14, -50], [-14, -46]], Math.PI / 2, 'server-west')} */}
      {/* {createWallSegments([[14, -62], [14, -58], [14, -54], [14, -50], [14, -46]], Math.PI / 2, 'server-east')} */}
      
      {/* Server racks */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[-8, 0, -58]}>
          <Clone object={computer} />
          <Clone object={computer} position={[0, 0, 2]} />
          <Clone object={computer} position={[0, 0, 4]} />
          <pointLight position={[0, 1.5, 2]} color="#00ffff" intensity={5} distance={6} />
        </group>
      </RigidBody>
      
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[8, 0, -58]}>
          <Clone object={computer} rotation-y={Math.PI} />
          <Clone object={computer} position={[0, 0, 2]} rotation-y={Math.PI} />
          <Clone object={computer} position={[0, 0, 4]} rotation-y={Math.PI} />
          <pointLight position={[0, 1.5, 2]} color="#00ff88" intensity={5} distance={6} />
        </group>
      </RigidBody>
      
      {/* Props Server Room - More computers & barrels */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[0, 0, -64]}>
          <Clone object={computer} rotation-y={Math.PI} />
          <pointLight position={[0, 1, 0]} color="#00ff88" intensity={3} distance={4} />
        </group>
      </RigidBody>
      
      {[[-10, -60], [10, -60]].map(([x, z], i) => (
        <RigidBody key={`server-barrel-${i}`} type="fixed" colliders="hull">
          <group position={[x, 0, z]}>
            <Clone object={barrel} scale={0.8} />
            <pointLight position={[0, 1, 0]} color="#00ffff" intensity={2} distance={3} />
          </group>
        </RigidBody>
      ))}

      {/* --- D. LORONG SELATAN BERLIKU (ke Ruang Weapon) --- */}
      {/* Segmen 1: Keluar dari Main Room ke selatan */}
      {createCorridor(-4, 20, 3, 'vertical')}
      
      {/* Belokan 1: Area persimpangan kiri */}
      {createCorridor(-16, 28, 4, 'horizontal')}
      {createCorridor(-12, 28, 2, 'vertical')}
      
      {/* Segmen 2: Lanjut ke selatan */}
      {createCorridor(-12, 36, 4, 'vertical')}
      
      {/* Belokan 2: Area persimpangan kanan */}
      {createCorridor(-8, 48, 3, 'horizontal')}
      {createCorridor(-8, 48, 2, 'vertical')}
      
      {/* Segmen 3: Masuk ke Weapon Room */}
      {createCorridor(-4, 56, 3, 'vertical')}

      {/* --- E. RUANG WEAPON (SOUTH) - 7x7 tiles --- */}
      {createRoom(-14, 40, 7, 7, 'simple')}
      
      {/* DINDING DINONAKTIFKAN SEMENTARA */}
      {/* {createWallSegments([[-12, 66], [-8, 66], [-4, 66], [0, 66], [4, 66], [8, 66], [12, 66]], 0, 'weapon-south')} */}
      {/* {createWallSegments([[-16, 42], [-16, 46], [-16, 50], [-16, 54], [-16, 58], [-16, 62]], Math.PI / 2, 'weapon-west')} */}
      {/* {createWallSegments([[16, 42], [16, 46], [16, 50], [16, 54], [16, 58], [16, 62]], Math.PI / 2, 'weapon-east')} */}
      
      {/* Weapon crates */}
      <RigidBody type="fixed" colliders="hull">
        <group position={[-8, 0.5, 50]} rotation={[0, 0.5, 0]}>
          <Clone object={crate3} />
          <Clone object={crate3} position={[0, 1, 0]} rotation-y={0.2} />
          <Clone object={crate4} position={[1.5, 0, 0.5]} />
        </group>
      </RigidBody>
      
      <RigidBody type="fixed" colliders="hull">
        <group position={[8, 0.5, 50]} rotation={[0, -0.5, 0]}>
          <Clone object={crate4} />
          <Clone object={crate3} position={[0, 0, 1.5]} />
        </group>
      </RigidBody>

      {/* Barrels di ruang weapon */}
      {[[-10, 48], [10, 48], [0, 54], [-8, 62], [8, 62]].map(([x, z], i) => (
        <RigidBody key={`barrel-${i}`} type="fixed" colliders="hull">
          <group position={[x, 0, z]}>
            <Clone object={barrel} />
            <pointLight position={[0, 1.5, 0]} color="#ff8800" intensity={4} distance={5} />
          </group>
        </RigidBody>
      ))}
      
      {/* Props Weapon Room - More crates stacked */}
      <RigidBody type="fixed" colliders="hull">
        <group position={[-12, 0.5, 60]} rotation-y={0.8}>
          <Clone object={crate4} />
          <Clone object={crate3} position={[0, 1, 0]} />
          <Clone object={crate4} position={[0, 2, 0]} rotation-y={0.5} />
        </group>
      </RigidBody>
      
      <RigidBody type="fixed" colliders="hull">
        <group position={[12, 0.5, 58]} rotation-y={-0.6}>
          <Clone object={crate3} />
          <Clone object={crate4} position={[0, 1, 0]} />
        </group>
      </RigidBody>

      {/* --- F. LORONG TIMUR BERLIKU (ke Boss Room) --- */}
      {/* Segmen 1: Keluar dari Main Room ke timur */}
      {createCorridor(20, -4, 3, 'horizontal')}
      
      {/* Belokan 1: Area persimpangan selatan */}
      {createCorridor(28, 0, 3, 'vertical')}
      {createCorridor(28, 4, 2, 'horizontal')}
      
      {/* Segmen 2: Lanjut ke timur */}
      {createCorridor(36, 8, 3, 'horizontal')}
      
      {/* Belokan 2: Area persimpangan utara */}
      {createCorridor(44, -4, 4, 'vertical')}
      {createCorridor(44, 4, 2, 'vertical')}
      
      {/* Segmen 3: Masuk ke Boss Room */}
      {createCorridor(52, -4, 2, 'horizontal')}

      {/* --- G. BOSS ROOM (EAST) - 8x8 tiles --- */}
      {createRoom(48, -16, 8, 8, 'metal')}
      
      {/* DINDING DINONAKTIFKAN SEMENTARA */}
      {/* {Array.from({ length: 8 }).map((_, i) => (
        <RigidBody key={`boss-north-${i}`} type="fixed" colliders="cuboid" position={[50 + i * 4, 0, -18]}>
          <Clone object={wall} scale={[1, 2.5, 1]} />
          <mesh visible={false}>
            <boxGeometry args={[4, 8, 2]} />
          </mesh>
        </RigidBody>
      ))} */}
      
      {/* {Array.from({ length: 8 }).map((_, i) => (
        <RigidBody key={`boss-south-${i}`} type="fixed" colliders="cuboid" position={[50 + i * 4, 0, 18]}>
          <Clone object={wall} scale={[1, 2.5, 1]} />
          <mesh visible={false}>
            <boxGeometry args={[4, 8, 2]} />
          </mesh>
        </RigidBody>
      ))} */}
      
      {/* {Array.from({ length: 8 }).map((_, i) => (
        <RigidBody key={`boss-east-${i}`} type="fixed" colliders="cuboid" position={[82, 0, -14 + i * 4]} rotation-y={Math.PI / 2}>
          <Clone object={wall} scale={[1, 2.5, 1]} />
          <mesh visible={false}>
            <boxGeometry args={[4, 8, 2]} />
          </mesh>
        </RigidBody>
      ))} */}
      
      {/* Boss room columns */}
      {[[52, -12], [76, -12], [52, 12], [76, 12]].map(([x, z], i) => (
        <group key={`boss-col-${i}`} position={[x, 0, z]}>
          <Clone object={columnAstra} scale={[1.2, 2, 1.2]} />
          <pointLight position={[0, 5, 0]} color="#ff00ff" intensity={8} distance={12} />
        </group>
      ))}
      
      {/* Boss platform */}
      <group position={[64, 1, 0]}>
        <Clone object={logo} scale={4} />
        <pointLight color="#ff0000" intensity={15} distance={15} />
      </group>
      
      {/* Props Boss Room - Decorative barrels in corners */}
      {[[54, -14], [74, -14], [54, 14], [74, 14]].map(([x, z], i) => (
        <group key={`boss-prop-${i}`} position={[x, 0, z]}>
          <Clone object={barrel} scale={1.2} />
          <pointLight position={[0, 2, 0]} color="#ff00ff" intensity={6} distance={6} />
        </group>
      ))}
      
      {/* Decorative crates near entrance */}
      <RigidBody type="fixed" colliders="hull">
        <group position={[52, 0.5, -6]} rotation-y={0.3}>
          <Clone object={crate3} />
          <Clone object={crate4} position={[1.2, 0, 0]} />
        </group>
      </RigidBody>
      
      <RigidBody type="fixed" colliders="hull">
        <group position={[52, 0.5, 6]} rotation-y={-0.3}>
          <Clone object={crate4} />
          <Clone object={crate3} position={[1.2, 0, 0]} />
        </group>
      </RigidBody>

      {/* --- H. LORONG BARAT BERLIKU (ke Storage) --- */}
      {/* Segmen 1: Keluar dari Main Room ke barat */}
      {createCorridor(-28, -4, 3, 'horizontal')}
      
      {/* Belokan 1: Area persimpangan utara */}
      {createCorridor(-36, -12, 3, 'vertical')}
      {createCorridor(-36, -8, 2, 'horizontal')}
      
      {/* Segmen 2: Lanjut ke barat */}
      {createCorridor(-48, -12, 4, 'horizontal')}
      
      {/* Belokan 2: Area persimpangan selatan */}
      {createCorridor(-56, -8, 3, 'vertical')}
      {createCorridor(-56, -8, 2, 'horizontal')}
      
      {/* Segmen 3: Masuk ke Storage Room */}
      {createCorridor(-64, -4, 2, 'horizontal')}

      {/* --- I. STORAGE ROOM (WEST) - 6x6 tiles --- */}
      {createRoom(-64, -12, 6, 6, 'simple')}
      
      {/* DINDING DINONAKTIFKAN SEMENTARA */}
      {/* {createWallSegments([[-62, -14], [-58, -14], [-54, -14], [-50, -14], [-46, -14], [-42, -14]], 0, 'storage-north')} */}
      {/* {createWallSegments([[-62, 14], [-58, 14], [-54, 14], [-50, 14], [-46, 14], [-42, 14]], 0, 'storage-south')} */}
      {/* {createWallSegments([[-66, -10], [-66, -6], [-66, -2], [-66, 2], [-66, 6], [-66, 10]], Math.PI / 2, 'storage-west')} */}
      
      {/* Storage crates everywhere */}
      {[[-62, -10], [-62, -2], [-62, 6], [-58, -8], [-58, 0], [-58, 8], [-54, -10], [-54, 6], [-50, -6], [-50, 2], [-50, 10]].map(([x, z], i) => (
        <RigidBody key={`storage-${i}`} type="fixed" colliders="hull">
          <group position={[x, 0.5, z]} rotation={[0, Math.random() * Math.PI, 0]}>
            <Clone object={i % 3 === 0 ? crate3 : crate4} />
            {i % 4 === 0 && <Clone object={crate3} position={[0, 1, 0]} rotation-y={Math.random()} />}
          </group>
        </RigidBody>
      ))}
      
      {/* Props Storage - Barrels between crates */}
      {[[-60, -4], [-56, 4], [-52, -8]].map(([x, z], i) => (
        <RigidBody key={`storage-barrel-${i}`} type="fixed" colliders="hull">
          <group position={[x, 0, z]}>
            <Clone object={barrel} scale={0.9} />
            <pointLight position={[0, 1, 0]} color="#ff8800" intensity={2} distance={3} />
          </group>
        </RigidBody>
      ))}

      {/* --- J. PINTU ANTAR RUANGAN --- */}
      
      {/* Pintu Utara (ke Server Room) */}
      <group position={[0, 0, -18]} rotation-y={0}>
        <Clone object={door} scale={1.5} />
        <pointLight position={[0, 2, 0]} color="#00ffff" intensity={10} distance={8} />
      </group>
      
      {/* Pintu Selatan (ke Weapon Room) */}
      <group position={[0, 0, 18]} rotation-y={Math.PI}>
        <Clone object={door} scale={1.5} />
        <pointLight position={[0, 2, 0]} color="#00ff88" intensity={10} distance={8} />
      </group>
      
      {/* Pintu Timur (ke Boss Room) */}
      <group position={[18, 0, 0]} rotation-y={-Math.PI / 2}>
        <Clone object={door} scale={1.5} />
        <pointLight position={[0, 2, 0]} color="#ff00ff" intensity={10} distance={8} />
      </group>
      
      {/* Pintu Barat (ke Storage) */}
      <group position={[-18, 0, 0]} rotation-y={Math.PI / 2}>
        <Clone object={door} scale={1.5} />
        <pointLight position={[0, 2, 0]} color="#ff8800" intensity={10} distance={8} />
      </group>

      {/* --- K. CEILING LIGHTS --- */}
      
      {/* Main room lights */}
      {[[-8, 0], [8, 0], [0, -8], [0, 8]].map(([x, z], i) => (
        <group key={`main-light-${i}`} position={[x, 6, z]} rotation-x={Math.PI}>
          <Clone object={light} scale={2} />
          <pointLight position={[0, -1, 0]} color="#00ffff" intensity={20} distance={15} castShadow />
        </group>
      ))}
      
      {/* Server room lights */}
      {[[-8, -56], [8, -56]].map(([x, z], i) => (
        <group key={`server-light-${i}`} position={[x, 6, z]} rotation-x={Math.PI}>
          <Clone object={light} scale={2} />
          <pointLight position={[0, -1, 0]} color="#00ff88" intensity={20} distance={15} />
        </group>
      ))}
      
      {/* Weapon room lights */}
      {[[-8, 48], [8, 48]].map(([x, z], i) => (
        <group key={`weapon-light-${i}`} position={[x, 6, z]} rotation-x={Math.PI}>
          <Clone object={light} scale={2} />
          <pointLight position={[0, -1, 0]} color="#ff8800" intensity={20} distance={15} />
        </group>
      ))}
      
      {/* Boss room dramatic lighting */}
      <group position={[64, 8, 0]} rotation-x={Math.PI}>
        <Clone object={light} scale={3} />
        <pointLight position={[0, -2, 0]} color="#ff00ff" intensity={40} distance={25} castShadow />
      </group>

      {/* --- L. VENTS & CORRIDOR PROPS --- */}
      
      {/* Corridor vents - positioned at turns */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Clone object={vent} position={[0, 5, -26]} scale={2} rotation-x={Math.PI} />
      </Float>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Clone object={vent} position={[8, 5, -32]} scale={2} rotation-x={Math.PI} />
      </Float>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Clone object={vent} position={[12, 5, -48]} scale={2} rotation-x={Math.PI} />
      </Float>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Clone object={vent} position={[-8, 5, 32]} scale={2} rotation-x={Math.PI} />
      </Float>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Clone object={vent} position={[0, 5, 50]} scale={2} rotation-x={Math.PI} />
      </Float>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Clone object={vent} position={[32, 5, -8]} scale={2} rotation-x={Math.PI} />
      </Float>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Clone object={vent} position={[-32, 5, 8]} scale={2} rotation-x={Math.PI} />
      </Float>
      
      {/* Corridor props - Barrels at corners */}
      {[[0, -26], [8, -32], [12, -44], [0, -52]].map(([x, z], i) => (
        <RigidBody key={`corridor-n-${i}`} type="fixed" colliders="hull">
          <group position={[x, 0, z]}>
            <Clone object={barrel} scale={0.7} />
            <pointLight position={[0, 1, 0]} color="#00ffff" intensity={2} distance={3} />
          </group>
        </RigidBody>
      ))}
      
      {[[-10, 32], [0, 40], [-4, 52]].map(([x, z], i) => (
        <RigidBody key={`corridor-s-${i}`} type="fixed" colliders="hull">
          <group position={[x, 0, z]}>
            <Clone object={barrel} scale={0.7} />
            <pointLight position={[0, 1, 0]} color="#ff8800" intensity={2} distance={3} />
          </group>
        </RigidBody>
      ))}
      
      {/* Corridor columns at turns */}
      {[[8, -32], [12, -48], [0, -52]].map(([x, z], i) => (
        <group key={`col-n-${i}`} position={[x, 0, z]}>
          <Clone object={columnPipe} scale={[0.8, 1.2, 0.8]} />
          <pointLight position={[0, 3, 0]} color="#00ffff" intensity={3} distance={6} />
        </group>
      ))}
      
      {[[-12, 28], [-8, 40]].map(([x, z], i) => (
        <group key={`col-s-${i}`} position={[x, 0, z]}>
          <Clone object={columnPipe} scale={[0.8, 1.2, 0.8]} />
          <pointLight position={[0, 3, 0]} color="#ff8800" intensity={3} distance={6} />
        </group>
      ))}
      
      {[[28, 0], [32, -12]].map(([x, z], i) => (
        <group key={`col-e-${i}`} position={[x, 0, z]}>
          <Clone object={columnPipe} scale={[0.8, 1.2, 0.8]} />
          <pointLight position={[0, 3, 0]} color="#ff00ff" intensity={3} distance={6} />
        </group>
      ))}
      
      {[[-28, 8], [-44, 8]].map(([x, z], i) => (
        <group key={`col-w-${i}`} position={[x, 0, z]}>
          <Clone object={columnPipe} scale={[0.8, 1.2, 0.8]} />
          <pointLight position={[0, 3, 0]} color="#ff8800" intensity={3} distance={6} />
        </group>
      ))}

      {/* --- M. AMBIENT LIGHTING --- */}
      
      {/* Main room ambient */}
      <pointLight position={[0, -2, 0]} color="#00ffff" intensity={15} distance={60} />
      
      {/* Server room cool blue */}
      <pointLight position={[0, -2, -56]} color="#0088ff" intensity={12} distance={40} />
      
      {/* Weapon room warm orange */}
      <pointLight position={[0, -2, 48]} color="#ff8800" intensity={12} distance={40} />
      
      {/* Boss room ominous red */}
      <pointLight position={[64, -2, 0]} color="#ff0000" intensity={20} distance={50} />
      
      {/* Storage room dim */}
      <pointLight position={[-56, -2, 0]} color="#00ffff" intensity={8} distance={35} />

    </group>
  );
}