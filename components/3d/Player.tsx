// 🎮 DEBUGZONE: PLAYER CONTROLLER
// Third-Person Movement dengan Orbit Controls

'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { Vector3, Euler } from 'three';
import { useGameStore } from '@/stores/gameStore';

const MOVE_SPEED = 8;
const JUMP_FORCE = 6;
const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 3;

export function Player() {
  const playerRef = useRef<any>(null);
  const orbitRef = useRef<any>(null);
  const { camera } = useThree();
  const isLocked = useGameStore((state) => state.player.isLocked);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);

  // Keyboard state
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const canJump = useRef(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const playerPos = playerRef.current.translation();
    
    // Update player position in store for enemy detection
    setPlayerPosition([playerPos.x, playerPos.y, playerPos.z]);

    // Only move player when not in battle
    if (isLocked) {
      // Update camera target even during battle
      if (orbitRef.current) {
        orbitRef.current.target.lerp(
          new Vector3(playerPos.x, playerPos.y + 1, playerPos.z),
          0.1
        );
      }
      return;
    }

    const moveVector = new Vector3();

    // Get camera's forward direction (for movement relative to camera)
    const forward = new Vector3();
    const right = new Vector3();
    
    // Camera look direction
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, new Vector3(0, 1, 0)).normalize();

    // WASD Movement (relative to camera view)
    if (keysPressed.current['KeyW']) {
      moveVector.add(forward);
    }
    if (keysPressed.current['KeyS']) {
      moveVector.sub(forward);
    }
    if (keysPressed.current['KeyA']) {
      moveVector.sub(right);
    }
    if (keysPressed.current['KeyD']) {
      moveVector.add(right);
    }

    // Normalize diagonal movement
    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(MOVE_SPEED);
    }

    // Get current velocity
    const currentVelocity = playerRef.current.linvel();

    // Apply movement (preserve Y velocity for gravity)
    playerRef.current.setLinvel({
      x: moveVector.x,
      y: currentVelocity.y,
      z: moveVector.z,
    }, true);

    // Jump (Space)
    if (keysPressed.current['Space'] && canJump.current && Math.abs(currentVelocity.y) < 0.1) {
      playerRef.current.setLinvel({
        x: currentVelocity.x,
        y: JUMP_FORCE,
        z: currentVelocity.z,
      }, true);
      canJump.current = false;
      setTimeout(() => {
        canJump.current = true;
      }, 300);
    }

    // Third-Person Camera Follow
    if (orbitRef.current) {
      // Smooth camera follow
      orbitRef.current.target.lerp(
        new Vector3(playerPos.x, playerPos.y + 1, playerPos.z),
        0.1
      );
    }
  });

  return (
    <>
      {/* Third-Person Orbit Controls */}
      <OrbitControls
        ref={orbitRef}
        enablePan={false}
        enableZoom={true}
        maxDistance={10}
        minDistance={3}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        makeDefault
      />

      {/* Player Physics Body & Visual */}
      <RigidBody
        ref={playerRef}
        position={[0, 2, 5]}
        enabledRotations={[false, false, false]}
        linearDamping={2}
        angularDamping={1}
        mass={1}
        type="dynamic"
        lockRotations
        friction={1}
      >
        <CapsuleCollider args={[0.75, 0.5]} />
        
        {/* Player Character Visual - Cyberpunk Style */}
        <group position={[0, 0, 0]}>
          {/* Main Body */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <capsuleGeometry args={[0.4, 1]} />
            <meshStandardMaterial 
              color="#00ffff" 
              emissive="#00ffff"
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>
          
          {/* Head/Helmet */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial 
              color="#0088ff" 
              emissive="#00ffff"
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>

          {/* Visor Glow */}
          <mesh position={[0, 1.5, 0.3]} castShadow>
            <boxGeometry args={[0.4, 0.15, 0.05]} />
            <meshStandardMaterial 
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={1}
            />
          </mesh>

          {/* Body Glow Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.8, 0]}>
            <torusGeometry args={[0.5, 0.05, 8, 16]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>

          {/* Player Point Light */}
          <pointLight position={[0, 1, 0]} intensity={3} color="#00ffff" distance={5} />
        </group>
      </RigidBody>
    </>
  );
}
