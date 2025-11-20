// ⏳ DEBUGZONE: LOADING SCREEN
// Loading state with cyberpunk aesthetics

'use client';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold font-mono bg-linear-to-r from-cyan-400 via-magenta-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            DEBUGZONE
          </h1>
          <p className="text-xl text-cyan-300 font-mono">Initializing System...</p>
        </div>

        {/* Loading Bar */}
        <div className="w-96 mx-auto">
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-cyan-500 to-magenta-500 animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-cyan-400 font-mono text-sm space-y-2">
          <p className="animate-pulse">⚡ Loading Cyberverse...</p>
          <p className="animate-pulse" style={{ animationDelay: '0.2s' }}>
            🔧 Compiling Threats...
          </p>
          <p className="animate-pulse" style={{ animationDelay: '0.4s' }}>
            🎯 Preparing Challenges...
          </p>
        </div>
      </div>
    </div>
  );
}
