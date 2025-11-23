import { Item } from '../types/game.types';

export const ITEMS: Record<string, Item> = {
  ore: {
    id: 'ore',
    name: 'Iron Ore',
    description: 'Raw iron ore extracted from the ground',
    basePrice: 1,
    tier: 1,
    productionTime: 1000, // 1 second to mine
  },
  ingot: {
    id: 'ingot',
    name: 'Iron Ingot',
    description: 'Smelted iron ingot',
    basePrice: 3,
    tier: 2,
    productionTime: 2000, // 2 seconds to smelt
  },
  screw: {
    id: 'screw',
    name: 'Screw',
    description: 'Metal screw for assembly',
    basePrice: 5,
    tier: 3,
    productionTime: 3000, // 3 seconds to shape
  },
};
