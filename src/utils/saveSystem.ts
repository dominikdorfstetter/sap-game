import { GameState } from '../types/game.types';

const SAVE_KEY = 'sap_production_game_save';

export function saveGame(state: GameState): void {
  try {
    const saveData = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, saveData);
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

export function loadGame(): GameState | null {
  try {
    const saveData = localStorage.getItem(SAVE_KEY);
    if (!saveData) return null;
    return JSON.parse(saveData) as GameState;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function createNewGame(companyName: string): GameState {
  return {
    company: {
      name: companyName,
      founded: Date.now(),
      cash: 0,
    },
    inventory: {
      ore: 0,
      ingot: 0,
      screw: 0,
    },
    lastTick: Date.now(),
    initialized: true,
  };
}
