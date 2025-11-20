// 🎯 DEBUGZONE: HUD SYSTEM
// Futuristic Heads-Up Display

'use client';

import { useGameStore } from '@/stores/gameStore';
import { useEffect, useState } from 'react';

export function HUD() {
  const player = useGameStore((state) => state.player);
  const score = useGameStore((state) => state.score);
  const enemiesDefeated = useGameStore((state) => state.enemiesDefeated);
  const enemies = useGameStore((state) => state.enemies);
  
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Glitch effect saat health rendah
  useEffect(() => {
    if (player.health < 30) {
      const interval = setInterval(() => {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 100);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [player.health]);

  const healthPercentage = (player.health / player.maxHealth) * 100;
  const totalEnemies = enemies.length;

  return (
    <div className={`fixed inset-0 pointer-events-none ${glitchEffect ? 'animate-pulse' : ''}`}>
      {/* Top Left - Health & Status */}
      <div className="absolute top-6 left-6 space-y-4">
        {/* Health Bar */}
        <div className="bg-black/70 backdrop-blur-sm border border-cyan-500/50 p-4 rounded-lg">
          <div className="text-cyan-400 text-xs font-mono mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            FIREWALL INTEGRITY
          </div>
          <div className="w-64 h-8 bg-gray-900 rounded-lg overflow-hidden border border-cyan-500/30">
            <div
              className={`h-full transition-all duration-300 ${
                healthPercentage > 50
                  ? 'bg-linear-to-r from-cyan-500 to-cyan-300'
                  : healthPercentage > 25
                  ? 'bg-linear-to-r from-yellow-500 to-orange-400'
                  : 'bg-linear-to-r from-red-600 to-red-400 animate-pulse'
              }`}
              style={{ width: `${healthPercentage}%` }}
            >
              <div className="h-full w-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="text-cyan-300 text-lg font-bold mt-2 font-mono">
            {Math.round(player.health)} / {player.maxHealth} HP
          </div>
        </div>

        {/* Score */}
        <div className="bg-black/70 backdrop-blur-sm border border-cyan-500/50 p-3 rounded-lg">
          <div className="text-cyan-400 text-xs font-mono mb-1">SCORE</div>
          <div className="text-cyan-300 text-2xl font-bold font-mono">{score.toString().padStart(6, '0')}</div>
        </div>
      </div>

      {/* Top Right - Mission Status */}
      <div className="absolute top-6 right-6">
        <div className="bg-black/70 backdrop-blur-sm border border-magenta-500/50 p-4 rounded-lg">
          <div className="text-magenta-400 text-xs font-mono mb-2">MISSION STATUS</div>
          <div className="text-magenta-300 text-xl font-bold font-mono">
            {enemiesDefeated} / {totalEnemies} THREATS ELIMINATED
          </div>
          <div className="mt-2 flex gap-2">
            {enemies.map((enemy) => (
              <div
                key={enemy.id}
                className={`w-3 h-3 rounded-full ${
                  enemy.isDefeated ? 'bg-green-500' : 'bg-red-500 animate-pulse'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom - Controls Hint */}
      <div className="absolute bottom-6 left-6">
        <div className="bg-black/70 backdrop-blur-sm border border-cyan-500/30 p-3 rounded-lg">
          <div className="text-cyan-400 text-xs font-mono space-y-1">
            <div className="flex gap-3">
              <span className="text-cyan-500 font-bold">WASD</span>
              <span>Move</span>
            </div>
            <div className="flex gap-3">
              <span className="text-cyan-500 font-bold">SPACE</span>
              <span>Jump</span>
            </div>
            <div className="flex gap-3">
              <span className="text-cyan-500 font-bold">MOUSE</span>
              <span>Look Around</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vignette Effect saat health rendah */}
      {player.health < 30 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-8 border-red-500/30 animate-pulse"></div>
        </div>
      )}
    </div>
  );
}
