import { Machine } from '../types/game.types';

export const MACHINES: Record<string, Machine> = {
  ore_extractor: {
    id: 'ore_extractor',
    name: 'Ore Extractor',
    description: 'Automatically mines iron ore',
    cost: 100,
    recipeId: 'mine_ore',
    productionTime: 5000, // 5 seconds per ore
    unlockRequirement: {
      type: 'cash',
      value: 0, // Available from start
    },
  },
  auto_smelter: {
    id: 'auto_smelter',
    name: 'Auto-Smelter',
    description: 'Automatically smelts ore into ingots',
    cost: 250,
    recipeId: 'smelt_ingot',
    productionTime: 8000, // 8 seconds per ingot
    unlockRequirement: {
      type: 'cash',
      value: 100, // Unlock after buying first machine
    },
  },
  screw_machine: {
    id: 'screw_machine',
    name: 'Screw Machine',
    description: 'Automatically crafts screws from ingots',
    cost: 500,
    recipeId: 'craft_screw',
    productionTime: 10000, // 10 seconds per screw
    unlockRequirement: {
      type: 'cash',
      value: 250, // Unlock after some progression
    },
  },
};
