// Core game types for ERP Production Manager

export interface GameState {
  company: Company;
  inventory: Inventory;
  machines: MachineInstance[];
  unlockedMachines: string[];
  upgrades: UpgradeState;
  market: MarketState;
  unlockedRecipes: string[];
  staff: StaffMember[];
  research: ResearchQueue;
  fiscal: FiscalState;
  preferences: UserPreferences;
  scouting: ScoutingState | null; // Active talent scout results
  tutorial: TutorialState; // Onboarding progress
  lastTick: number;
  lastSalaryPayment: number;
  initialized: boolean;
}

export interface TutorialState {
  completed: boolean;
  currentStep: number;
  stepCompleted: { [step: number]: boolean };
}

export type TutorialStep = {
  id: number;
  title: string;
  message: string;
  highlightTarget?: string; // CSS selector or widget ID
  action?: 'produce_item' | 'sell_item' | 'buy_machine' | 'hire_staff' | 'click_continue';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
};

export type CompanyType = 'wood' | 'steel';

export interface Company {
  name: string;
  founded: number;
  cash: number;
  type: CompanyType; // Wood-oriented or Steel-oriented
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

export type InputMethod = 'click' | 'slider' | 'rapid-click' | 'hold-release' | 'sequence';

export interface Recipe {
  id: string;
  name: string;
  inputs: { itemId: string; amount: number }[];
  output: { itemId: string; amount: number };
  productionTime: number;
  unlocked: boolean;
  inputMethod?: InputMethod; // How the user interacts to produce this item manually
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
  type: 'sell_quantity' | 'production_speed' | 'market_bonus' | 'price_floor' | 'unlock_recipe' | 'auto_sell' | 'automation_speed' | 'critical_chance' | 'unlock_feature';
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

export type DashboardWidget = 'quickActions' | 'inventory' | 'machines' | 'market' | 'production' | 'staff' | 'research' | 'financials' | 'analytics';

export interface UserPreferences {
  pinnedWidgets: DashboardWidget[];
}

export interface FiscalState {
  currentQuarter: number; // 1-4
  fiscalYear: number;
  quarterStartTime: number; // timestamp
  quarterDuration: number; // milliseconds (default: 5 minutes)
  taxRate: number; // percentage (default: 0.20 = 20%)
  taxesOwed: number;
  totalTaxesPaid: number;
  quarterlyRevenue: number;
  quarterlyExpenses: number;
  productivityRating: number; // 0-100
  history: FiscalHistory;
}

export interface FiscalHistory {
  revenue: number[]; // Last 12 quarters
  expenses: number[]; // Last 12 quarters
  profit: number[]; // Last 12 quarters
  productivity: number[]; // Last 12 quarters
}

export type StaffRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface StaffType {
  id: string;
  name: string;
  description: string;
  baseSalary: number; // Per hour (in-game time)
  hireCoat: number;
  productionSpeed: number; // Multiplier
  specialty: string; // Recipe ID or 'research'
  maxHires: number; // -1 for unlimited
  rarity: StaffRarity;
  isSpecial?: boolean; // Easter egg characters
  globalBonus?: StaffGlobalBonus; // Special global effects
}

export interface StaffGlobalBonus {
  type: 'production_speed' | 'cost_reduction' | 'revenue_boost' | 'research_speed' | 'productivity' | 'all_stats';
  value: number; // Multiplier or percentage
  description: string;
}

export interface StaffMember {
  id: string;
  staffTypeId: string;
  hiredAt: number;
  assignedRecipe: string | null; // null if idle or researching
  // Randomized stats (variation from base)
  salaryMultiplier: number; // 0.7 - 1.3
  speedMultiplier: number; // 0.8 - 1.5
  rarity: StaffRarity;
  name: string; // Generated or special name
}

export interface StaffCandidate {
  id: string; // Temporary ID for selection
  staffTypeId: string;
  salaryMultiplier: number;
  speedMultiplier: number;
  rarity: StaffRarity;
  name: string;
  // Derived display values
  effectiveSalary: number;
  effectiveSpeed: number;
}

export interface ScoutingState {
  candidates: StaffCandidate[];
  scoutedAt: number;
  cost: number;
}

export interface ResearchQueue {
  current: ResearchProject | null;
  completed: string[]; // Upgrade IDs that have been researched
}

export interface ResearchProject {
  upgradeId: string;
  startedAt: number;
  researchersAssigned: number;
  progress: number; // 0-100
}

export interface TechNode {
  id: string;
  name: string;
  description: string;
  category: 'production' | 'market' | 'technology';
  researchTime: number; // seconds
  cost: number; // Money cost after research
  maxLevel: number;
  costMultiplier?: number; // For multi-level upgrades
  prerequisites: string[]; // Tech IDs that must be researched first
  effects: UpgradeEffect[];
  branch: 'production' | 'market' | 'technology';
  pathRestriction?: CompanyType; // Only available to specific company types
}
