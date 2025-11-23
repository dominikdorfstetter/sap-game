import { Recipe } from '../types/game.types';

export const RECIPES: Record<string, Recipe> = {
  // Tier 1 - Raw Materials
  mine_ore: {
    id: 'mine_ore',
    name: 'Mine Iron Ore',
    inputs: [],
    output: { itemId: 'ore', amount: 1 },
    productionTime: 1000,
    unlocked: true,
  },

  // Tier 2 - Basic Materials
  smelt_ingot: {
    id: 'smelt_ingot',
    name: 'Smelt Iron Ingot',
    inputs: [{ itemId: 'ore', amount: 1 }],
    output: { itemId: 'ingot', amount: 1 },
    productionTime: 2000,
    unlocked: true,
  },

  // Tier 3 - Simple Components
  craft_screw: {
    id: 'craft_screw',
    name: 'Craft Screw',
    inputs: [{ itemId: 'ingot', amount: 1 }],
    output: { itemId: 'screw', amount: 1 },
    productionTime: 3000,
    unlocked: true,
  },
  craft_plate: {
    id: 'craft_plate',
    name: 'Forge Metal Plate',
    inputs: [{ itemId: 'ingot', amount: 2 }],
    output: { itemId: 'plate', amount: 1 },
    productionTime: 3500,
    unlocked: false,
  },
  craft_wire: {
    id: 'craft_wire',
    name: 'Draw Wire',
    inputs: [{ itemId: 'ingot', amount: 1 }],
    output: { itemId: 'wire', amount: 2 },
    productionTime: 2500,
    unlocked: false,
  },

  // Tier 4 - Components
  craft_bracket: {
    id: 'craft_bracket',
    name: 'Assemble Bracket',
    inputs: [
      { itemId: 'plate', amount: 1 },
      { itemId: 'screw', amount: 2 },
    ],
    output: { itemId: 'bracket', amount: 1 },
    productionTime: 4000,
    unlocked: false,
  },
  craft_hinge: {
    id: 'craft_hinge',
    name: 'Assemble Hinge',
    inputs: [
      { itemId: 'plate', amount: 2 },
      { itemId: 'screw', amount: 3 },
    ],
    output: { itemId: 'hinge', amount: 1 },
    productionTime: 4500,
    unlocked: false,
  },
  craft_spring: {
    id: 'craft_spring',
    name: 'Coil Spring',
    inputs: [{ itemId: 'wire', amount: 5 }],
    output: { itemId: 'spring', amount: 1 },
    productionTime: 3500,
    unlocked: false,
  },

  // Tier 5 - Assemblies
  craft_door: {
    id: 'craft_door',
    name: 'Assemble Door',
    inputs: [
      { itemId: 'plate', amount: 4 },
      { itemId: 'hinge', amount: 2 },
      { itemId: 'bracket', amount: 2 },
    ],
    output: { itemId: 'door', amount: 1 },
    productionTime: 6000,
    unlocked: false,
  },
  craft_cabinet: {
    id: 'craft_cabinet',
    name: 'Assemble Cabinet',
    inputs: [
      { itemId: 'plate', amount: 6 },
      { itemId: 'door', amount: 2 },
      { itemId: 'bracket', amount: 4 },
      { itemId: 'screw', amount: 10 },
    ],
    output: { itemId: 'cabinet', amount: 1 },
    productionTime: 7000,
    unlocked: false,
  },
  craft_toolbox: {
    id: 'craft_toolbox',
    name: 'Assemble Toolbox',
    inputs: [
      { itemId: 'plate', amount: 3 },
      { itemId: 'hinge', amount: 1 },
      { itemId: 'bracket', amount: 2 },
    ],
    output: { itemId: 'toolbox', amount: 1 },
    productionTime: 6500,
    unlocked: false,
  },

  // Tier 6 - Advanced Products
  craft_machinery: {
    id: 'craft_machinery',
    name: 'Manufacture Machinery',
    inputs: [
      { itemId: 'plate', amount: 10 },
      { itemId: 'spring', amount: 8 },
      { itemId: 'bracket', amount: 6 },
      { itemId: 'screw', amount: 20 },
    ],
    output: { itemId: 'machinery', amount: 1 },
    productionTime: 10000,
    unlocked: false,
  },
  craft_vehicle: {
    id: 'craft_vehicle',
    name: 'Assemble Vehicle Frame',
    inputs: [
      { itemId: 'plate', amount: 20 },
      { itemId: 'bracket', amount: 12 },
      { itemId: 'spring', amount: 6 },
      { itemId: 'screw', amount: 30 },
    ],
    output: { itemId: 'vehicle', amount: 1 },
    productionTime: 12000,
    unlocked: false,
  },
};
