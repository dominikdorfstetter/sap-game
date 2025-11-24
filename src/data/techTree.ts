import { TechNode } from '../types/game.types';

/**
 * Tech Tree System - Unified Research & Upgrades
 *
 * Each node can be:
 * - Researched (costs time with interns)
 * - Purchased (costs money after research completes)
 * - Both (research first, then buy multiple levels)
 */

export const TECH_TREE: Record<string, TechNode> = {
  // ==============================================
  // STARTING TECHS (Always available)
  // ==============================================

  basic_efficiency: {
    id: 'basic_efficiency',
    name: 'Basic Production Efficiency',
    description: 'Learn the fundamentals of efficient production',
    category: 'production',
    researchTime: 30,
    cost: 0,
    maxLevel: 1,
    prerequisites: [],
    effects: [{ type: 'unlock_feature', value: 1, target: 'hold_production' }],
    branch: 'production',
  },

  // ==============================================
  // PRODUCTION BRANCH
  // ==============================================

  manual_efficiency_1: {
    id: 'manual_efficiency_1',
    name: 'Manual Efficiency I',
    description: 'Manual crafting 10% faster',
    category: 'production',
    researchTime: 45,
    cost: 100,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['basic_efficiency'],
    effects: [{ type: 'production_speed', value: 0.1 }],
    branch: 'production',
  },

  manual_efficiency_2: {
    id: 'manual_efficiency_2',
    name: 'Manual Efficiency II',
    description: 'Manual crafting 20% faster (total)',
    category: 'production',
    researchTime: 60,
    cost: 250,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['manual_efficiency_1'],
    effects: [{ type: 'production_speed', value: 0.1 }],
    branch: 'production',
  },

  manual_efficiency_3: {
    id: 'manual_efficiency_3',
    name: 'Manual Efficiency III',
    description: 'Manual crafting 30% faster (total)',
    category: 'production',
    researchTime: 75,
    cost: 500,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['manual_efficiency_2'],
    effects: [{ type: 'production_speed', value: 0.1 }],
    branch: 'production',
  },

  critical_strikes_1: {
    id: 'critical_strikes_1',
    name: 'Critical Production I',
    description: '10% chance to produce double output',
    category: 'production',
    researchTime: 90,
    cost: 750,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['manual_efficiency_2'],
    effects: [{ type: 'critical_chance', value: 0.1 }],
    branch: 'production',
  },

  automation_research: {
    id: 'automation_research',
    name: 'Automation Technology',
    description: 'Unlock the ability to purchase and operate machines',
    category: 'production',
    researchTime: 120,
    cost: 0,
    maxLevel: 1,
    prerequisites: ['manual_efficiency_3'],
    effects: [{ type: 'unlock_feature', value: 1, target: 'automation' }],
    branch: 'production',
  },

  automation_efficiency_1: {
    id: 'automation_efficiency_1',
    name: 'Automation Efficiency I',
    description: 'Machines produce 15% faster',
    category: 'production',
    researchTime: 90,
    cost: 400,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['automation_research'],
    effects: [{ type: 'automation_speed', value: 0.15 }],
    branch: 'production',
  },

  automation_efficiency_2: {
    id: 'automation_efficiency_2',
    name: 'Automation Efficiency II',
    description: 'Machines produce 30% faster (total)',
    category: 'production',
    researchTime: 105,
    cost: 800,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['automation_efficiency_1'],
    effects: [{ type: 'automation_speed', value: 0.15 }],
    branch: 'production',
  },

  automation_efficiency_3: {
    id: 'automation_efficiency_3',
    name: 'Automation Efficiency III',
    description: 'Machines produce 45% faster (total)',
    category: 'production',
    researchTime: 120,
    cost: 1600,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['automation_efficiency_2'],
    effects: [{ type: 'automation_speed', value: 0.15 }],
    branch: 'production',
  },

  critical_strikes_2: {
    id: 'critical_strikes_2',
    name: 'Critical Production II',
    description: '15% chance to produce double output',
    category: 'production',
    researchTime: 150,
    cost: 2000,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['critical_strikes_1', 'automation_research'],
    effects: [{ type: 'critical_chance', value: 0.05 }],
    branch: 'production',
  },

  critical_strikes_3: {
    id: 'critical_strikes_3',
    name: 'Critical Production III',
    description: '20% chance to produce double output',
    category: 'production',
    researchTime: 180,
    cost: 4000,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['critical_strikes_2', 'automation_efficiency_3'],
    effects: [{ type: 'critical_chance', value: 0.05 }],
    branch: 'production',
  },

  // ==============================================
  // MARKET BRANCH
  // ==============================================

  marketing_1: {
    id: 'marketing_1',
    name: 'Marketing I',
    description: 'Selling prices 10% higher',
    category: 'market',
    researchTime: 60,
    cost: 200,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: [],
    effects: [{ type: 'market_bonus', value: 0.1 }],
    branch: 'market',
  },

  marketing_2: {
    id: 'marketing_2',
    name: 'Marketing II',
    description: 'Selling prices 20% higher (total)',
    category: 'market',
    researchTime: 90,
    cost: 500,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['marketing_1'],
    effects: [{ type: 'market_bonus', value: 0.1 }],
    branch: 'market',
  },

  marketing_3: {
    id: 'marketing_3',
    name: 'Marketing III',
    description: 'Selling prices 30% higher (total)',
    category: 'market',
    researchTime: 120,
    cost: 1200,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['marketing_2'],
    effects: [{ type: 'market_bonus', value: 0.1 }],
    branch: 'market',
  },

  bulk_trading_1: {
    id: 'bulk_trading_1',
    name: 'Bulk Trading I',
    description: 'Sell up to 10 items at once',
    category: 'market',
    researchTime: 45,
    cost: 150,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['marketing_1'],
    effects: [{ type: 'sell_quantity', value: 10 }],
    branch: 'market',
  },

  bulk_trading_2: {
    id: 'bulk_trading_2',
    name: 'Bulk Trading II',
    description: 'Sell up to 100 items at once',
    category: 'market',
    researchTime: 75,
    cost: 600,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['bulk_trading_1', 'marketing_2'],
    effects: [{ type: 'sell_quantity', value: 100 }],
    branch: 'market',
  },

  bulk_trading_3: {
    id: 'bulk_trading_3',
    name: 'Bulk Trading III',
    description: 'Sell up to 1000 items at once',
    category: 'market',
    researchTime: 105,
    cost: 2500,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['bulk_trading_2', 'marketing_3'],
    effects: [{ type: 'sell_quantity', value: 1000 }],
    branch: 'market',
  },

  price_stabilization: {
    id: 'price_stabilization',
    name: 'Price Stabilization',
    description: 'Basic materials never sell below 80% base price',
    category: 'market',
    researchTime: 90,
    cost: 400,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['marketing_1'],
    effects: [
      { type: 'price_floor', value: 0.8, target: 'ore' },
      { type: 'price_floor', value: 0.8, target: 'ingot' },
      { type: 'price_floor', value: 0.8, target: 'wood' },
      { type: 'price_floor', value: 0.8, target: 'coal' },
    ],
    branch: 'market',
  },

  advanced_price_stabilization: {
    id: 'advanced_price_stabilization',
    name: 'Advanced Price Stabilization',
    description: 'All items never sell below 90% base price',
    category: 'market',
    researchTime: 150,
    cost: 2500,
    maxLevel: 1,
    costMultiplier: 1,
    prerequisites: ['price_stabilization', 'marketing_3'],
    effects: [{ type: 'price_floor', value: 0.9 }],
    branch: 'market',
  },

  // ==============================================
  // STEEL PATH - TECHNOLOGY BRANCH
  // ==============================================

  advanced_metalworking: {
    id: 'advanced_metalworking',
    name: 'Advanced Metalworking',
    description: 'Unlock Metal Plate and Wire production',
    category: 'technology',
    researchTime: 90,
    cost: 300,
    maxLevel: 1,
    prerequisites: [],
    effects: [
      { type: 'unlock_recipe', value: 1, target: 'craft_plate' },
      { type: 'unlock_recipe', value: 1, target: 'craft_wire' },
    ],
    branch: 'technology',
    pathRestriction: 'steel',
  },

  steel_processing: {
    id: 'steel_processing',
    name: 'Steel Processing',
    description: 'Unlock Steel Bar and Bolt production',
    category: 'technology',
    researchTime: 120,
    cost: 800,
    maxLevel: 1,
    prerequisites: ['advanced_metalworking'],
    effects: [
      { type: 'unlock_recipe', value: 1, target: 'forge_steel' },
      { type: 'unlock_recipe', value: 1, target: 'craft_bolt' },
    ],
    branch: 'technology',
    pathRestriction: 'steel',
  },

  electronics: {
    id: 'electronics',
    name: 'Electronics',
    description: 'Unlock Circuit Board production',
    category: 'technology',
    researchTime: 150,
    cost: 1500,
    maxLevel: 1,
    prerequisites: ['advanced_metalworking'],
    effects: [
      { type: 'unlock_recipe', value: 1, target: 'craft_circuit' },
    ],
    branch: 'technology',
    pathRestriction: 'steel',
  },

  complex_components: {
    id: 'complex_components',
    name: 'Complex Components',
    description: 'Unlock Bracket, Hinge, Spring, and Gear production',
    category: 'technology',
    researchTime: 180,
    cost: 2000,
    maxLevel: 1,
    prerequisites: ['steel_processing'],
    effects: [
      { type: 'unlock_recipe', value: 1, target: 'craft_bracket' },
      { type: 'unlock_recipe', value: 1, target: 'craft_hinge' },
      { type: 'unlock_recipe', value: 1, target: 'craft_spring' },
      { type: 'unlock_recipe', value: 1, target: 'craft_gear' },
    ],
    branch: 'technology',
    pathRestriction: 'steel',
  },

  advanced_manufacturing: {
    id: 'advanced_manufacturing',
    name: 'Advanced Manufacturing',
    description: 'Unlock Engine and Toolbox production',
    category: 'technology',
    researchTime: 240,
    cost: 5000,
    maxLevel: 1,
    prerequisites: ['complex_components', 'electronics'],
    effects: [
      { type: 'unlock_recipe', value: 1, target: 'craft_engine' },
      { type: 'unlock_recipe', value: 1, target: 'craft_toolbox' },
    ],
    branch: 'technology',
    pathRestriction: 'steel',
  },

  industrial_engineering: {
    id: 'industrial_engineering',
    name: 'Industrial Engineering',
    description: 'Unlock Machinery, Vehicle, and Computer production',
    category: 'technology',
    researchTime: 300,
    cost: 12000,
    maxLevel: 1,
    prerequisites: ['advanced_manufacturing'],
    effects: [
      { type: 'unlock_recipe', value: 1, target: 'craft_machinery' },
      { type: 'unlock_recipe', value: 1, target: 'craft_vehicle' },
      { type: 'unlock_recipe', value: 1, target: 'craft_computer' },
    ],
    branch: 'technology',
    pathRestriction: 'steel',
  },

  // ==============================================
  // WOOD PATH - TECHNOLOGY BRANCH
  // ==============================================

  advanced_carpentry: {
    id: 'advanced_carpentry',
    name: 'Advanced Carpentry',
    description: 'Unlock Nail production and improved woodworking',
    category: 'technology',
    researchTime: 90,
    cost: 300,
    maxLevel: 1,
    prerequisites: [],
    effects: [
      { type: 'unlock_recipe', value: 1, target: 'craft_nail' },
    ],
    branch: 'technology',
    pathRestriction: 'wood',
  },

  glassworking: {
    id: 'glassworking',
    name: 'Glassworking',
    description: 'Unlock Glass Pane production',
    category: 'technology',
    researchTime: 90,
    cost: 300,
    maxLevel: 1,
    prerequisites: [],
    effects: [
      { type: 'unlock_recipe', value: 1, target: 'make_glass' },
    ],
    branch: 'technology',
    pathRestriction: 'wood',
  },

  metalworking_basics: {
    id: 'metalworking_basics',
    name: 'Basic Metalworking',
    description: 'Learn basic metal component crafting (Brackets, Hinges)',
    category: 'technology',
    researchTime: 120,
    cost: 800,
    maxLevel: 1,
    prerequisites: ['advanced_carpentry'],
    effects: [
      { type: 'unlock_recipe', value: 1, target: 'craft_bracket' },
      { type: 'unlock_recipe', value: 1, target: 'craft_hinge' },
    ],
    branch: 'technology',
    pathRestriction: 'wood',
  },

  furniture_making: {
    id: 'furniture_making',
    name: 'Furniture Making',
    description: 'Unlock Door and Window production',
    category: 'technology',
    researchTime: 150,
    cost: 1200,
    maxLevel: 1,
    prerequisites: ['metalworking_basics', 'glassworking'],
    effects: [
      { type: 'unlock_recipe', value: 1, target: 'craft_door' },
      { type: 'unlock_recipe', value: 1, target: 'craft_window' },
    ],
    branch: 'technology',
    pathRestriction: 'wood',
  },

  cabinet_making: {
    id: 'cabinet_making',
    name: 'Cabinet Making',
    description: 'Unlock Cabinet production',
    category: 'technology',
    researchTime: 180,
    cost: 2500,
    maxLevel: 1,
    prerequisites: ['furniture_making'],
    effects: [
      { type: 'unlock_recipe', value: 1, target: 'craft_cabinet' },
    ],
    branch: 'technology',
    pathRestriction: 'wood',
  },
};
