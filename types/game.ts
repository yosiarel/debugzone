// 🎮 DEBUGZONE: TYPE DEFINITIONS
// Core type system untuk The Cyber Arena

export interface PlayerState {
  health: number;
  maxHealth: number;
  position: [number, number, number];
  isLocked: boolean; // Locked saat battle
}

export interface EnemyState {
  id: string;
  health: number;
  maxHealth: number;
  position: [number, number, number];
  isDefeated: boolean;
  type: 'glitch' | 'bug' | 'virus';
}

export interface QuizQuestion {
  id: string;
  question: string;
  code?: string; // Optional code snippet
  options: string[];
  correctAnswer: number; // Index of correct answer
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export interface GameState {
  // Player
  player: PlayerState;
  
  // Enemies
  enemies: EnemyState[];
  
  // Combat
  inBattle: boolean;
  currentEnemy: string | null;
  currentQuestion: QuizQuestion | null;
  
  // Game Progress
  score: number;
  enemiesDefeated: number;
  isChampion: boolean;
  
  // Actions
  setPlayerPosition: (position: [number, number, number]) => void;
  damagePlayer: (amount: number) => void;
  damageEnemy: (enemyId: string, amount: number) => void;
  startBattle: (enemyId: string) => void;
  endBattle: () => void;
  answerQuestion: (isCorrect: boolean) => void;
  resetGame: () => void;
}
