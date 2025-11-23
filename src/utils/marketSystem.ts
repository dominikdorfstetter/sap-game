import { GameState, MarketState } from '../types/game.types';
import { ITEMS } from '../data/items';
import { getUpgradeEffect } from './upgradeSystem';

export function initializeMarket(): MarketState {
  const prices: { [key: string]: number } = {};
  const demandModifiers: { [key: string]: number } = {};
  const priceHistory: { [key: string]: number[] } = {};

  for (const itemId of Object.keys(ITEMS)) {
    prices[itemId] = ITEMS[itemId].basePrice;
    demandModifiers[itemId] = 1.0;
    priceHistory[itemId] = [ITEMS[itemId].basePrice];
  }

  return {
    prices,
    priceHistory,
    demandModifiers,
    lastPriceUpdate: Date.now(),
  };
}

export function updateMarketPrices(gameState: GameState): GameState {
  const newState = { ...gameState };
  const now = Date.now();

  // Update prices every 30 seconds
  if (now - newState.market.lastPriceUpdate < 30000) {
    return newState;
  }

  const newPrices = { ...newState.market.prices };
  const newHistory = { ...newState.market.priceHistory };

  for (const itemId of Object.keys(ITEMS)) {
    const basePrice = ITEMS[itemId].basePrice;
    const currentDemand = newState.market.demandModifiers[itemId] || 1.0;

    // Random price fluctuation: ±15%
    const randomFluctuation = 0.85 + Math.random() * 0.3;

    // Calculate new price with demand modifier
    let newPrice = basePrice * currentDemand * randomFluctuation;

    // Apply market bonus upgrades
    const marketBonus = getUpgradeEffect(gameState, 'market_bonus');
    newPrice *= 1 + marketBonus;

    // Apply price floor upgrades
    const priceFloor = getUpgradeEffect(gameState, 'price_floor', itemId);
    const minPrice = basePrice * priceFloor;
    if (newPrice < minPrice) {
      newPrice = minPrice;
    }

    newPrices[itemId] = Math.max(0.1, newPrice);

    // Update history (keep last 10 points)
    const history = [...(newHistory[itemId] || []), newPrices[itemId]];
    if (history.length > 10) {
      history.shift();
    }
    newHistory[itemId] = history;
  }

  newState.market = {
    ...newState.market,
    prices: newPrices,
    priceHistory: newHistory,
    lastPriceUpdate: now,
  };

  return newState;
}

export function getCurrentPrice(gameState: GameState, itemId: string): number {
  return gameState.market.prices[itemId] || ITEMS[itemId]?.basePrice || 0;
}

export function adjustDemand(
  gameState: GameState,
  itemId: string,
  soldQuantity: number
): GameState {
  const newState = { ...gameState };

  // Selling items decreases demand slightly
  const currentDemand = newState.market.demandModifiers[itemId] || 1.0;
  const demandDecrease = soldQuantity * 0.001; // 0.1% decrease per item sold
  const newDemand = Math.max(0.5, currentDemand - demandDecrease);

  newState.market.demandModifiers[itemId] = newDemand;

  // Demand slowly recovers over time (handled in game tick)
  return newState;
}

export function recoverDemand(gameState: GameState): GameState {
  const newState = { ...gameState };
  const newDemandModifiers = { ...newState.market.demandModifiers };

  for (const itemId of Object.keys(newDemandModifiers)) {
    const current = newDemandModifiers[itemId];
    // Recover 1% towards 1.0 each tick
    if (current < 1.0) {
      newDemandModifiers[itemId] = Math.min(1.0, current + 0.01);
    } else if (current > 1.0) {
      newDemandModifiers[itemId] = Math.max(1.0, current - 0.01);
    }
  }

  newState.market.demandModifiers = newDemandModifiers;
  return newState;
}
