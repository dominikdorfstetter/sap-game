import { GameState, UpgradeEffect } from '../types/game.types';
import { UPGRADES } from '../data/upgrades';
import { TECH_TREE } from '../data/techTree';

export function getUpgradeLevel(gameState: GameState, upgradeId: string): number {
  return gameState.upgrades[upgradeId] || 0;
}

export function getUpgradeCost(upgradeId: string, currentLevel: number): number {
  const oldUpgrade = UPGRADES[upgradeId];
  const techNode = TECH_TREE[upgradeId];

  if (!oldUpgrade && !techNode) return 0;

  let baseCost = 0;
  let multiplier = 1;

  if (techNode) {
    baseCost = techNode.cost;
    multiplier = techNode.costMultiplier || 1;
  } else if (oldUpgrade) {
    baseCost = oldUpgrade.baseCost;
    multiplier = oldUpgrade.costMultiplier;
  }

  return Math.floor(baseCost * Math.pow(multiplier, currentLevel));
}

export function canPurchaseUpgrade(gameState: GameState, upgradeId: string): boolean {
  const upgrade = UPGRADES[upgradeId] || TECH_TREE[upgradeId];
  if (!upgrade) return false;

  const currentLevel = getUpgradeLevel(gameState, upgradeId);
  if (currentLevel >= upgrade.maxLevel) return false;

  // Must be researched first
  if (!gameState.research.completed.includes(upgradeId)) return false;

  const cost = getUpgradeCost(upgradeId, currentLevel);
  return gameState.company.cash >= cost;
}

export function purchaseUpgrade(gameState: GameState, upgradeId: string): GameState | null {
  const upgrade = UPGRADES[upgradeId] || TECH_TREE[upgradeId];
  if (!upgrade) return null;

  // Must be researched first
  if (!gameState.research.completed.includes(upgradeId)) return null;

  const currentLevel = getUpgradeLevel(gameState, upgradeId);
  if (currentLevel >= upgrade.maxLevel) return null;

  // Calculate cost
  const cost = getUpgradeCost(upgradeId, currentLevel);

  if (gameState.company.cash < cost) return null;

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
    const upgrade = UPGRADES[upgradeId] || TECH_TREE[upgradeId];

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

  // Check old system first
  if (getUpgradeLevel(gameState, 'sell_quantity_1') > 0) {
    quantities.push(10);
  }
  if (getUpgradeLevel(gameState, 'sell_quantity_2') > 0) {
    quantities.push(100);
  }
  if (getUpgradeLevel(gameState, 'sell_quantity_3') > 0) {
    quantities.push(1000);
  }

  // Check new tech tree system
  if (getUpgradeLevel(gameState, 'bulk_trading_1') > 0) {
    if (!quantities.includes(10)) quantities.push(10);
  }
  if (getUpgradeLevel(gameState, 'bulk_trading_2') > 0) {
    if (!quantities.includes(100)) quantities.push(100);
  }
  if (getUpgradeLevel(gameState, 'bulk_trading_3') > 0) {
    if (!quantities.includes(1000)) quantities.push(1000);
  }

  return quantities;
}

export function getProductionSpeedMultiplier(
  gameState: GameState,
  isAutomation: boolean
): number {
  if (isAutomation) {
    const automationBonus = getUpgradeEffect(gameState, 'automation_speed');
    return 1 + automationBonus;
  } else {
    const speedBonus = getUpgradeEffect(gameState, 'production_speed');
    return 1 + speedBonus;
  }
}

export function getCriticalChance(gameState: GameState): number {
  return getUpgradeEffect(gameState, 'critical_chance');
}

export function hasFeatureUnlocked(gameState: GameState, feature: string): boolean {
  for (const upgradeId of Object.keys(gameState.upgrades)) {
    const level = gameState.upgrades[upgradeId];
    const upgrade = UPGRADES[upgradeId] || TECH_TREE[upgradeId];

    if (!upgrade || level === 0) continue;

    for (const effect of upgrade.effects) {
      if (effect.type === 'unlock_feature' && effect.target === feature) {
        return true;
      }
    }
  }
  return false;
}
