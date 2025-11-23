import { GameState, UpgradeEffect } from '../types/game.types';
import { UPGRADES } from '../data/upgrades';

export function getUpgradeLevel(gameState: GameState, upgradeId: string): number {
  return gameState.upgrades[upgradeId] || 0;
}

export function getUpgradeCost(upgradeId: string, currentLevel: number): number {
  const upgrade = UPGRADES[upgradeId];
  if (!upgrade) return 0;

  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
}

export function canPurchaseUpgrade(gameState: GameState, upgradeId: string): boolean {
  const upgrade = UPGRADES[upgradeId];
  if (!upgrade) return false;

  const currentLevel = getUpgradeLevel(gameState, upgradeId);
  if (currentLevel >= upgrade.maxLevel) return false;

  // Must be researched first
  if (!gameState.research.completed.includes(upgradeId)) return false;

  const cost = getUpgradeCost(upgradeId, currentLevel);
  return gameState.company.cash >= cost;
}

export function purchaseUpgrade(gameState: GameState, upgradeId: string): GameState | null {
  if (!canPurchaseUpgrade(gameState, upgradeId)) return null;

  const upgrade = UPGRADES[upgradeId];
  const currentLevel = getUpgradeLevel(gameState, upgradeId);
  const cost = getUpgradeCost(upgradeId, currentLevel);

  const newState = { ...gameState };
  newState.company.cash -= cost;
  newState.upgrades = {
    ...newState.upgrades,
    [upgradeId]: currentLevel + 1,
  };

  // Apply upgrade effects
  for (const effect of upgrade.effects) {
    if (effect.type === 'unlock_recipe' && effect.target) {
      if (!newState.unlockedRecipes.includes(effect.target)) {
        newState.unlockedRecipes = [...newState.unlockedRecipes, effect.target];
      }
    }
  }

  return newState;
}

export function getUpgradeEffect(
  gameState: GameState,
  effectType: UpgradeEffect['type'],
  target?: string
): number {
  let totalEffect = 0;

  for (const upgradeId of Object.keys(gameState.upgrades)) {
    const level = gameState.upgrades[upgradeId];
    const upgrade = UPGRADES[upgradeId];

    if (!upgrade || level === 0) continue;

    for (const effect of upgrade.effects) {
      if (effect.type === effectType) {
        // Check if effect targets specific item/recipe or is global
        if (!effect.target || effect.target === target || !target) {
          totalEffect += effect.value * level;
        }
      }
    }
  }

  // Special handling for price_floor - return highest floor
  if (effectType === 'price_floor') {
    return totalEffect > 0 ? totalEffect : 0;
  }

  return totalEffect;
}

export function getSellQuantities(gameState: GameState): number[] {
  const quantities = [1]; // Always can sell 1

  if (getUpgradeLevel(gameState, 'sell_quantity_1') > 0) {
    quantities.push(10);
  }
  if (getUpgradeLevel(gameState, 'sell_quantity_2') > 0) {
    quantities.push(100);
  }
  if (getUpgradeLevel(gameState, 'sell_quantity_3') > 0) {
    quantities.push(1000);
  }

  return quantities;
}

export function getProductionSpeedMultiplier(
  gameState: GameState,
  _isAutomation: boolean
): number {
  const speedBonus = getUpgradeEffect(gameState, 'production_speed');
  return 1 + speedBonus;
}
