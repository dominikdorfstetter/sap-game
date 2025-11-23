import { GameState } from '../types/game.types';
import { initializeMarket } from './marketSystem';
import { createInitialFiscalState } from './fiscalSystem';
import { ITEMS } from '../data/items';

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

    const loadedState = JSON.parse(saveData) as any;

    // Migrate old saves that don't have new fields
    if (!loadedState.machines) {
      loadedState.machines = [];
    }
    if (!loadedState.unlockedMachines) {
      loadedState.unlockedMachines = ['ore_extractor'];
    }
    if (!loadedState.upgrades) {
      loadedState.upgrades = {};
    }
    if (!loadedState.market) {
      loadedState.market = initializeMarket();
    }
    if (!loadedState.unlockedRecipes) {
      loadedState.unlockedRecipes = ['mine_ore', 'smelt_ingot', 'craft_screw'];
    }

    // Ensure all new items exist in inventory
    for (const itemId of Object.keys(ITEMS)) {
      if (loadedState.inventory[itemId] === undefined) {
        loadedState.inventory[itemId] = 0;
      }
    }

    // Migrate preferences
    if (!loadedState.preferences) {
      loadedState.preferences = {
        pinnedWidgets: ['quickActions', 'inventory'],
      };
    }

    // Migrate staff and research
    if (!loadedState.staff) {
      loadedState.staff = [];
    }
    if (!loadedState.research) {
      loadedState.research = {
        current: null,
        completed: [],
      };
    }
    if (!loadedState.lastSalaryPayment) {
      loadedState.lastSalaryPayment = Date.now();
    }

    // Migrate fiscal state
    if (!loadedState.fiscal) {
      loadedState.fiscal = createInitialFiscalState();
    }

    return loadedState as GameState;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function createNewGame(companyName: string): GameState {
  const inventory: { [key: string]: number } = {};
  for (const itemId of Object.keys(ITEMS)) {
    inventory[itemId] = 0;
  }

  return {
    company: {
      name: companyName,
      founded: Date.now(),
      cash: 0,
    },
    inventory,
    machines: [],
    unlockedMachines: ['ore_extractor'],
    upgrades: {},
    market: initializeMarket(),
    unlockedRecipes: ['mine_ore', 'smelt_ingot', 'craft_screw'],
    staff: [],
    research: {
      current: null,
      completed: [],
    },
    fiscal: createInitialFiscalState(),
    preferences: {
      pinnedWidgets: ['quickActions', 'inventory'],
    },
    lastTick: Date.now(),
    lastSalaryPayment: Date.now(),
    initialized: true,
  };
}
