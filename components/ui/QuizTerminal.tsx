// 💻 DEBUGZONE: QUIZ TERMINAL
// Interactive coding challenge interface

'use client';

import { useGameStore } from '@/stores/gameStore';
import { useState, useEffect } from 'react';

export function QuizTerminal() {
  const inBattle = useGameStore((state) => state.inBattle);
  const currentQuestion = useGameStore((state) => state.currentQuestion);
  const currentEnemy = useGameStore((state) => state.currentEnemy);
  const answerQuestion = useGameStore((state) => state.answerQuestion);
  const enemies = useGameStore((state) => state.enemies);
  const playerHealth = useGameStore((state) => state.player.health);
  const playerMaxHealth = useGameStore((state) => state.player.maxHealth);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset state saat battle baru
    if (inBattle && currentQuestion) {
      setSelectedAnswer(null);
      setFeedback(null);
      setIsSubmitting(false);
    }
  }, [currentQuestion, inBattle]);

  if (!inBattle || !currentQuestion || !currentEnemy) return null;

  const enemy = enemies.find((e) => e.id === currentEnemy);

  const handleSubmit = () => {
    if (selectedAnswer === null || isSubmitting) return;

    setIsSubmitting(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      answerQuestion(isCorrect);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-3xl mx-4 bg-linear-to-br from-gray-900 to-black border-2 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/50 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-cyan-900 to-magenta-900 p-4 border-b-2 border-cyan-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-cyan-300 text-xl font-bold font-mono">⚔️ BATTLE MODE</h2>
              <div className="flex items-center gap-4 mt-2">
                {/* Player HP */}
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 text-sm font-mono">YOU:</span>
                  <div className="w-32 h-3 bg-gray-800 rounded-full overflow-hidden border border-cyan-500/50">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        playerHealth / playerMaxHealth > 0.5 
                          ? 'bg-linear-to-r from-cyan-500 to-cyan-400' 
                          : playerHealth / playerMaxHealth > 0.25 
                          ? 'bg-linear-to-r from-yellow-500 to-yellow-400'
                          : 'bg-linear-to-r from-red-500 to-red-400'
                      }`}
                      style={{ width: `${(playerHealth / playerMaxHealth) * 100}%` }}
                    />
                  </div>
                  <span className="text-cyan-300 text-xs font-mono font-bold">{playerHealth}/{playerMaxHealth}</span>
                </div>
                
                {/* Enemy HP */}
                <div className="flex items-center gap-2">
                  <span className="text-magenta-400 text-sm font-mono">{enemy?.type.toUpperCase()}:</span>
                  <div className="w-32 h-3 bg-gray-800 rounded-full overflow-hidden border border-magenta-500/50">
                    <div 
                      className="h-full bg-linear-to-r from-magenta-500 to-magenta-400 transition-all duration-300"
                      style={{ width: `${((enemy?.health || 0) / (enemy?.maxHealth || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-magenta-300 text-xs font-mono font-bold">{enemy?.health}/{enemy?.maxHealth}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-magenta-400 text-sm font-mono">
                Difficulty: <span className="text-magenta-300 font-bold">{currentQuestion.difficulty.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4 mb-4">
            <h3 className="text-cyan-300 text-lg font-mono mb-3">{currentQuestion.question}</h3>
            
            {currentQuestion.code && (
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto border border-green-500/30 font-mono text-sm">
                <code>{currentQuestion.code}</code>
              </pre>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !isSubmitting && setSelectedAnswer(index)}
                disabled={isSubmitting}
                className={`w-full text-left p-4 rounded-lg font-mono text-sm transition-all duration-200 ${
                  selectedAnswer === index
                    ? feedback === 'correct'
                      ? 'bg-green-900 border-2 border-green-500 text-green-300'
                      : feedback === 'wrong'
                      ? 'bg-red-900 border-2 border-red-500 text-red-300'
                      : 'bg-cyan-900 border-2 border-cyan-500 text-cyan-300'
                    : 'bg-gray-900 border border-cyan-500/30 text-gray-300 hover:bg-gray-800 hover:border-cyan-500/50'
                } ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <span className="text-cyan-500 font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-4 p-4 rounded-lg border-2 ${
                feedback === 'correct'
                  ? 'bg-green-900/50 border-green-500 text-green-300'
                  : 'bg-red-900/50 border-red-500 text-red-300'
              }`}
            >
              <p className="font-mono font-bold mb-2">
                {feedback === 'correct' ? '✅ CRITICAL HIT!' : '❌ FIREWALL BREACHED!'}
              </p>
              <p className="text-sm font-mono">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || isSubmitting}
            className={`w-full mt-6 py-4 rounded-lg font-mono font-bold text-lg transition-all duration-200 ${
              selectedAnswer !== null && !isSubmitting
                ? 'bg-linear-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500 text-white cursor-pointer shadow-lg shadow-cyan-500/50'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'PROCESSING...' : 'EXECUTE ATTACK'}
          </button>
        </div>
      </div>
    </div>
  );
}
