// Core game types for SAP Production Manager

export interface GameState {
  company: Company;
  inventory: Inventory;
  machines: MachineInstance[];
  unlockedMachines: string[];
  lastTick: number;
  initialized: boolean;
}

export interface Company {
  name: string;
  founded: number;
  cash: number;
}

export interface Inventory {
  [itemId: string]: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  tier: number;
  productionTime: number; // milliseconds for manual production
}

export interface Recipe {
  id: string;
  name: string;
  input: { itemId: string; amount: number } | null;
  output: { itemId: string; amount: number };
  productionTime: number;
}

export type GameScreen = 'setup' | 'production';

export interface Machine {
  id: string;
  name: string;
  description: string;
  cost: number;
  recipeId: string;
  productionTime: number; // milliseconds for automated production
  unlockRequirement: {
    type: 'cash' | 'item';
    value: number;
    itemId?: string;
  };
}

export interface MachineInstance {
  id: string; // unique instance ID
  machineId: string; // reference to Machine definition
  progress: number; // 0-100
  lastUpdate: number; // timestamp
  active: boolean;
}
