// Core game types for SAP Production Manager

export interface GameState {
  company: Company;
  inventory: Inventory;
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
