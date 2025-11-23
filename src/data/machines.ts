import { Machine } from '../types/game.types';

export const MACHINES: Record<string, Machine> = {
  // STEEL PATH MACHINES
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
  coal_miner: {
    id: 'coal_miner',
    name: 'Coal Miner',
    description: 'Automatically mines coal',
    cost: 120,
    recipeId: 'mine_coal',
    productionTime: 6000, // 6 seconds per coal
    unlockRequirement: {
      type: 'cash',
      value: 0,
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
  steel_forge: {
    id: 'steel_forge',
    name: 'Steel Forge',
    description: 'Automatically forges steel bars',
    cost: 600,
    recipeId: 'forge_steel',
    productionTime: 9000,
    unlockRequirement: {
      type: 'cash',
      value: 400,
    },
  },

  // WOOD PATH MACHINES
  wood_logger: {
    id: 'wood_logger',
    name: 'Automated Logger',
    description: 'Automatically chops wood',
    cost: 100,
    recipeId: 'chop_wood',
    productionTime: 5000, // 5 seconds per wood
    unlockRequirement: {
      type: 'cash',
      value: 0,
    },
  },
  sand_gatherer: {
    id: 'sand_gatherer',
    name: 'Sand Gatherer',
    description: 'Automatically gathers sand',
    cost: 80,
    recipeId: 'gather_sand',
    productionTime: 4000, // 4 seconds per sand
    unlockRequirement: {
      type: 'cash',
      value: 0,
    },
  },
  plank_cutter: {
    id: 'plank_cutter',
    name: 'Plank Cutter',
    description: 'Automatically cuts wood into planks',
    cost: 200,
    recipeId: 'cut_wood_plank',
    productionTime: 7000, // 7 seconds per plank
    unlockRequirement: {
      type: 'cash',
      value: 100,
    },
  },
  glass_furnace: {
    id: 'glass_furnace',
    name: 'Glass Furnace',
    description: 'Automatically produces glass panes',
    cost: 350,
    recipeId: 'make_glass',
    productionTime: 8500,
    unlockRequirement: {
      type: 'cash',
      value: 250,
    },
  },
};
