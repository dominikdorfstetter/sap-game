// Core game types for ERP Production Manager

export interface GameState {
  company: Company;
  inventory: Inventory;
  machines: MachineInstance[];
  unlockedMachines: string[];
  upgrades: UpgradeState;
  market: MarketState;
  unlockedRecipes: string[];
  preferences: UserPreferences;
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
  inputs: { itemId: string; amount: number }[];
  output: { itemId: string; amount: number };
  productionTime: number;
  unlocked: boolean;
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

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  category: 'production' | 'market' | 'selling' | 'general';
  maxLevel: number;
  baseCost: number;
  costMultiplier: number; // Cost increases by this each level
  effects: UpgradeEffect[];
}

export interface UpgradeEffect {
  type: 'sell_quantity' | 'production_speed' | 'market_bonus' | 'price_floor' | 'unlock_recipe' | 'auto_sell';
  value: number; // Multiplier or flat bonus
  target?: string; // Optional specific target (recipe ID, item ID, etc.)
}

export interface UpgradeState {
  [upgradeId: string]: number; // upgrade ID -> current level
}

export interface MarketState {
  prices: { [itemId: string]: number }; // Current market prices
  priceHistory: { [itemId: string]: number[] }; // Last 10 price points
  demandModifiers: { [itemId: string]: number }; // Supply/demand multipliers
  lastPriceUpdate: number;
}

export type DashboardWidget = 'quickActions' | 'inventory' | 'machines' | 'market' | 'production';

export interface UserPreferences {
  pinnedWidgets: DashboardWidget[];
}
