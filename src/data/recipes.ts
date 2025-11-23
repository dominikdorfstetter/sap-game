import { Recipe } from '../types/game.types';

export const RECIPES: Record<string, Recipe> = {
  mine_ore: {
    id: 'mine_ore',
    name: 'Mine Iron Ore',
    input: null, // No input needed
    output: { itemId: 'ore', amount: 1 },
    productionTime: 1000,
  },
  smelt_ingot: {
    id: 'smelt_ingot',
    name: 'Smelt Iron Ingot',
    input: { itemId: 'ore', amount: 1 },
    output: { itemId: 'ingot', amount: 1 },
    productionTime: 2000,
  },
  craft_screw: {
    id: 'craft_screw',
    name: 'Craft Screw',
    input: { itemId: 'ingot', amount: 1 },
    output: { itemId: 'screw', amount: 1 },
    productionTime: 3000,
  },
};
