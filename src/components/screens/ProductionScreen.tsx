import { useEffect, useState } from 'preact/hooks';
import { GameState } from '../../types/game.types';
import { ITEMS } from '../../data/items';
import { RECIPES } from '../../data/recipes';
import { purchaseMachine } from '../../utils/productionSystem';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { MachinePanel } from '../game/MachinePanel';

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

  // Handle manual production
  const startProduction = (recipeId: string) => {
    const recipe = RECIPES[recipeId];

    // Check if we have required input
    if (recipe.input) {
      const currentAmount = gameState.inventory[recipe.input.itemId] || 0;
      if (currentAmount < recipe.input.amount) {
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

    // Consume input
    if (recipe.input) {
      newState.inventory[recipe.input.itemId] -= recipe.input.amount;
    }

    // Add output
    newState.inventory[recipe.output.itemId] =
      (newState.inventory[recipe.output.itemId] || 0) + recipe.output.amount;

    onUpdateState(newState);
  };

  const sellItem = (itemId: string, amount: number) => {
    const item = ITEMS[itemId];
    const currentAmount = gameState.inventory[itemId] || 0;

    if (currentAmount < amount) return;

    const newState = { ...gameState };
    newState.inventory[itemId] -= amount;
    newState.company.cash += item.basePrice * amount;

    onUpdateState(newState);
  };

  const sellAll = (itemId: string) => {
    const amount = gameState.inventory[itemId] || 0;
    if (amount > 0) {
      sellItem(itemId, amount);
    }
  };

  const formatMoney = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const canProduce = (recipeId: string) => {
    if (activeProduction) return false;

    const recipe = RECIPES[recipeId];
    if (!recipe.input) return true;

    const currentAmount = gameState.inventory[recipe.input.itemId] || 0;
    return currentAmount >= recipe.input.amount;
  };

  const handlePurchaseMachine = (machineId: string) => {
    const newState = purchaseMachine(gameState, machineId);
    if (newState) {
      onUpdateState(newState);
    }
  };

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

      <div style={{ padding: '16px' }}>
        {/* Manual Production Section */}
        <Panel title="Manual Production">
          <div style={{ marginBottom: '16px' }}>
            <table className="sap-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Input</th>
                  <th>Output</th>
                  <th>Time</th>
                  <th style={{ width: '150px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{RECIPES.mine_ore.name}</td>
                  <td>-</td>
                  <td>{ITEMS.ore.name}</td>
                  <td>1.0s</td>
                  <td>
                    <Button
                      onClick={() => startProduction('mine_ore')}
                      disabled={!canProduce('mine_ore')}
                    >
                      Mine
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>{RECIPES.smelt_ingot.name}</td>
                  <td>1x {ITEMS.ore.name}</td>
                  <td>{ITEMS.ingot.name}</td>
                  <td>2.0s</td>
                  <td>
                    <Button
                      onClick={() => startProduction('smelt_ingot')}
                      disabled={!canProduce('smelt_ingot')}
                    >
                      Smelt
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>{RECIPES.craft_screw.name}</td>
                  <td>1x {ITEMS.ingot.name}</td>
                  <td>{ITEMS.screw.name}</td>
                  <td>3.0s</td>
                  <td>
                    <Button
                      onClick={() => startProduction('craft_screw')}
                      disabled={!canProduce('craft_screw')}
                    >
                      Craft
                    </Button>
                  </td>
                </tr>
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

        {/* Inventory Section */}
        <Panel title="Inventory">
          <table className="sap-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Value</th>
                <th style={{ width: '150px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(ITEMS).map((itemId) => {
                const item = ITEMS[itemId];
                const quantity = gameState.inventory[itemId] || 0;
                const totalValue = quantity * item.basePrice;

                return (
                  <tr key={itemId}>
                    <td>{item.name}</td>
                    <td style={{ fontFamily: 'Courier New', textAlign: 'right' }}>
                      {quantity}
                    </td>
                    <td className="money">{formatMoney(item.basePrice)}</td>
                    <td className="money">{formatMoney(totalValue)}</td>
                    <td>
                      <Button
                        onClick={() => sellAll(itemId)}
                        disabled={quantity === 0}
                      >
                        Sell All
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        {/* Machine Purchase and Automation Section */}
        <MachinePanel gameState={gameState} onPurchase={handlePurchaseMachine} />

        {/* Statistics Section */}
        <Panel title="Company Statistics">
          <div style={{ fontFamily: 'Courier New' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Company Name:</strong> {gameState.company.name}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Founded:</strong> {new Date(gameState.company.founded).toLocaleString()}
            </div>
            <div>
              <strong>Current Cash:</strong>{' '}
              <span className="money">{formatMoney(gameState.company.cash)}</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
