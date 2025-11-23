import { StaffType } from '../types/game.types';

export const STAFF_TYPES: Record<string, StaffType> = {
  // COMMON STAFF (70% chance)
  miner: {
    id: 'miner',
    name: 'Miner',
    description: 'Mines iron ore automatically',
    baseSalary: 5,
    hireCoat: 50,
    productionSpeed: 1.0,
    specialty: 'mine_ore',
    maxHires: -1,
    rarity: 'common',
  },
  lumberjack: {
    id: 'lumberjack',
    name: 'Lumberjack',
    description: 'Chops wood and mines coal',
    baseSalary: 5,
    hireCoat: 50,
    productionSpeed: 1.0,
    specialty: 'chop_wood',
    maxHires: -1,
    rarity: 'common',
  },
  smith: {
    id: 'smith',
    name: 'Smith',
    description: 'Smelts ore and crafts basic components',
    baseSalary: 8,
    hireCoat: 100,
    productionSpeed: 1.2,
    specialty: 'any_tier_2_3',
    maxHires: -1,
    rarity: 'common',
  },

  // UNCOMMON STAFF (20% chance)
  engineer: {
    id: 'engineer',
    name: 'Engineer',
    description: 'Assembles complex products',
    baseSalary: 15,
    hireCoat: 300,
    productionSpeed: 1.5,
    specialty: 'any_tier_4_5_6',
    maxHires: -1,
    rarity: 'uncommon',
  },
  intern: {
    id: 'intern',
    name: 'Research Intern',
    description: 'Researches upgrades in the lab',
    baseSalary: 3,
    hireCoat: 25,
    productionSpeed: 1.0,
    specialty: 'research',
    maxHires: -1,
    rarity: 'uncommon',
  },

  // RARE STAFF (7% chance)
  master_craftsman: {
    id: 'master_craftsman',
    name: 'Master Craftsman',
    description: 'Expert at any production task, 2x speed',
    baseSalary: 50,
    hireCoat: 1000,
    productionSpeed: 2.0,
    specialty: 'any',
    maxHires: 3,
    rarity: 'rare',
  },
  quantum_physicist: {
    id: 'quantum_physicist',
    name: 'Quantum Physicist',
    description: 'Research speed x3, very expensive',
    baseSalary: 100,
    hireCoat: 2000,
    productionSpeed: 3.0,
    specialty: 'research',
    maxHires: 2,
    rarity: 'rare',
  },

  // EPIC STAFF (2% chance)
  industrial_robot: {
    id: 'industrial_robot',
    name: 'Industrial Robot',
    description: 'Never sleeps, 2.5x production speed, no errors',
    baseSalary: 200,
    hireCoat: 5000,
    productionSpeed: 2.5,
    specialty: 'any',
    maxHires: 2,
    rarity: 'epic',
  },

  // LEGENDARY EASTER EGGS (0.5% each)
  melon_kusk: {
    id: 'melon_kusk',
    name: 'Melon Kusk',
    description: '🚀 Eccentric CEO - "We\'re going to Mars!" +15% global production speed',
    baseSalary: 500,
    hireCoat: 10000,
    productionSpeed: 1.0,
    specialty: 'any',
    maxHires: 1,
    rarity: 'legendary',
    isSpecial: true,
    globalBonus: {
      type: 'production_speed',
      value: 0.15,
      description: '🚀 Visionary Leadership: +15% production speed for all staff',
    },
  },
  gill_bates: {
    id: 'gill_bates',
    name: 'Gill Bates',
    description: '💻 Tech Philanthropist - "Let\'s innovate!" +25% research speed',
    baseSalary: 450,
    hireCoat: 10000,
    productionSpeed: 1.0,
    specialty: 'research',
    maxHires: 1,
    rarity: 'legendary',
    isSpecial: true,
    globalBonus: {
      type: 'research_speed',
      value: 0.25,
      description: '💻 Innovation Mindset: +25% research speed',
    },
  },
  stef_jubs: {
    id: 'stef_jubs',
    name: 'Stef Jubs',
    description: '🎨 Product Visionary - "One more thing..." +20% revenue from sales',
    baseSalary: 400,
    hireCoat: 10000,
    productionSpeed: 1.0,
    specialty: 'any',
    maxHires: 1,
    rarity: 'legendary',
    isSpecial: true,
    globalBonus: {
      type: 'revenue_boost',
      value: 0.20,
      description: '🎨 Design Excellence: +20% revenue from all sales',
    },
  },
  beff_jezos: {
    id: 'beff_jezos',
    name: 'Beff Jezos',
    description: '📦 Logistics Master - "Customer obsessed!" -15% all costs',
    baseSalary: 480,
    hireCoat: 10000,
    productionSpeed: 1.5,
    specialty: 'any',
    maxHires: 1,
    rarity: 'legendary',
    isSpecial: true,
    globalBonus: {
      type: 'cost_reduction',
      value: 0.15,
      description: '📦 Operational Excellence: -15% on all expenses',
    },
  },
  warrick_muffett: {
    id: 'warrick_muffett',
    name: 'Warrick Muffett',
    description: '💰 Value Investor - "Be greedy when others are fearful" +10% productivity',
    baseSalary: 350,
    hireCoat: 10000,
    productionSpeed: 1.0,
    specialty: 'any',
    maxHires: 1,
    rarity: 'legendary',
    isSpecial: true,
    globalBonus: {
      type: 'productivity',
      value: 0.10,
      description: '💰 Strategic Thinking: +10% productivity rating',
    },
  },
  nark_zuckerberg: {
    id: 'nark_zuckerberg',
    name: 'Nark Zuckerberg',
    description: '👥 Social Network Genius - "Move fast!" +10% to everything',
    baseSalary: 520,
    hireCoat: 15000,
    productionSpeed: 1.3,
    specialty: 'any_tier_4_5_6',
    maxHires: 1,
    rarity: 'legendary',
    isSpecial: true,
    globalBonus: {
      type: 'all_stats',
      value: 0.10,
      description: '👥 Meta Efficiency: +10% to production, research, and revenue',
    },
  },
  larry_cage: {
    id: 'larry_cage',
    name: 'Larry Cage',
    description: '🎭 Chaotic Actor - "I\'m a cat!" Random bonuses, unpredictable',
    baseSalary: 300,
    hireCoat: 8000,
    productionSpeed: 2.0,
    specialty: 'any',
    maxHires: 1,
    rarity: 'legendary',
    isSpecial: true,
    globalBonus: {
      type: 'all_stats',
      value: 0.05,
      description: '🎭 Chaotic Energy: +5% to everything (and random surprises)',
    },
  },
};

// Research times for upgrades (base time in seconds with 1 intern)
export const RESEARCH_TIMES: Record<string, number> = {
  // Selling upgrades - quick research
  sell_quantity_1: 30,
  sell_quantity_2: 60,
  sell_quantity_3: 120,

  // Market upgrades - medium research
  market_research: 45,
  price_floor_basic: 60,
  price_floor_advanced: 180,

  // Production upgrades - ongoing research
  production_speed: 30,
  automation_speed: 45,

  // Unlock upgrades - longer research
  unlock_tier3: 90,
  unlock_tier4: 180,
  unlock_tier5: 300,
  unlock_tier6: 600,
};

// Rarity weights for random hiring
export const RARITY_WEIGHTS = {
  common: 0.70, // 70%
  uncommon: 0.20, // 20%
  rare: 0.07, // 7%
  epic: 0.02, // 2%
  legendary: 0.01, // 1% (split among all legendaries)
};

// Rarity colors for UI
export const RARITY_COLORS = {
  common: '#888', // Gray
  uncommon: '#0af', // Blue
  rare: '#a0f', // Purple
  epic: '#f0a', // Magenta
  legendary: '#fa0', // Gold/Orange
};

// Stat variation ranges by rarity
export const STAT_VARIATIONS = {
  common: { salary: [0.9, 1.1], speed: [0.9, 1.1] },
  uncommon: { salary: [0.8, 1.2], speed: [0.9, 1.2] },
  rare: { salary: [0.7, 1.3], speed: [1.0, 1.4] },
  epic: { salary: [0.7, 1.3], speed: [1.1, 1.5] },
  legendary: { salary: [1.0, 1.0], speed: [1.0, 1.0] }, // Fixed stats for legendaries
};
