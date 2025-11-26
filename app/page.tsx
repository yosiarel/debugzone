// 🎮 DEBUGZONE: THE CYBER ARENA
// A First-Person Coding Battle Experience

'use client';

import dynamic from 'next/dynamic';
import { HUD } from '@/components/ui/HUD';
import { QuizTerminal } from '@/components/ui/QuizTerminal';
import { VictoryScreen } from '@/components/ui/VictoryScreen';
import { GameOverScreen } from '@/components/ui/GameOverScreen';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PowerUpDisplay } from '@/components/ui/PowerUpDisplay';
import { TrainingTerminal } from '@/components/ui/TrainingTerminal';
import { useState, Suspense } from 'react';

// Dynamic import untuk Scene (client-side only)
const Scene = dynamic(() => import('@/components/3d/Scene').then(mod => ({ default: mod.Scene })), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-linear-to-br from-black via-cyan-950 to-black">
        <div className="max-w-2xl mx-4 text-center space-y-8">
          {/* Logo */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold font-mono bg-linear-to-r from-cyan-400 via-magenta-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              DEBUGZONE
            </h1>
            <p className="text-2xl text-cyan-300 font-mono">The Cyber Arena</p>
          </div>

          {/* Mission Brief */}
          <div className="bg-black/70 backdrop-blur-sm border-2 border-cyan-500 rounded-lg p-6 space-y-4 text-left">
            <h2 className="text-cyan-400 font-mono text-xl font-bold">🎯 MISSION BRIEF</h2>
            <div className="text-cyan-300 font-mono text-sm space-y-2">
              <p>
                You are a <span className="text-magenta-400 font-bold">Code Champion</span> candidate.
              </p>
              <p>
                The mainframe has been infected with <span className="text-red-400 font-bold">Glitches, Bugs, and Viruses</span>.
              </p>
              <p>
                Your weapon: <span className="text-cyan-400 font-bold">Syntax Knowledge</span>.
              </p>
              <p className="text-yellow-400 pt-2">
                ⚠️ Approach enemies to engage in coding battles. Answer correctly to damage them. Wrong answers damage your firewall.
              </p>
            </div>
          </div>

          {/* Objectives */}
          <div className="bg-black/70 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-4">
            <h3 className="text-cyan-400 font-mono text-sm font-bold mb-2">OBJECTIVES:</h3>
            <ul className="text-cyan-300 font-mono text-xs space-y-1 text-left">
              <li>✅ Explore 4 connected rooms through winding corridors</li>
              <li>✅ Defeat 4 Boss enemies with unique challenges</li>
              <li>✅ Collect power-ups from defeated bosses</li>
              <li>✅ Protect your firewall integrity (HP)</li>
            </ul>
          </div>

          {/* Boss Challenges */}
          <div className="bg-black/70 backdrop-blur-sm border border-yellow-500/50 rounded-lg p-4">
            <h3 className="text-yellow-400 font-mono text-sm font-bold mb-3 text-center">👑 BOSS CHALLENGES:</h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex flex-col items-center text-center">
                <p className="text-cyan-400">🔥 Server Room:</p>
                <p className="text-cyan-300 font-bold">TIME ATTACK</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="text-red-400">🔥 Weapon Room:</p>
                <p className="text-red-300 font-bold">FILL THE BLANK</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="text-green-400">🔥 Storage Room:</p>
                <p className="text-green-300 font-bold">SPEED QUIZ</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="text-magenta-400">🔥 Boss Room:</p>
                <p className="text-magenta-300 font-bold">CODE DEBUG</p>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={() => setShowIntro(false)}
            className="px-8 py-4 bg-linear-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500 text-white font-mono font-bold text-xl rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/50 hover:scale-105 animate-pulse"
          >
            🚀 ENTER THE ARENA
          </button>

          {/* Controls */}
          <div className="bg-cyan-900/30 border border-cyan-500/50 rounded-lg p-4 text-cyan-300 font-mono text-sm">
            <p className="font-bold mb-2">🎮 CONTROLS:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <p>W/A/S/D: Move</p>
              <p>Mouse: Rotate Camera</p>
              <p>Space: Jump</p>
              <p>Scroll: Zoom In/Out</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* 3D Scene with Error Boundary */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Scene />
        </Suspense>
      </ErrorBoundary>

      {/* UI Overlays */}
      <HUD />
      <QuizTerminal />
      <PowerUpDisplay />
      <TrainingTerminal />
      <VictoryScreen />
      <GameOverScreen />
    </div>
  );
}
