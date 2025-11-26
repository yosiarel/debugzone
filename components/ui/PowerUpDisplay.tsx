// 💪 DEBUGZONE: POWER-UP DISPLAY
// Shows collected power-ups and allows using them

'use client';

import { useGameStore } from '@/stores/gameStore';
import { PowerUpType } from '@/types/game';

const POWERUP_INFO = {
  'shield': {
    icon: '🛡️',
    name: 'Shield',
    description: 'Block next damage',
    color: 'cyan',
  },
  'double-damage': {
    icon: '⚔️',
    name: 'Double Damage',
    description: 'Next attack deals 2x damage',
    color: 'red',
  },
  'vanish-options': {
    icon: '👁️',
    name: 'Vanish Options',
    description: 'Remove 2 wrong answers',
    color: 'blue',
  },
  'mega-heal': {
    icon: '💚',
    name: 'Mega Heal',
    description: 'Restore 50 HP',
    color: 'green',
  },
};

export function PowerUpDisplay() {
  const powerUps = useGameStore((state) => state.powerUps);
  const usePowerUp = useGameStore((state) => state.usePowerUp);
  const inBattle = useGameStore((state) => state.inBattle);

  const handleUsePowerUp = (type: PowerUpType) => {
    usePowerUp(type);
  };

  if (powerUps.length === 0) return null;

  return (
    <div className="fixed top-32 right-4 z-50 max-w-xs">
      <div className="bg-black/80 border-2 border-cyan-500 rounded-lg p-3 backdrop-blur-sm">
        <h3 className="text-cyan-400 text-xs font-bold font-mono mb-2 flex items-center gap-2">
          <span>💪</span>
          <span>POWER-UPS</span>
        </h3>
        
        <div className="space-y-1.5">
          {powerUps.map((powerUp, index) => {
            const info = POWERUP_INFO[powerUp.type];
            // vanish-options can only be used in battle, mega-heal anytime
            const canUse = !powerUp.used && (
              powerUp.type === 'mega-heal' || 
              (inBattle && ['shield', 'double-damage', 'vanish-options'].includes(powerUp.type))
            );
            
            return (
              <button
                key={`${powerUp.type}-${index}`}
                onClick={() => handleUsePowerUp(powerUp.type)}
                disabled={!canUse}
                className={`
                  w-full p-2 rounded border transition-all
                  ${powerUp.used 
                    ? 'bg-gray-800/50 border-gray-600 opacity-40 cursor-not-allowed' 
                    : info.color === 'cyan' ? 'bg-cyan-900/30 border-cyan-500 hover:bg-cyan-800/50 hover:scale-105 cursor-pointer'
                    : info.color === 'red' ? 'bg-red-900/30 border-red-500 hover:bg-red-800/50 hover:scale-105 cursor-pointer'
                    : info.color === 'blue' ? 'bg-blue-900/30 border-blue-500 hover:bg-blue-800/50 hover:scale-105 cursor-pointer'
                    : 'bg-green-900/30 border-green-500 hover:bg-green-800/50 hover:scale-105 cursor-pointer'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{info.icon}</span>
                  <div className="flex-1 text-left min-w-0">
                    <div className={`text-xs font-bold font-mono truncate ${
                      powerUp.used ? 'text-gray-500' 
                      : info.color === 'cyan' ? 'text-cyan-400'
                      : info.color === 'red' ? 'text-red-400'
                      : info.color === 'blue' ? 'text-blue-400'
                      : 'text-green-400'
                    }`}>
                      {info.name}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono truncate">
                      {info.description}
                    </div>
                  </div>
                  {powerUp.used && (
                    <span className="text-[10px] text-red-500 font-bold font-mono">USED</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-2 text-[10px] text-gray-400 font-mono text-center">
          Click to use • Defeat bosses for more
        </div>
      </div>
    </div>
  );
}
