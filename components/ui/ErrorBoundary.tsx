// 🔧 DEBUGZONE: ERROR BOUNDARY
// Client-side error handling

'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('3D Scene Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black">
          <div className="text-center space-y-4 max-w-2xl mx-4">
            <h1 className="text-4xl font-bold text-red-500 font-mono">⚠️ SYSTEM ERROR</h1>
            <p className="text-cyan-300 font-mono">
              Failed to initialize 3D environment. Please refresh the page.
            </p>
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-left">
              <p className="text-red-300 font-mono text-sm">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono font-bold rounded-lg"
            >
              🔄 RELOAD PAGE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
