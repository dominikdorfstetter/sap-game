import { Item } from '../types/game.types';

export const ITEMS: Record<string, Item> = {
  // Tier 1 - Raw Materials
  ore: {
    id: 'ore',
    name: 'Iron Ore',
    description: 'Raw iron ore extracted from the ground',
    basePrice: 1,
    tier: 1,
    productionTime: 1000,
  },

  // Tier 2 - Basic Materials
  ingot: {
    id: 'ingot',
    name: 'Iron Ingot',
    description: 'Smelted iron ingot',
    basePrice: 3,
    tier: 2,
    productionTime: 2000,
  },

  // Tier 3 - Simple Components
  screw: {
    id: 'screw',
    name: 'Screw',
    description: 'Metal screw for assembly',
    basePrice: 5,
    tier: 3,
    productionTime: 3000,
  },
  plate: {
    id: 'plate',
    name: 'Metal Plate',
    description: 'Flat metal plate for construction',
    basePrice: 8,
    tier: 3,
    productionTime: 3500,
  },
  wire: {
    id: 'wire',
    name: 'Wire',
    description: 'Thin metal wire',
    basePrice: 4,
    tier: 3,
    productionTime: 2500,
  },

  // Tier 4 - Components
  bracket: {
    id: 'bracket',
    name: 'Bracket',
    description: 'L-shaped metal bracket for support',
    basePrice: 15,
    tier: 4,
    productionTime: 4000,
  },
  hinge: {
    id: 'hinge',
    name: 'Hinge',
    description: 'Door hinge mechanism',
    basePrice: 20,
    tier: 4,
    productionTime: 4500,
  },
  spring: {
    id: 'spring',
    name: 'Spring',
    description: 'Coiled metal spring',
    basePrice: 12,
    tier: 4,
    productionTime: 3500,
  },

  // Tier 5 - Assemblies
  door: {
    id: 'door',
    name: 'Door',
    description: 'Complete door assembly',
    basePrice: 120,
    tier: 5,
    productionTime: 6000,
  },
  cabinet: {
    id: 'cabinet',
    name: 'Cabinet',
    description: 'Storage cabinet with doors',
    basePrice: 250,
    tier: 5,
    productionTime: 7000,
  },
  toolbox: {
    id: 'toolbox',
    name: 'Toolbox',
    description: 'Metal toolbox with compartments',
    basePrice: 180,
    tier: 5,
    productionTime: 6500,
  },

  // Tier 6 - Advanced Products
  machinery: {
    id: 'machinery',
    name: 'Machinery',
    description: 'Complex industrial machinery',
    basePrice: 850,
    tier: 6,
    productionTime: 10000,
  },
  vehicle: {
    id: 'vehicle',
    name: 'Vehicle Frame',
    description: 'Basic vehicle frame assembly',
    basePrice: 1500,
    tier: 6,
    productionTime: 12000,
  },
};
