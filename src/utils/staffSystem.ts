import { GameState, StaffMember, StaffType } from '../types/game.types';
import { STAFF_TYPES, RESEARCH_TIMES, STAT_VARIATIONS } from '../data/staff';
import { RECIPES } from '../data/recipes';
import { UPGRADES } from '../data/upgrades';
import { recordExpense } from './fiscalSystem';

// Generate random multiplier within range
function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
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
  const upgrade = UPGRADES[upgradeId];
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

  const baseTime = (RESEARCH_TIMES[project.upgradeId] || 60) * 1000; // Convert to ms
  const researchSpeed = Math.sqrt(currentInterns); // Diminishing returns

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
