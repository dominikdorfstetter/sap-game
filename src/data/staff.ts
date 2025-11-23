import { StaffType } from '../types/game.types';

export const STAFF_TYPES: Record<string, StaffType> = {
  miner: {
    id: 'miner',
    name: 'Miner',
    description: 'Mines iron ore automatically',
    baseSalary: 5, // $5 per hour
    hireCoat: 50,
    productionSpeed: 1.0,
    specialty: 'mine_ore',
    maxHires: -1, // Unlimited
  },
  smith: {
    id: 'smith',
    name: 'Smith',
    description: 'Smelts ore and crafts basic components',
    baseSalary: 8,
    hireCoat: 100,
    productionSpeed: 1.2,
    specialty: 'any_tier_2_3', // Can do ingots, screws, plates, wire
    maxHires: -1,
  },
  engineer: {
    id: 'engineer',
    name: 'Engineer',
    description: 'Assembles complex products',
    baseSalary: 15,
    hireCoat: 300,
    productionSpeed: 1.5,
    specialty: 'any_tier_4_5_6', // Components and assemblies
    maxHires: -1,
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
  },
  master_craftsman: {
    id: 'master_craftsman',
    name: 'Master Craftsman',
    description: 'Expert at any production task, 2x speed',
    baseSalary: 50,
    hireCoat: 1000,
    productionSpeed: 2.0,
    specialty: 'any',
    maxHires: 3,
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
