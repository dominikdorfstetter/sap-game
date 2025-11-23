import { useEffect, useState } from 'preact/hooks';
import { GameState } from '../../types/game.types';
import { ITEMS } from '../../data/items';
import { RECIPES } from '../../data/recipes';
import { purchaseMachine } from '../../utils/productionSystem';
import { getCurrentPrice, adjustDemand } from '../../utils/marketSystem';
import { purchaseUpgrade, getSellQuantities } from '../../utils/upgradeSystem';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { MachinePanel } from '../game/MachinePanel';
import { UpgradePanel } from '../game/UpgradePanel';
import { MarketPanel } from '../game/MarketPanel';

interface ProductionScreenProps {
  gameState: GameState;
  onUpdateState: (state: GameState) => void;
}

export function ProductionScreen({ gameState, onUpdateState }: ProductionScreenProps) {
  const [activeProduction, setActiveProduction] = useState<{
    recipeId: string;
    startTime: number;
    duration: number;
  } | null>(null);
  const [productionProgress, setProductionProgress] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'production' | 'market' | 'upgrades'>('production');

  // Handle manual production
  const startProduction = (recipeId: string) => {
    const recipe = RECIPES[recipeId];

    // Check if we have all required inputs
    for (const input of recipe.inputs) {
      const currentAmount = gameState.inventory[input.itemId] || 0;
      if (currentAmount < input.amount) {
        return; // Not enough materials
      }
    }

    setActiveProduction({
      recipeId,
      startTime: Date.now(),
      duration: recipe.productionTime,
    });
    setProductionProgress(0);
  };

  // Update progress bar
  useEffect(() => {
    if (!activeProduction) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - activeProduction.startTime;
      const progress = (elapsed / activeProduction.duration) * 100;

      if (progress >= 100) {
        // Production complete!
        completeProduction(activeProduction.recipeId);
        setActiveProduction(null);
        setProductionProgress(0);
      } else {
        setProductionProgress(progress);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [activeProduction]);

  const completeProduction = (recipeId: string) => {
    const recipe = RECIPES[recipeId];
    const newState = { ...gameState };

    // Consume all inputs
    for (const input of recipe.inputs) {
      newState.inventory[input.itemId] -= input.amount;
    }

    // Add output
    newState.inventory[recipe.output.itemId] =
      (newState.inventory[recipe.output.itemId] || 0) + recipe.output.amount;

    onUpdateState(newState);
  };

  const sellItem = (itemId: string, amount: number) => {
    const currentAmount = gameState.inventory[itemId] || 0;
    if (currentAmount < amount) return;

    const price = getCurrentPrice(gameState, itemId);
    let newState = { ...gameState };

    newState.inventory[itemId] -= amount;
    newState.company.cash += price * amount;

    // Adjust market demand based on quantity sold
    newState = adjustDemand(newState, itemId, amount);

    onUpdateState(newState);
  };

  const handlePurchaseMachine = (machineId: string) => {
    const newState = purchaseMachine(gameState, machineId);
    if (newState) {
      onUpdateState(newState);
    }
  };

  const handlePurchaseUpgrade = (upgradeId: string) => {
    const newState = purchaseUpgrade(gameState, upgradeId);
    if (newState) {
      onUpdateState(newState);
    }
  };

  const formatMoney = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const canProduce = (recipeId: string) => {
    if (activeProduction) return false;

    const recipe = RECIPES[recipeId];
    for (const input of recipe.inputs) {
      const currentAmount = gameState.inventory[input.itemId] || 0;
      if (currentAmount < input.amount) return false;
    }
    return true;
  };

  const getRecipeInputsDisplay = (recipeId: string): string => {
    const recipe = RECIPES[recipeId];
    if (recipe.inputs.length === 0) return '-';

    return recipe.inputs
      .map((input) => `${input.amount}x ${ITEMS[input.itemId].name}`)
      .join(', ');
  };

  const unlockedRecipes = Object.values(RECIPES).filter(
    (recipe) => gameState.unlockedRecipes.includes(recipe.id) || recipe.unlocked
  );

  const sellQuantities = getSellQuantities(gameState);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E5E5E5' }}>
      {/* Header */}
      <div className="sap-header">
        <div className="sap-header-title">
          SAP Production Manager | {gameState.company.name}
        </div>
        <div className="sap-header-info">
          Cash: <span className="money">{formatMoney(gameState.company.cash)}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ padding: '8px 16px', backgroundColor: '#CCC', borderBottom: '2px solid #666' }}>
        <Button
          onClick={() => setSelectedTab('production')}
          primary={selectedTab === 'production'}
        >
          Production
        </Button>
        <Button
          onClick={() => setSelectedTab('market')}
          primary={selectedTab === 'market'}
        >
          Market
        </Button>
        <Button
          onClick={() => setSelectedTab('upgrades')}
          primary={selectedTab === 'upgrades'}
        >
          Upgrades
        </Button>
      </div>

      <div style={{ padding: '16px' }}>
        {selectedTab === 'production' && (
          <>
            {/* Manual Production Section */}
            <Panel title="Manual Production">
              <div style={{ marginBottom: '16px' }}>
                <table className="sap-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Inputs Required</th>
                      <th>Output</th>
                      <th>Time</th>
                      <th style={{ width: '120px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unlockedRecipes.map((recipe) => (
                      <tr key={recipe.id}>
                        <td>{recipe.name}</td>
                        <td style={{ fontSize: '11px' }}>{getRecipeInputsDisplay(recipe.id)}</td>
                        <td>
                          {recipe.output.amount}x {ITEMS[recipe.output.itemId].name}
                        </td>
                        <td>{(recipe.productionTime / 1000).toFixed(1)}s</td>
                        <td>
                          <Button
                            onClick={() => startProduction(recipe.id)}
                            disabled={!canProduce(recipe.id)}
                          >
                            Craft
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {activeProduction && (
                <div>
                  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                    Producing: {RECIPES[activeProduction.recipeId].name}
                  </div>
                  <ProgressBar progress={productionProgress} />
                </div>
              )}
            </Panel>

            {/* Machine Automation */}
            <MachinePanel gameState={gameState} onPurchase={handlePurchaseMachine} />

            {/* Inventory Section */}
            <Panel title="Inventory & Selling">
              <table className="sap-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Market Price</th>
                    <th>Total Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(ITEMS).map((itemId) => {
                    const item = ITEMS[itemId];
                    const quantity = gameState.inventory[itemId] || 0;
                    const price = getCurrentPrice(gameState, itemId);
                    const totalValue = quantity * price;

                    return (
                      <tr key={itemId}>
                        <td>
                          <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                          <div style={{ fontSize: '10px', color: '#666' }}>
                            Tier {item.tier}
                          </div>
                        </td>
                        <td style={{ fontFamily: 'Courier New', textAlign: 'right' }}>
                          {quantity}
                        </td>
                        <td className="money">{formatMoney(price)}</td>
                        <td className="money">{formatMoney(totalValue)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {sellQuantities.map((qty) => (
                              <Button
                                key={qty}
                                onClick={() => sellItem(itemId, Math.min(qty, quantity))}
                                disabled={quantity < 1}
                              >
                                Sell {qty}
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Panel>
          </>
        )}

        {selectedTab === 'market' && <MarketPanel gameState={gameState} />}

        {selectedTab === 'upgrades' && (
          <UpgradePanel gameState={gameState} onPurchase={handlePurchaseUpgrade} />
        )}
      </div>
    </div>
  );
}
