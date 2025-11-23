import { GameState, CompanyType } from '../types/game.types';
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
      loadedState.unlockedRecipes = ['mine_ore', 'chop_wood', 'mine_coal', 'smelt_ingot', 'cut_wood_plank', 'craft_screw'];
    } else {
      // Add new recipes to existing saves
      const newRecipes = ['chop_wood', 'mine_coal', 'cut_wood_plank'];
      for (const recipeId of newRecipes) {
        if (!loadedState.unlockedRecipes.includes(recipeId)) {
          loadedState.unlockedRecipes.push(recipeId);
        }
      }
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

    // Migrate scouting state
    if (!loadedState.scouting) {
      loadedState.scouting = null;
    }

    // Migrate company type (default to steel for old saves)
    if (!loadedState.company.type) {
      loadedState.company.type = 'steel';
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

export function createNewGame(companyName: string, companyType: CompanyType = 'steel'): GameState {
  const inventory: { [key: string]: number } = {};
  for (const itemId of Object.keys(ITEMS)) {
    inventory[itemId] = 0;
  }

  // Different starting paths based on company type
  const woodPath = {
    unlockedMachines: ['wood_logger', 'sand_gatherer'],
    unlockedRecipes: ['chop_wood', 'gather_sand', 'cut_wood_plank', 'make_glass', 'craft_nail'],
  };

  const steelPath = {
    unlockedMachines: ['ore_extractor', 'coal_miner'],
    unlockedRecipes: ['mine_ore', 'mine_coal', 'smelt_ingot', 'forge_steel', 'craft_screw', 'craft_plate', 'craft_wire'],
  };

  const pathConfig = companyType === 'wood' ? woodPath : steelPath;

  return {
    company: {
      name: companyName,
      founded: Date.now(),
      cash: 0,
      type: companyType,
    },
    inventory,
    machines: [],
    unlockedMachines: pathConfig.unlockedMachines,
    upgrades: {},
    market: initializeMarket(),
    unlockedRecipes: pathConfig.unlockedRecipes,
    staff: [],
    research: {
      current: null,
      completed: [],
    },
    fiscal: createInitialFiscalState(),
    preferences: {
      pinnedWidgets: ['quickActions', 'inventory'],
    },
    scouting: null,
    lastTick: Date.now(),
    lastSalaryPayment: Date.now(),
    initialized: true,
  };
}
