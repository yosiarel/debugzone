// 🎯 DEBUGZONE: GAME STATE MANAGEMENT
// Zustand store - The brain of our cyber arena

import { create } from 'zustand';
import { GameState, EnemyState, QuizQuestion } from '@/types/game';
import { quizBank } from '@/lib/quizBank';

export const useGameStore = create<GameState>((set, get) => ({
  // Initial Player State
  player: {
    health: 100,
    maxHealth: 100,
    position: [0, 1, 5],
    isLocked: false,
  },

  // Initial Enemies (Will be populated)
  enemies: [
    {
      id: 'glitch-001',
      health: 50,
      maxHealth: 50,
      position: [10, 0.5, 10],
      isDefeated: false,
      type: 'glitch',
    },
    {
      id: 'bug-002',
      health: 75,
      maxHealth: 75,
      position: [-12, 0.5, 15],
      isDefeated: false,
      type: 'bug',
    },
    {
      id: 'virus-003',
      health: 100,
      maxHealth: 100,
      position: [0, 0.5, -20],
      isDefeated: false,
      type: 'virus',
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

  // 🔥 ACTIONS

  setPlayerPosition: (position: [number, number, number]) => {
    set((state) => ({
      player: { ...state.player, position },
    }));
  },

  damagePlayer: (amount: number) => {
    set((state) => {
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
    const question = quizBank[Math.floor(Math.random() * quizBank.length)];
    set({
      inBattle: true,
      currentEnemy: enemyId,
      currentQuestion: question,
      player: { ...get().player, isLocked: true },
    });
  },

  endBattle: () => {
    set({
      inBattle: false,
      currentEnemy: null,
      currentQuestion: null,
      player: { ...get().player, isLocked: false },
    });
  },

  answerQuestion: (isCorrect: boolean) => {
    const state = get();
    if (!state.currentEnemy) return;

    if (isCorrect) {
      // Critical Hit ke Enemy
      state.damageEnemy(state.currentEnemy, 25);
    } else {
      // Firewall pemain ditembus
      state.damagePlayer(15);
    }

    // Load next question atau end battle
    const enemy = state.enemies.find((e) => e.id === state.currentEnemy);
    if (enemy && enemy.health > 0 && state.player.health > 0) {
      // Continue battle dengan soal baru
      const newQuestion = quizBank[Math.floor(Math.random() * quizBank.length)];
      set({ currentQuestion: newQuestion });
    } else {
      // Battle selesai
      state.endBattle();
    }
  },

  resetGame: () => {
    set({
      player: {
        health: 100,
        maxHealth: 100,
        position: [0, 1, 5],
        isLocked: false,
      },
      enemies: [
        {
          id: 'glitch-001',
          health: 50,
          maxHealth: 50,
          position: [10, 0.5, 10],
          isDefeated: false,
          type: 'glitch',
        },
        {
          id: 'bug-002',
          health: 75,
          maxHealth: 75,
          position: [-12, 0.5, 15],
          isDefeated: false,
          type: 'bug',
        },
        {
          id: 'virus-003',
          health: 100,
          maxHealth: 100,
          position: [0, 0.5, -20],
          isDefeated: false,
          type: 'virus',
        },
      ],
      inBattle: false,
      currentEnemy: null,
      currentQuestion: null,
      score: 0,
      enemiesDefeated: 0,
      isChampion: false,
    });
  },
}));
