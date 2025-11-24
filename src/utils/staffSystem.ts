import { GameState, StaffMember, StaffType, StaffCandidate, StaffRarity } from '../types/game.types';
import { STAFF_TYPES, RESEARCH_TIMES, STAT_VARIATIONS, RARITY_WEIGHTS } from '../data/staff';
import { RECIPES } from '../data/recipes';
import { UPGRADES } from '../data/upgrades';
import { TECH_TREE } from '../data/techTree';
import { recordExpense } from './fiscalSystem';

// Generate random multiplier within range
function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// Generate a random rarity based on weights
function generateRandomRarity(): StaffRarity {
  const roll = Math.random();
  let cumulative = 0;

  const rarities: StaffRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

  for (const rarity of rarities) {
    cumulative += RARITY_WEIGHTS[rarity];
    if (roll < cumulative) {
      return rarity;
    }
  }

  return 'common'; // Fallback
}

// Get random staff type of a given rarity
function getRandomStaffOfRarity(rarity: StaffRarity): StaffType | null {
  const staffOfRarity = Object.values(STAFF_TYPES).filter(s => s.rarity === rarity);
  if (staffOfRarity.length === 0) return null;
  return staffOfRarity[Math.floor(Math.random() * staffOfRarity.length)];
}

export function hireStaff(gameState: GameState, staffTypeId: string): GameState | null {
  const staffType = STAFF_TYPES[staffTypeId];
  if (!staffType) return null;

  // Check if can afford
  if (gameState.company.cash < staffType.hireCoat) return null;

  // Check max hires
  if (staffType.maxHires > 0) {
    const currentCount = gameState.staff.filter((s) => s.staffTypeId === staffTypeId).length;
    if (currentCount >= staffType.maxHires) return null;
  }

  const newState = { ...gameState };
  newState.company.cash -= staffType.hireCoat;

  // Generate randomized stats based on rarity
  const statRange = STAT_VARIATIONS[staffType.rarity];
  const salaryMultiplier = randomInRange(statRange.salary[0], statRange.salary[1]);
  const speedMultiplier = randomInRange(statRange.speed[0], statRange.speed[1]);

  const newStaffMember: StaffMember = {
    id: `staff_${Date.now()}_${Math.random()}`,
    staffTypeId,
    hiredAt: Date.now(),
    assignedRecipe: null,
    salaryMultiplier,
    speedMultiplier,
    rarity: staffType.rarity,
    name: staffType.isSpecial ? staffType.name : `${staffType.name} #${gameState.staff.length + 1}`,
  };

  newState.staff = [...newState.staff, newStaffMember];

  return newState;
}

export function fireStaff(gameState: GameState, staffId: string): GameState {
  const newState = { ...gameState };
  newState.staff = newState.staff.filter((s) => s.id !== staffId);
  return newState;
}

export function assignStaffToRecipe(
  gameState: GameState,
  staffId: string,
  recipeId: string | null
): GameState {
  const newState = { ...gameState };
  const staffIndex = newState.staff.findIndex((s) => s.id === staffId);

  if (staffIndex !== -1) {
    newState.staff[staffIndex] = {
      ...newState.staff[staffIndex],
      assignedRecipe: recipeId,
    };
  }

  return newState;
}

export function processStaffProduction(gameState: GameState, deltaTime: number): GameState {
  let newState = { ...gameState };

  // Process each staff member
  for (const staff of newState.staff) {
    if (!staff.assignedRecipe) continue;

    const staffType = STAFF_TYPES[staff.staffTypeId];
    const recipe = RECIPES[staff.assignedRecipe];

    if (!recipe || !canStaffPerformRecipe(staffType, recipe.id)) continue;

    // Staff produce at their production speed (with individual multiplier)
    // Simple approach: chance to produce based on speed and delta
    const effectiveSpeed = staffType.productionSpeed * staff.speedMultiplier;
    const productionChance = (deltaTime / recipe.productionTime) * effectiveSpeed;

    if (Math.random() < productionChance) {
      // Check materials
      let hasAllMaterials = true;
      for (const input of recipe.inputs) {
        const currentAmount = newState.inventory[input.itemId] || 0;
        if (currentAmount < input.amount) {
          hasAllMaterials = false;
          break;
        }
      }

      if (hasAllMaterials) {
        // Consume inputs
        for (const input of recipe.inputs) {
          newState.inventory[input.itemId] -= input.amount;
        }
        // Add output
        newState.inventory[recipe.output.itemId] =
          (newState.inventory[recipe.output.itemId] || 0) + recipe.output.amount;
      }
    }
  }

  return newState;
}

export function canStaffPerformRecipe(staffType: StaffType, recipeId: string): boolean {
  if (staffType.specialty === 'any') return true;
  if (staffType.specialty === recipeId) return true;

  const recipe = RECIPES[recipeId];
  if (!recipe) return false;

  // Check tier-based specialties
  if (staffType.specialty === 'any_tier_2_3') {
    return ['smelt_ingot', 'craft_screw', 'craft_plate', 'craft_wire'].includes(recipeId);
  }

  if (staffType.specialty === 'any_tier_4_5_6') {
    return [
      'craft_bracket',
      'craft_hinge',
      'craft_spring',
      'craft_door',
      'craft_cabinet',
      'craft_toolbox',
      'craft_machinery',
      'craft_vehicle',
    ].includes(recipeId);
  }

  return false;
}

export function paySalaries(gameState: GameState): GameState {
  const now = Date.now();
  const timeSinceLastPayment = now - gameState.lastSalaryPayment;

  // Pay salaries every in-game hour (60 seconds real time)
  const HOUR_MS = 60000;

  if (timeSinceLastPayment < HOUR_MS) return gameState;

  let newState = { ...gameState };
  let totalSalary = 0;

  for (const staff of newState.staff) {
    const staffType = STAFF_TYPES[staff.staffTypeId];
    const effectiveSalary = staffType.baseSalary * staff.salaryMultiplier;
    totalSalary += effectiveSalary;
  }

  newState.company.cash -= totalSalary;
  newState.lastSalaryPayment = now;

  // Record salary as expense
  if (totalSalary > 0) {
    newState = recordExpense(newState, totalSalary);
  }

  return newState;
}

export function startResearch(gameState: GameState, upgradeId: string): GameState | null {
  const upgrade = UPGRADES[upgradeId] || TECH_TREE[upgradeId];
  if (!upgrade) return null;

  // Check if already researched
  if (gameState.research.completed.includes(upgradeId)) return null;

  // Check if already researching
  if (gameState.research.current) return null;

  // Count available interns
  const availableInterns = gameState.staff.filter(
    (s) => STAFF_TYPES[s.staffTypeId].specialty === 'research' && !s.assignedRecipe
  ).length;

  if (availableInterns === 0) return null;

  const newState = { ...gameState };
  newState.research.current = {
    upgradeId,
    startedAt: Date.now(),
    researchersAssigned: availableInterns,
    progress: 0,
  };

  return newState;
}

export function processResearch(gameState: GameState, deltaTime: number): GameState {
  if (!gameState.research.current) return gameState;

  const newState = { ...gameState };
  const project = newState.research.current;

  if (!project) return newState;

  // Count current interns (they might have been fired)
  const currentInterns = newState.staff.filter(
    (s) => STAFF_TYPES[s.staffTypeId].specialty === 'research'
  ).length;

  project.researchersAssigned = currentInterns;

  if (currentInterns === 0) {
    // No researchers, pause research
    return newState;
  }

  // Try tech tree first, then fall back to old research times
  const tech = TECH_TREE[project.upgradeId];
  const researchTime = tech ? tech.researchTime : (RESEARCH_TIMES[project.upgradeId] || 60);
  const baseTime = researchTime * 1000; // Convert to ms
  // Linear scaling: Each intern contributes equally
  // 2 interns = 2x speed (half time), 3 interns = 3x speed (third time)
  const researchSpeed = currentInterns;

  const progressIncrease = ((deltaTime / baseTime) * researchSpeed) * 100;
  project.progress += progressIncrease;

  if (project.progress >= 100) {
    // Research complete!
    newState.research.completed = [...newState.research.completed, project.upgradeId];
    newState.research.current = null;
  }

  return newState;
}

export function getTotalHourlyCost(gameState: GameState): number {
  let total = 0;
  for (const staff of gameState.staff) {
    const staffType = STAFF_TYPES[staff.staffTypeId];
    const effectiveSalary = staffType.baseSalary * staff.salaryMultiplier;
    total += effectiveSalary;
  }
  return total;
}

export function getStaffByType(gameState: GameState, staffTypeId: string): StaffMember[] {
  return gameState.staff.filter((s) => s.staffTypeId === staffTypeId);
}

// Scout talent - generates 5 random candidates like a lootbox
export function scoutTalent(gameState: GameState): GameState | null {
  const SCOUT_COST = 100; // Cost to scout talent

  // Check if can afford
  if (gameState.company.cash < SCOUT_COST) return null;

  // Can't scout if already have active scout results
  if (gameState.scouting) return null;

  const newState = { ...gameState };
  newState.company.cash -= SCOUT_COST;

  // Generate 5 random candidates
  const candidates: StaffCandidate[] = [];

  for (let i = 0; i < 5; i++) {
    const rarity = generateRandomRarity();
    const staffType = getRandomStaffOfRarity(rarity);

    if (!staffType) continue; // Skip if no staff of this rarity

    // Generate randomized stats
    const statRange = STAT_VARIATIONS[staffType.rarity];
    const salaryMultiplier = randomInRange(statRange.salary[0], statRange.salary[1]);
    const speedMultiplier = randomInRange(statRange.speed[0], statRange.speed[1]);

    // Generate name
    const candidateNumber = Math.floor(Math.random() * 999) + 1;
    const name = staffType.isSpecial
      ? staffType.name
      : `${staffType.name} #${candidateNumber}`;

    candidates.push({
      id: `candidate_${Date.now()}_${i}`,
      staffTypeId: staffType.id,
      salaryMultiplier,
      speedMultiplier,
      rarity: staffType.rarity,
      name,
      effectiveSalary: staffType.baseSalary * salaryMultiplier,
      effectiveSpeed: staffType.productionSpeed * speedMultiplier,
    });
  }

  newState.scouting = {
    candidates,
    scoutedAt: Date.now(),
    cost: SCOUT_COST,
  };

  // Record scouting as expense
  const stateWithExpense = recordExpense(newState, SCOUT_COST);

  return stateWithExpense;
}

// Hire a candidate from scout results
export function hireFromScout(gameState: GameState, candidateId: string): GameState | null {
  if (!gameState.scouting) return null;

  const candidate = gameState.scouting.candidates.find(c => c.id === candidateId);
  if (!candidate) return null;

  const staffType = STAFF_TYPES[candidate.staffTypeId];
  if (!staffType) return null;

  // Check if can afford hire cost
  if (gameState.company.cash < staffType.hireCoat) return null;

  // Check max hires limit
  if (staffType.maxHires > 0) {
    const currentCount = gameState.staff.filter((s) => s.staffTypeId === candidate.staffTypeId).length;
    if (currentCount >= staffType.maxHires) return null;
  }

  const newState = { ...gameState };
  newState.company.cash -= staffType.hireCoat;

  // Create staff member from candidate
  const newStaffMember: StaffMember = {
    id: `staff_${Date.now()}_${Math.random()}`,
    staffTypeId: candidate.staffTypeId,
    hiredAt: Date.now(),
    assignedRecipe: null,
    salaryMultiplier: candidate.salaryMultiplier,
    speedMultiplier: candidate.speedMultiplier,
    rarity: candidate.rarity,
    name: staffType.isSpecial
      ? staffType.name
      : `${staffType.name} #${gameState.staff.length + 1}`,
  };

  newState.staff = [...newState.staff, newStaffMember];

  // Clear scouting state (can only hire one)
  newState.scouting = null;

  // Record hire cost as expense
  const stateWithExpense = recordExpense(newState, staffType.hireCoat);

  return stateWithExpense;
}

// Dismiss scout results without hiring
export function dismissScout(gameState: GameState): GameState {
  const newState = { ...gameState };
  newState.scouting = null;
  return newState;
}
