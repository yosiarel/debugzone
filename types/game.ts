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
  isBoss?: boolean;
  challengeType?: 'time-attack' | 'fill-blank' | 'speed-quiz' | 'code-debug';
  powerUp?: PowerUpType;
}

export type PowerUpType = 'shield' | 'double-damage' | 'time-freeze' | 'mega-heal';

export interface PowerUp {
  type: PowerUpType;
  name: string;
  description: string;
  used: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  code?: string; // Optional code snippet
  options: string[];
  correctAnswer: number; // Index of correct answer
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  challengeType?: 'time-attack' | 'fill-blank' | 'speed-quiz' | 'code-debug';
  timeLimit?: number; // For time-attack challenges (in seconds)
  blanks?: string[]; // For fill-blank challenges
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
  
  // Power-ups
  powerUps: PowerUp[];
  
  // Actions
  setPlayerPosition: (position: [number, number, number]) => void;
  damagePlayer: (amount: number) => void;
  damageEnemy: (enemyId: string, amount: number) => void;
  startBattle: (enemyId: string) => void;
  endBattle: () => void;
  fleeBattle: () => void;
  answerQuestion: (isCorrect: boolean) => void;
  usePowerUp: (type: PowerUpType) => void;
  addPowerUp: (powerUp: PowerUp) => void;
  resetGame: () => void;
}
