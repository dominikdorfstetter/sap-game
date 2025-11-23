import { GameState, FiscalState } from '../types/game.types';

const QUARTER_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const TAX_RATE = 0.20; // 20% tax on profits

export function createInitialFiscalState(): FiscalState {
  return {
    currentQuarter: 1,
    fiscalYear: 1,
    quarterStartTime: Date.now(),
    quarterDuration: QUARTER_DURATION,
    taxRate: TAX_RATE,
    taxesOwed: 0,
    totalTaxesPaid: 0,
    quarterlyRevenue: 0,
    quarterlyExpenses: 0,
    productivityRating: 0,
    history: {
      revenue: [],
      expenses: [],
      profit: [],
      productivity: [],
    },
  };
}

export function recordRevenue(gameState: GameState, amount: number): GameState {
  return {
    ...gameState,
    fiscal: {
      ...gameState.fiscal,
      quarterlyRevenue: gameState.fiscal.quarterlyRevenue + amount,
    },
  };
}

export function recordExpense(gameState: GameState, amount: number): GameState {
  return {
    ...gameState,
    fiscal: {
      ...gameState.fiscal,
      quarterlyExpenses: gameState.fiscal.quarterlyExpenses + amount,
    },
  };
}

export function processQuarterEnd(gameState: GameState): GameState {
  const now = Date.now();
  const elapsed = now - gameState.fiscal.quarterStartTime;

  // Check if quarter has ended
  if (elapsed < gameState.fiscal.quarterDuration) {
    return gameState;
  }

  const { quarterlyRevenue, quarterlyExpenses } = gameState.fiscal;
  const quarterlyProfit = quarterlyRevenue - quarterlyExpenses;

  // Calculate taxes (only on profits)
  const taxAmount = quarterlyProfit > 0 ? quarterlyProfit * gameState.fiscal.taxRate : 0;

  // Update history (keep last 12 quarters)
  const newHistory = {
    revenue: [...gameState.fiscal.history.revenue, quarterlyRevenue].slice(-12),
    expenses: [...gameState.fiscal.history.expenses, quarterlyExpenses].slice(-12),
    profit: [...gameState.fiscal.history.profit, quarterlyProfit].slice(-12),
    productivity: [...gameState.fiscal.history.productivity, gameState.fiscal.productivityRating].slice(-12),
  };

  // Advance quarter
  let newQuarter = gameState.fiscal.currentQuarter + 1;
  let newYear = gameState.fiscal.fiscalYear;
  if (newQuarter > 4) {
    newQuarter = 1;
    newYear++;
  }

  return {
    ...gameState,
    fiscal: {
      ...gameState.fiscal,
      currentQuarter: newQuarter,
      fiscalYear: newYear,
      quarterStartTime: now,
      taxesOwed: gameState.fiscal.taxesOwed + taxAmount,
      quarterlyRevenue: 0,
      quarterlyExpenses: 0,
      history: newHistory,
    },
  };
}

export function payTaxes(gameState: GameState): GameState | null {
  if (gameState.company.cash < gameState.fiscal.taxesOwed) {
    return null; // Cannot afford to pay taxes
  }

  return {
    ...gameState,
    company: {
      ...gameState.company,
      cash: gameState.company.cash - gameState.fiscal.taxesOwed,
    },
    fiscal: {
      ...gameState.fiscal,
      totalTaxesPaid: gameState.fiscal.totalTaxesPaid + gameState.fiscal.taxesOwed,
      taxesOwed: 0,
    },
  };
}

export function calculateProductivity(gameState: GameState): number {
  let totalScore = 0;
  let maxScore = 0;

  // 1. Staff Utilization (25 points)
  if (gameState.staff.length > 0) {
    const assignedStaff = gameState.staff.filter((s) => s.assignedRecipe !== null).length;
    const utilizationRate = assignedStaff / gameState.staff.length;
    totalScore += utilizationRate * 25;
  }
  maxScore += 25;

  // 2. Machine Activity (25 points)
  if (gameState.machines.length > 0) {
    const activeMachines = gameState.machines.filter((m) => m.active).length;
    const machineRate = activeMachines / gameState.machines.length;
    totalScore += machineRate * 25;
  }
  maxScore += 25;

  // 3. Revenue Generation (25 points)
  // Score based on quarterly revenue (capped at 10000)
  const revenueScore = Math.min(gameState.fiscal.quarterlyRevenue / 10000, 1) * 25;
  totalScore += revenueScore;
  maxScore += 25;

  // 4. Research Progress (15 points)
  const researchScore = gameState.research.completed.length > 0 ? 15 : 0;
  totalScore += researchScore;
  maxScore += 15;

  // 5. Profitability (10 points)
  const profit = gameState.fiscal.quarterlyRevenue - gameState.fiscal.quarterlyExpenses;
  if (profit > 0) {
    totalScore += 10;
  }
  maxScore += 10;

  // Return percentage (0-100)
  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
}

export function updateProductivity(gameState: GameState): GameState {
  const productivityRating = calculateProductivity(gameState);
  return {
    ...gameState,
    fiscal: {
      ...gameState.fiscal,
      productivityRating,
    },
  };
}

export function getQuarterProgress(gameState: GameState): number {
  const now = Date.now();
  const elapsed = now - gameState.fiscal.quarterStartTime;
  const progress = (elapsed / gameState.fiscal.quarterDuration) * 100;
  return Math.min(progress, 100);
}

export function getQuarterTimeRemaining(gameState: GameState): number {
  const now = Date.now();
  const elapsed = now - gameState.fiscal.quarterStartTime;
  const remaining = gameState.fiscal.quarterDuration - elapsed;
  return Math.max(remaining, 0);
}

export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getProductivityGrade(rating: number): string {
  if (rating >= 90) return 'A+';
  if (rating >= 80) return 'A';
  if (rating >= 70) return 'B';
  if (rating >= 60) return 'C';
  if (rating >= 50) return 'D';
  return 'F';
}
