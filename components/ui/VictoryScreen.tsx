// 🏆 DEBUGZONE: VICTORY SCREEN
// Champion celebration with particle effects

'use client';

import { useGameStore } from '@/stores/gameStore';
import { audioManager } from '@/lib/audioManager';
import { useEffect, useState } from 'react';

export function VictoryScreen() {
  const isChampion = useGameStore((state) => state.isChampion);
  const score = useGameStore((state) => state.score);
  const enemiesDefeated = useGameStore((state) => state.enemiesDefeated);
  const resetGame = useGameStore((state) => state.resetGame);
  
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (isChampion) {
      // Play victory sound
      audioManager.playVictory();
      
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    }
  }, [isChampion]);

  if (!isChampion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto">
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-fall"
            style={{
              left: `${particle.x}%`,
              animationDelay: `${particle.delay}s`,
              top: '-10px',
            }}
          ></div>
        ))}
      </div>

      {/* Victory Content */}
      <div className="text-center space-y-8 relative z-10">
        {/* Champion Title */}
        <div className="animate-pulse">
          <h1 className="text-7xl font-bold font-mono bg-linear-to-r from-cyan-400 via-magenta-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
            🏆 CHAMPION 🏆
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-3xl text-cyan-300 font-mono animate-bounce">
          YOU ARE THE JAWARA!
        </p>

        {/* Stats */}
        <div className="bg-black/70 backdrop-blur-sm border-2 border-cyan-500 rounded-lg p-8 mx-auto max-w-md">
          <div className="space-y-4 text-cyan-300 font-mono">
            <div className="flex justify-between text-xl">
              <span>Final Score:</span>
              <span className="text-magenta-400 font-bold">{score}</span>
            </div>
            <div className="flex justify-between text-xl">
              <span>Threats Eliminated:</span>
              <span className="text-green-400 font-bold">{enemiesDefeated}</span>
            </div>
            <div className="border-t-2 border-cyan-500/30 pt-4">
              <p className="text-cyan-400 text-sm">
                🎯 All Glitches have been purged from the mainframe!
              </p>
            </div>
          </div>
        </div>

        {/* Rank */}
        <div className="bg-linear-to-r from-cyan-900 to-magenta-900 border-2 border-cyan-500 rounded-lg p-6 mx-auto max-w-md">
          <p className="text-cyan-300 font-mono text-lg mb-2">🌟 RANK ACHIEVED</p>
          <p className="text-4xl font-bold text-transparent bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text">
            CODE CHAMPION
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={resetGame}
            className="px-8 py-4 bg-linear-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500 text-white font-mono font-bold text-lg rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/50"
          >
            🔄 RESTART MISSION
          </button>
        </div>

        {/* Achievement Message */}
        <div className="text-cyan-400 font-mono text-sm animate-pulse">
          <p>✨ Your syntax knowledge has saved the digital realm ✨</p>
        </div>
      </div>
    </div>
  );
}
