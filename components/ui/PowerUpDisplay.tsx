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
  'time-freeze': {
    icon: '⏸️',
    name: 'Time Freeze',
    description: 'Stop timer for 10s',
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
    <div className="fixed top-24 right-4 z-40">
      <div className="bg-black/80 border-2 border-cyan-500 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="text-cyan-400 text-sm font-bold font-mono mb-3 flex items-center gap-2">
          <span>💪</span>
          <span>POWER-UPS</span>
        </h3>
        
        <div className="space-y-2">
          {powerUps.map((powerUp, index) => {
            const info = POWERUP_INFO[powerUp.type];
            const canUse = !powerUp.used && (powerUp.type === 'mega-heal' || inBattle);
            
            return (
              <button
                key={`${powerUp.type}-${index}`}
                onClick={() => handleUsePowerUp(powerUp.type)}
                disabled={!canUse}
                className={`
                  w-full p-3 rounded-lg border-2 transition-all
                  ${powerUp.used 
                    ? 'bg-gray-800/50 border-gray-600 opacity-50 cursor-not-allowed' 
                    : `bg-${info.color}-900/30 border-${info.color}-500 hover:bg-${info.color}-800/50 hover:scale-105 cursor-pointer`
                  }
                  ${!canUse && !powerUp.used ? 'opacity-60 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{info.icon}</span>
                  <div className="flex-1 text-left">
                    <div className={`text-sm font-bold font-mono ${
                      powerUp.used ? 'text-gray-500' : `text-${info.color}-400`
                    }`}>
                      {info.name}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {info.description}
                    </div>
                  </div>
                  {powerUp.used && (
                    <span className="text-xs text-red-500 font-bold font-mono">USED</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-3 text-xs text-gray-400 font-mono text-center">
          Click to use • Defeat bosses for more
        </div>
      </div>
    </div>
  );
}
