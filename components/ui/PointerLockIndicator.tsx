// 🎯 DEBUGZONE: CONTROLS INDICATOR
// Shows controls status for Third Person mode

'use client';

import { useEffect, useState } from 'react';

export function PointerLockIndicator() {
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    // Hide hint after first interaction
    const handleInteraction = () => {
      setShowHint(false);
    };

    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000); // Auto-hide after 3 seconds

    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('mousedown', handleInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('mousedown', handleInteraction);
    };
  }, []);

  return (
    <>
      {/* Third Person Crosshair (Always visible) */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
        <div className="relative w-8 h-8">
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400 opacity-50 transform -translate-y-1/2"></div>
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-cyan-400 opacity-50 transform -translate-x-1/2"></div>
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Initial Controls Hint */}
      {showHint && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 translate-y-20 pointer-events-none z-40">
          <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-4 animate-pulse">
            <p className="text-cyan-300 font-mono text-sm text-center">
              🎮 Use <span className="text-cyan-400 font-bold">WASD</span> to move • <span className="text-cyan-400 font-bold">MOUSE</span> to rotate camera
            </p>
          </div>
        </div>
      )}
    </>
  );
}
