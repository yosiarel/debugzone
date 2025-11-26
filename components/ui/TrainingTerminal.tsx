// 🎓 DEBUGZONE: TRAINING TERMINAL
// Practice mode for learning before battle

'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { quizBank } from '@/lib/quizBank';
import { QuizQuestion } from '@/types/game';

export function TrainingTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const playerPosition = useGameStore((state) => state.player.position);
  const inBattle = useGameStore((state) => state.inBattle);

  // Training terminal position (corner of main room)
  const terminalPosition = [-12, 0, -12];

  // Check distance to terminal
  useEffect(() => {
    if (inBattle) {
      setShowPrompt(false);
      return;
    }

    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - terminalPosition[0], 2) +
      Math.pow(playerPosition[2] - terminalPosition[2], 2)
    );

    setShowPrompt(distance < 4 && !isOpen);
  }, [playerPosition, isOpen, inBattle]);

  const startPractice = () => {
    const randomQuestion = quizBank[Math.floor(Math.random() * quizBank.length)];
    setCurrentQuestion(randomQuestion);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsOpen(true);
  };

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const isCorrect = index === currentQuestion?.correctAnswer;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextQuestion = () => {
    startPractice();
  };

  const handleExit = () => {
    setIsOpen(false);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  // Interaction prompt (near terminal)
  if (showPrompt && !isOpen) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="bg-black/90 border-2 border-cyan-500 rounded-lg p-6 backdrop-blur-sm shadow-2xl shadow-cyan-500/50">
          <div className="text-center space-y-4">
            <div className="text-4xl">🎓</div>
            <h3 className="text-cyan-400 font-mono font-bold text-xl">TRAINING TERMINAL</h3>
            <p className="text-cyan-300 font-mono text-sm">
              Practice coding challenges without risk!
            </p>
            <div className="flex gap-3">
              <button
                onClick={startPractice}
                className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold rounded-lg transition-all"
              >
                Start Training
              </button>
            </div>
            <p className="text-cyan-400/60 font-mono text-xs">
              Press to start • Walk away to cancel
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl mx-4 bg-linear-to-br from-gray-900 to-black border-2 border-blue-500 rounded-lg shadow-2xl shadow-blue-500/50 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-900 to-cyan-900 p-4 border-b-2 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-blue-300 text-xl font-bold font-mono">🎓 TRAINING MODE</h2>
              <div className="text-blue-400 text-sm font-mono mt-1">
                Practice makes perfect! No risk, all learning.
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-400 text-sm font-mono">
                Score: <span className="text-cyan-300 font-bold">{score.correct}/{score.total}</span>
              </div>
              <div className="text-xs text-blue-300 font-mono">
                {score.total > 0 ? `${Math.round((score.correct / score.total) * 100)}% accuracy` : 'Start practicing!'}
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="p-6">
            <div className="bg-black/50 border border-blue-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-cyan-300 text-lg font-mono">{currentQuestion.question}</h3>
                <span className="px-2 py-1 bg-blue-900/50 border border-blue-500 rounded text-xs font-mono text-blue-400">
                  {currentQuestion.difficulty}
                </span>
              </div>
              
              {currentQuestion.code && (
                <div className="bg-gray-950 border border-cyan-500/50 rounded p-4 mt-3">
                  <pre className="text-cyan-300 font-mono text-sm overflow-x-auto">
                    <code>{currentQuestion.code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showResult = showExplanation;
                
                let buttonClass = 'bg-gray-800/50 border-gray-600 hover:border-blue-500 hover:bg-blue-900/30';
                
                if (showResult) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-900/30 border-green-500';
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-red-900/30 border-red-500';
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left font-mono ${buttonClass} ${
                      showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                        showResult && isCorrect ? 'bg-green-500 border-green-400 text-white' :
                        showResult && isSelected && !isCorrect ? 'bg-red-500 border-red-400 text-white' :
                        'border-blue-400 text-blue-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className={`flex-1 ${
                        showResult && isCorrect ? 'text-green-300 font-bold' :
                        showResult && isSelected && !isCorrect ? 'text-red-300' :
                        'text-blue-200'
                      }`}>
                        {option}
                      </span>
                      {showResult && isCorrect && <span className="text-2xl">✓</span>}
                      {showResult && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`p-4 rounded-lg border-2 mb-4 ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? 'bg-green-900/20 border-green-500'
                  : 'bg-red-900/20 border-red-500'
              }`}>
                <h4 className={`font-bold font-mono mb-2 ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Wrong Answer'}
                </h4>
                <p className="text-cyan-200 font-mono text-sm">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {showExplanation && (
                <button
                  onClick={nextQuestion}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold rounded-lg transition-all"
                >
                  Next Question →
                </button>
              )}
              <button
                onClick={handleExit}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-mono font-bold rounded-lg transition-all"
              >
                {showExplanation ? 'Exit Training' : 'Stop Training'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
