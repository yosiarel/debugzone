// 🎯 DEBUGZONE: GAME STATE MANAGEMENT
// Zustand store - The brain of our cyber arena

import { create } from 'zustand';
import { GameState, EnemyState, QuizQuestion } from '@/types/game';
import { 
  quizBank, 
  timeAttackQuestions, 
  fillBlankQuestions, 
  speedQuizQuestions, 
  codeDebugQuestions 
} from '@/lib/quizBank';
import { audioManager } from '@/lib/audioManager';

export const useGameStore = create<GameState>((set, get) => ({
  // Initial Player State
  player: {
    health: 100,
    maxHealth: 100,
    position: [0, 1, 0],
    isLocked: false,
  },

  // Initial Enemies (Spread across different rooms)
  enemies: [
    // Server Room (North) - Boss + Enemies
    {
      id: 'boss-server',
      health: 100,
      maxHealth: 100,
      position: [0, 0.5, -56],
      isDefeated: false,
      type: 'virus',
      isBoss: true,
      challengeType: 'time-attack',
      powerUp: 'vanish-options',
    },
    {
      id: 'server-enemy-1',
      health: 50,
      maxHealth: 50,
      position: [-8, 0.5, -52],
      isDefeated: false,
      type: 'glitch',
    },
    {
      id: 'server-enemy-2',
      health: 50,
      maxHealth: 50,
      position: [8, 0.5, -60],
      isDefeated: false,
      type: 'bug',
    },
    
    // Weapon Room (South) - Boss + Enemies
    {
      id: 'boss-weapon',
      health: 100,
      maxHealth: 100,
      position: [0, 0.5, 50],
      isDefeated: false,
      type: 'bug',
      isBoss: true,
      challengeType: 'fill-blank',
      powerUp: 'double-damage',
    },
    {
      id: 'weapon-enemy-1',
      health: 50,
      maxHealth: 50,
      position: [-10, 0.5, 54],
      isDefeated: false,
      type: 'virus',
    },
    {
      id: 'weapon-enemy-2',
      health: 50,
      maxHealth: 50,
      position: [10, 0.5, 46],
      isDefeated: false,
      type: 'glitch',
    },
    
    // Storage Room (West) - Boss + Enemies
    {
      id: 'boss-storage',
      health: 100,
      maxHealth: 100,
      position: [-56, 0.5, 0],
      isDefeated: false,
      type: 'glitch',
      isBoss: true,
      challengeType: 'speed-quiz',
      powerUp: 'shield',
    },
    {
      id: 'storage-enemy-1',
      health: 50,
      maxHealth: 50,
      position: [-60, 0.5, -8],
      isDefeated: false,
      type: 'bug',
    },
    {
      id: 'storage-enemy-2',
      health: 50,
      maxHealth: 50,
      position: [-52, 0.5, 8],
      isDefeated: false,
      type: 'virus',
    },
    
    // Boss Room (East) - Final Boss + Elite Enemies
    {
      id: 'boss-final',
      health: 150,
      maxHealth: 150,
      position: [64, 0.5, 0],
      isDefeated: false,
      type: 'virus',
      isBoss: true,
      challengeType: 'code-debug',
      powerUp: 'mega-heal',
    },
    {
      id: 'final-enemy-1',
      health: 75,
      maxHealth: 75,
      position: [56, 0.5, -8],
      isDefeated: false,
      type: 'glitch',
    },
    {
      id: 'final-enemy-2',
      health: 75,
      maxHealth: 75,
      position: [72, 0.5, 8],
      isDefeated: false,
      type: 'bug',
    },
  ],

  // Combat State
  inBattle: false,
  currentEnemy: null,
  currentQuestion: null,

  // Progress
  score: 0,
  enemiesDefeated: 0,
  isChampion: false,

  // Power-ups
  powerUps: [],
  activeShield: false,
  activeDoubleDamage: false,

  // 🔥 ACTIONS

  setPlayerPosition: (position: [number, number, number]) => {
    set((state) => ({
      player: { ...state.player, position },
    }));
  },

  damagePlayer: (amount: number) => {
    set((state) => {
      // Check if shield is active
      if (state.activeShield) {
        console.log('🛡️ SHIELD BLOCKED DAMAGE!');
        // Shield absorbs damage, mark as used and deactivate
        const updatedPowerUps = state.powerUps.map(p => 
          p.type === 'shield' && !p.used ? { ...p, used: true } : p
        );
        return {
          activeShield: false,
          powerUps: updatedPowerUps,
        };
      }
      
      const newHealth = Math.max(0, state.player.health - amount);
      return {
        player: { ...state.player, health: newHealth },
      };
    });
  },

  damageEnemy: (enemyId: string, amount: number) => {
    set((state) => {
      const enemies = state.enemies.map((enemy) => {
        if (enemy.id === enemyId) {
          const newHealth = Math.max(0, enemy.health - amount);
          return {
            ...enemy,
            health: newHealth,
            isDefeated: newHealth <= 0,
          };
        }
        return enemy;
      });

      // Check if enemy defeated
      const defeatedEnemy = enemies.find((e) => e.id === enemyId && e.isDefeated);
      const totalDefeated = enemies.filter((e) => e.isDefeated).length;
      const isChampion = totalDefeated === enemies.length;

      // Restore health when enemy defeated
      let newPlayerHealth = state.player.health;
      if (defeatedEnemy) {
        newPlayerHealth = Math.min(state.player.maxHealth, state.player.health + 25);
      }

      return {
        player: { ...state.player, health: newPlayerHealth },
        enemies,
        enemiesDefeated: totalDefeated,
        isChampion,
        score: state.score + (defeatedEnemy ? 100 : 0),
      };
    });
  },

  startBattle: (enemyId: string) => {
    const state = get();
    const enemy = state.enemies.find((e) => e.id === enemyId);
    
    // Debug log - pastikan HP musuh tidak di-reset saat re-engage
    console.log('⚔️ STARTING BATTLE:', {
      enemyId,
      enemyHP: enemy?.health,
      enemyMaxHP: enemy?.maxHealth,
      isDefeated: enemy?.isDefeated,
    });
    
    // Play battle music
    audioManager.playBattle();
    
    // Select question bank based on boss challenge type
    let questionBank = quizBank;
    if (enemy?.isBoss && enemy.challengeType) {
      switch (enemy.challengeType) {
        case 'time-attack':
          questionBank = timeAttackQuestions;
          break;
        case 'fill-blank':
          questionBank = fillBlankQuestions;
          break;
        case 'speed-quiz':
          questionBank = speedQuizQuestions;
          break;
        case 'code-debug':
          questionBank = codeDebugQuestions;
          break;
      }
    }
    
    const question = questionBank[Math.floor(Math.random() * questionBank.length)];
    set({
      inBattle: true,
      currentEnemy: enemyId,
      currentQuestion: question,
      player: { ...get().player, isLocked: true },
    });
  },

  endBattle: () => {
    // Return to exploration music
    audioManager.playExplore();
    
    set({
      inBattle: false,
      currentEnemy: null,
      currentQuestion: null,
      player: { ...get().player, isLocked: false },
    });
  },

  fleeBattle: () => {
    const state = get();
    const currentEnemyData = state.enemies.find(e => e.id === state.currentEnemy);
    
    // Debug log - pastikan HP musuh tidak berubah
    console.log('🏃 FLEEING BATTLE:', {
      enemyId: state.currentEnemy,
      enemyHP: currentEnemyData?.health,
      enemyMaxHP: currentEnemyData?.maxHealth,
      playerHP: state.player.health,
    });
    
    // Apply penalty: -50 HP (karena kabur/nyerah)
    const newPlayerHealth = Math.max(0, state.player.health - 50);
    
    // Return to exploration music
    audioManager.playExplore();
    
    // IMPORTANT: When fleeing, we DON'T reset enemy HP
    // The enemy's current health is already saved in the enemies array
    // We just end the battle state and reduce player HP as penalty
    
    set({
      inBattle: false,
      currentEnemy: null,
      currentQuestion: null,
      player: { ...state.player, health: newPlayerHealth, isLocked: false },
    });
  },

  answerQuestion: (isCorrect: boolean) => {
    const state = get();
    if (!state.currentEnemy) return;

    if (isCorrect) {
      // Critical Hit ke Enemy - check for double damage
      const damage = state.activeDoubleDamage ? 50 : 25;
      if (state.activeDoubleDamage) {
        console.log('⚔️ DOUBLE DAMAGE ACTIVATED!');
        // Mark double-damage as used and deactivate
        const updatedPowerUps = state.powerUps.map(p => 
          p.type === 'double-damage' && !p.used ? { ...p, used: true } : p
        );
        set({ 
          activeDoubleDamage: false,
          powerUps: updatedPowerUps,
        });
      }
      state.damageEnemy(state.currentEnemy, damage);
    } else {
      // Firewall pemain ditembus
      state.damagePlayer(15);
    }

    // Get fresh state after damage
    const freshState = get();
    
    // Load next question atau end battle
    const enemy = freshState.enemies.find((e) => e.id === freshState.currentEnemy);
    if (enemy && enemy.health > 0 && freshState.player.health > 0) {
      // Continue battle dengan soal baru - use appropriate question bank
      let questionBank = quizBank;
      if (enemy.isBoss && enemy.challengeType) {
        switch (enemy.challengeType) {
          case 'time-attack':
            questionBank = timeAttackQuestions;
            break;
          case 'fill-blank':
            questionBank = fillBlankQuestions;
            break;
          case 'speed-quiz':
            questionBank = speedQuizQuestions;
            break;
          case 'code-debug':
            questionBank = codeDebugQuestions;
            break;
        }
      }
      
      // Pastikan pertanyaan baru berbeda dari yang sekarang
      let newQuestion = questionBank[Math.floor(Math.random() * questionBank.length)];
      let attempts = 0;
      while (newQuestion.question === freshState.currentQuestion?.question && attempts < 10) {
        newQuestion = questionBank[Math.floor(Math.random() * questionBank.length)];
        attempts++;
      }
      
      set({ currentQuestion: newQuestion });
    } else {
      // Battle selesai - Check if boss defeated for power-up
      if (enemy && enemy.isDefeated && enemy.isBoss && enemy.powerUp) {
        state.addPowerUp({
          type: enemy.powerUp,
          name: enemy.powerUp.toUpperCase(),
          description: `Power-up from ${enemy.id}`,
          used: false,
        });
      }
      state.endBattle();
    }
  },

  usePowerUp: (type) => {
    set((state) => {
      const powerUp = state.powerUps.find((p) => p.type === type && !p.used);
      if (!powerUp) return state;

      // Apply power-up effects
      let updates: any = {
        powerUps: state.powerUps.map((p) =>
          p.type === type && !p.used ? { ...p, used: true } : p
        ),
      };

      switch (type) {
        case 'shield':
          // Shield absorbs next damage
          updates.activeShield = true;
          console.log('🛡️ SHIELD ACTIVATED!');
          break;
        case 'double-damage':
          // Next attack deals 2x damage
          updates.activeDoubleDamage = true;
          console.log('⚔️ DOUBLE DAMAGE READY!');
          break;
        case 'vanish-options':
          // Remove 2 wrong answers from current question
          break;
        case 'mega-heal':
          updates.player = {
            ...state.player,
            health: Math.min(state.player.maxHealth, state.player.health + 50),
          };
          break;
      }

      return updates;
    });
  },

  addPowerUp: (powerUp) => {
    set((state) => ({
      powerUps: [...state.powerUps, powerUp],
    }));
  },

  resetGame: () => {
    // Stop all audio and start exploration music
    audioManager.stopAll();
    audioManager.playExplore();
    
    set({
      player: {
        health: 100,
        maxHealth: 100,
        position: [0, 1, 0],
        isLocked: false,
      },
      enemies: [
        { id: 'boss-server', health: 100, maxHealth: 100, position: [0, 0.5, -56], isDefeated: false, type: 'virus', isBoss: true, challengeType: 'time-attack', powerUp: 'vanish-options' },
        { id: 'server-enemy-1', health: 50, maxHealth: 50, position: [-8, 0.5, -52], isDefeated: false, type: 'glitch' },
        { id: 'server-enemy-2', health: 50, maxHealth: 50, position: [8, 0.5, -60], isDefeated: false, type: 'bug' },
        { id: 'boss-weapon', health: 100, maxHealth: 100, position: [0, 0.5, 50], isDefeated: false, type: 'bug', isBoss: true, challengeType: 'fill-blank', powerUp: 'double-damage' },
        { id: 'weapon-enemy-1', health: 50, maxHealth: 50, position: [-10, 0.5, 54], isDefeated: false, type: 'virus' },
        { id: 'weapon-enemy-2', health: 50, maxHealth: 50, position: [10, 0.5, 46], isDefeated: false, type: 'glitch' },
        { id: 'boss-storage', health: 100, maxHealth: 100, position: [-56, 0.5, 0], isDefeated: false, type: 'glitch', isBoss: true, challengeType: 'speed-quiz', powerUp: 'shield' },
        { id: 'storage-enemy-1', health: 50, maxHealth: 50, position: [-60, 0.5, -8], isDefeated: false, type: 'bug' },
        { id: 'storage-enemy-2', health: 50, maxHealth: 50, position: [-52, 0.5, 8], isDefeated: false, type: 'virus' },
        { id: 'boss-final', health: 150, maxHealth: 150, position: [64, 0.5, 0], isDefeated: false, type: 'virus', isBoss: true, challengeType: 'code-debug', powerUp: 'mega-heal' },
        { id: 'final-enemy-1', health: 75, maxHealth: 75, position: [56, 0.5, -8], isDefeated: false, type: 'glitch' },
        { id: 'final-enemy-2', health: 75, maxHealth: 75, position: [72, 0.5, 8], isDefeated: false, type: 'bug' },
      ],
      inBattle: false,
      currentEnemy: null,
      currentQuestion: null,
      score: 0,
      enemiesDefeated: 0,
      isChampion: false,
      powerUps: [],
      activeShield: false,
      activeDoubleDamage: false,
    });
  },
}));
