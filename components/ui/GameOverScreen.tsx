// 💀 DEBUGZONE: GAME OVER SCREEN
// Defeat screen with retry option

'use client';

import { useGameStore } from '@/stores/gameStore';

export function GameOverScreen() {
  const playerHealth = useGameStore((state) => state.player.health);
  const resetGame = useGameStore((state) => state.resetGame);
  const score = useGameStore((state) => state.score);
  const enemiesDefeated = useGameStore((state) => state.enemiesDefeated);

  if (playerHealth > 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto animate-glitch">
      <div className="text-center space-y-8 relative z-10">
        {/* Game Over Title */}
        <div className="animate-pulse">
          <h1 className="text-7xl font-bold font-mono text-red-500 mb-4">
            💀 FIREWALL BREACH 💀
          </h1>
          <p className="text-2xl text-red-400 font-mono">SYSTEM COMPROMISED</p>
        </div>

        {/* Glitch Effect */}
        <div className="text-red-500 font-mono text-6xl opacity-20 animate-glitch">
          ERROR ERROR ERROR ERROR
        </div>

        {/* Stats */}
        <div className="bg-black/70 backdrop-blur-sm border-2 border-red-500 rounded-lg p-8 mx-auto max-w-md">
          <div className="space-y-4 text-red-300 font-mono">
            <div className="flex justify-between text-xl">
              <span>Final Score:</span>
              <span className="text-red-400 font-bold">{score}</span>
            </div>
            <div className="flex justify-between text-xl">
              <span>Threats Eliminated:</span>
              <span className="text-yellow-400 font-bold">{enemiesDefeated}</span>
            </div>
            <div className="border-t-2 border-red-500/30 pt-4">
              <p className="text-red-400 text-sm">
                ⚠️ Your firewall integrity reached zero. The mainframe remains corrupted.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={resetGame}
            className="px-8 py-4 bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-mono font-bold text-lg rounded-lg transition-all duration-200 shadow-lg shadow-red-500/50"
          >
            🔄 RETRY MISSION
          </button>
        </div>

        {/* Encouragement */}
        <div className="text-red-400/80 font-mono text-sm">
          <p>💡 Learn from your mistakes and strengthen your syntax knowledge</p>
        </div>
      </div>
    </div>
  );
}
