import { useEffect, useState } from 'preact/hooks';
import { GameState, DashboardWidget } from '../../types/game.types';
import { ITEMS } from '../../data/items';
import { RECIPES } from '../../data/recipes';
import { MACHINES } from '../../data/machines';
import { UPGRADES } from '../../data/upgrades';
import { purchaseMachine } from '../../utils/productionSystem';
import { getCurrentPrice, adjustDemand } from '../../utils/marketSystem';
import { purchaseUpgrade, getSellQuantities } from '../../utils/upgradeSystem';
import { scoutTalent, hireFromScout, dismissScout, fireStaff, assignStaffToRecipe, startResearch } from '../../utils/staffSystem';
import { recordRevenue, recordExpense, payTaxes } from '../../utils/fiscalSystem';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Modal } from '../ui/Modal';
import { QuickActions } from '../widgets/QuickActions';
import { QuickInventory } from '../widgets/QuickInventory';
import { QuickMachines } from '../widgets/QuickMachines';
import { QuickMarket } from '../widgets/QuickMarket';
import { QuickStaff } from '../widgets/QuickStaff';
import { QuickResearch } from '../widgets/QuickResearch';
import { QuickFinancials } from '../widgets/QuickFinancials';
import { QuickAnalytics } from '../widgets/QuickAnalytics';
import { MachinePanel } from '../game/MachinePanel';
import { UpgradePanel } from '../game/UpgradePanel';
import { MarketPanel } from '../game/MarketPanel';
import { StaffPanel } from '../game/StaffPanel';
import { ResearchPanel } from '../game/ResearchPanel';

interface ProductionScreenProps {
  gameState: GameState;
  onUpdateState: (state: GameState) => void;
}

type ModalView = 'production' | 'machines' | 'market' | 'upgrades' | 'inventory' | 'customize' | 'staff' | 'research' | null;

export function ProductionScreen({ gameState, onUpdateState }: ProductionScreenProps) {
  const [activeProduction, setActiveProduction] = useState<{
    recipeId: string;
    startTime: number;
    duration: number;
  } | null>(null);
  const [productionProgress, setProductionProgress] = useState(0);
  const [modalView, setModalView] = useState<ModalView>(null);

  // Handle manual production
  const startProduction = (recipeId: string) => {
    const recipe = RECIPES[recipeId];

    for (const input of recipe.inputs) {
      const currentAmount = gameState.inventory[input.itemId] || 0;
      if (currentAmount < input.amount) {
        return;
      }
    }

    setActiveProduction({
      recipeId,
      startTime: Date.now(),
      duration: recipe.productionTime,
    });
    setProductionProgress(0);
  };

  useEffect(() => {
    if (!activeProduction) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - activeProduction.startTime;
      const progress = (elapsed / activeProduction.duration) * 100;

      if (progress >= 100) {
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

    for (const input of recipe.inputs) {
      newState.inventory[input.itemId] -= input.amount;
    }

    newState.inventory[recipe.output.itemId] =
      (newState.inventory[recipe.output.itemId] || 0) + recipe.output.amount;

    onUpdateState(newState);
  };

  const sellItem = (itemId: string, amount: number) => {
    const currentAmount = gameState.inventory[itemId] || 0;
    if (currentAmount < amount) return;

    const price = getCurrentPrice(gameState, itemId);
    const revenue = price * amount;
    let newState = { ...gameState };

    newState.inventory[itemId] -= amount;
    newState.company.cash += revenue;
    newState = adjustDemand(newState, itemId, amount);
    newState = recordRevenue(newState, revenue);

    onUpdateState(newState);
  };

  const handlePurchaseMachine = (machineId: string) => {
    const machine = MACHINES[machineId];
    let newState = purchaseMachine(gameState, machineId);
    if (newState && machine) {
      // Record machine purchase as expense
      newState = recordExpense(newState, machine.cost);
      onUpdateState(newState);
    }
  };

  const handlePurchaseUpgrade = (upgradeId: string) => {
    let newState = purchaseUpgrade(gameState, upgradeId);
    if (newState) {
      // Record upgrade cost as expense
      const upgrade = UPGRADES[upgradeId];
      if (upgrade) {
        const currentLevel = gameState.upgrades[upgradeId] || 0;
        const cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel - 1);
        newState = recordExpense(newState, cost);
      }
      onUpdateState(newState);
    }
  };

  const handleScoutTalent = () => {
    const newState = scoutTalent(gameState);
    if (newState) {
      onUpdateState(newState);
    }
  };

  const handleHireFromScout = (candidateId: string) => {
    const newState = hireFromScout(gameState, candidateId);
    if (newState) {
      onUpdateState(newState);
    }
  };

  const handleDismissScout = () => {
    const newState = dismissScout(gameState);
    onUpdateState(newState);
  };

  const handleFireStaff = (staffId: string) => {
    const newState = fireStaff(gameState, staffId);
    onUpdateState(newState);
  };

  const handleAssignStaff = (staffId: string, recipeId: string | null) => {
    const newState = assignStaffToRecipe(gameState, staffId, recipeId);
    onUpdateState(newState);
  };

  const handleStartResearch = (upgradeId: string) => {
    const newState = startResearch(gameState, upgradeId);
    if (newState) {
      onUpdateState(newState);
    }
  };

  const handlePayTaxes = () => {
    const newState = payTaxes(gameState);
    if (newState) {
      onUpdateState(newState);
    }
  };

  const toggleWidget = (widget: DashboardWidget) => {
    const newState = { ...gameState };
    const pinned = newState.preferences.pinnedWidgets;

    if (pinned.includes(widget)) {
      newState.preferences.pinnedWidgets = pinned.filter((w) => w !== widget);
    } else {
      newState.preferences.pinnedWidgets = [...pinned, widget];
    }

    onUpdateState(newState);
  };

  const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

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

  const pinnedWidgets = gameState.preferences.pinnedWidgets;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E5E5E5' }}>
      {/* Header */}
      <div className="erp-header">
        <div className="erp-header-title">ERP Production Manager | {gameState.company.name}</div>
        <div className="erp-header-info">
          Cash: <span className="money">{formatMoney(gameState.company.cash)}</span>
          <button
            onClick={() => setModalView('customize')}
            style={{
              marginLeft: '16px',
              background: 'none',
              border: '1px solid white',
              color: 'white',
              padding: '4px 12px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            ⚙ Customize
          </button>
        </div>
      </div>

      {/* Bento Box Dashboard */}
      <div style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridAutoRows: 'minmax(180px, auto)',
            gap: '16px',
          }}
        >
          {pinnedWidgets.includes('quickActions') && (
            <div style={{ gridColumn: 'span 2' }}>
              <Panel title="Quick Actions">
                <QuickActions
                  onOpenProduction={() => setModalView('production')}
                  onOpenMarket={() => setModalView('market')}
                  onOpenUpgrades={() => setModalView('upgrades')}
                  onOpenMachines={() => setModalView('machines')}
                  onOpenStaff={() => setModalView('staff')}
                  onOpenResearch={() => setModalView('research')}
                />
              </Panel>
            </div>
          )}

          {pinnedWidgets.includes('inventory') && (
            <div style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
              <Panel title="Inventory">
                <QuickInventory
                  gameState={gameState}
                  onSell={sellItem}
                  onViewDetails={() => setModalView('inventory')}
                />
              </Panel>
            </div>
          )}

          {pinnedWidgets.includes('machines') && (
            <div style={{ gridColumn: 'span 2' }}>
              <Panel title="Machines">
                <QuickMachines gameState={gameState} onViewDetails={() => setModalView('machines')} />
              </Panel>
            </div>
          )}

          {pinnedWidgets.includes('market') && (
            <div style={{ gridColumn: 'span 2' }}>
              <Panel title="Market Prices">
                <QuickMarket gameState={gameState} onViewDetails={() => setModalView('market')} />
              </Panel>
            </div>
          )}

          {pinnedWidgets.includes('staff') && (
            <div style={{ gridColumn: 'span 3' }}>
              <Panel title="Staff">
                <QuickStaff gameState={gameState} onViewDetails={() => setModalView('staff')} />
              </Panel>
            </div>
          )}

          {pinnedWidgets.includes('research') && (
            <div style={{ gridColumn: 'span 2' }}>
              <Panel title="Research">
                <QuickResearch gameState={gameState} onViewDetails={() => setModalView('research')} />
              </Panel>
            </div>
          )}

          {pinnedWidgets.includes('financials') && (
            <div style={{ gridColumn: 'span 3', gridRow: 'span 2' }}>
              <Panel title="Fiscal Overview">
                <QuickFinancials gameState={gameState} onPayTaxes={handlePayTaxes} />
              </Panel>
            </div>
          )}

          {pinnedWidgets.includes('analytics') && (
            <div style={{ gridColumn: '1 / -1' }}>
              <Panel title="Analytics">
                <QuickAnalytics gameState={gameState} />
              </Panel>
            </div>
          )}

          {pinnedWidgets.includes('production') && activeProduction && (
            <div style={{ gridColumn: 'span 2' }}>
              <Panel title="Current Production">
                <div>
                  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                    {RECIPES[activeProduction.recipeId].name}
                  </div>
                  <ProgressBar progress={productionProgress} />
                </div>
              </Panel>
            </div>
          )}
        </div>

        {pinnedWidgets.length === 0 && (
          <Panel title="Welcome">
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <p style={{ marginBottom: '16px' }}>
                Your dashboard is empty. Click <strong>⚙ Customize</strong> in the header to pin widgets.
              </p>
              <Button onClick={() => setModalView('customize')} primary>
                Customize Dashboard
              </Button>
            </div>
          </Panel>
        )}
      </div>

      {/* Modals */}
      {modalView === 'production' && (
        <Modal title="Production" onClose={() => setModalView(null)} width="900px">
          <table className="erp-table">
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
                      onClick={() => {
                        startProduction(recipe.id);
                        setModalView(null);
                      }}
                      disabled={!canProduce(recipe.id)}
                    >
                      Craft
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}

      {modalView === 'inventory' && (
        <Modal title="Full Inventory" onClose={() => setModalView(null)} width="900px">
          <table className="erp-table">
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
                      <div style={{ fontSize: '10px', color: '#666' }}>Tier {item.tier}</div>
                    </td>
                    <td style={{ fontFamily: 'Courier New', textAlign: 'right' }}>{quantity}</td>
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
        </Modal>
      )}

      {modalView === 'machines' && (
        <Modal title="Machines & Automation" onClose={() => setModalView(null)} width="900px">
          <MachinePanel gameState={gameState} onPurchase={handlePurchaseMachine} />
        </Modal>
      )}

      {modalView === 'market' && (
        <Modal title="Market Prices" onClose={() => setModalView(null)} width="900px">
          <MarketPanel gameState={gameState} />
        </Modal>
      )}

      {modalView === 'upgrades' && (
        <Modal title="Upgrades" onClose={() => setModalView(null)} width="900px">
          <UpgradePanel gameState={gameState} onPurchase={handlePurchaseUpgrade} />
        </Modal>
      )}

      {modalView === 'customize' && (
        <Modal title="Customize Dashboard" onClose={() => setModalView(null)} width="600px">
          <div>
            <p style={{ marginBottom: '16px' }}>
              Pin widgets to your dashboard for quick access. Click deeper functionality when needed.
            </p>
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Widget</th>
                  <th>Description</th>
                  <th style={{ width: '100px' }}>Pinned</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Quick Actions</td>
                  <td>Fast access buttons to all main features</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={pinnedWidgets.includes('quickActions')}
                      onChange={() => toggleWidget('quickActions')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Inventory</td>
                  <td>Top items with quick sell buttons</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={pinnedWidgets.includes('inventory')}
                      onChange={() => toggleWidget('inventory')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Machines</td>
                  <td>Active machine status and progress</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={pinnedWidgets.includes('machines')}
                      onChange={() => toggleWidget('machines')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Market</td>
                  <td>Current market prices overview</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={pinnedWidgets.includes('market')}
                      onChange={() => toggleWidget('market')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Production</td>
                  <td>Shows progress when crafting manually</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={pinnedWidgets.includes('production')}
                      onChange={() => toggleWidget('production')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Staff</td>
                  <td>Staff overview with utilization stats</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={pinnedWidgets.includes('staff')}
                      onChange={() => toggleWidget('staff')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Research</td>
                  <td>Current research progress and intern count</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={pinnedWidgets.includes('research')}
                      onChange={() => toggleWidget('research')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Financials</td>
                  <td>Quarterly performance, taxes, and productivity</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={pinnedWidgets.includes('financials')}
                      onChange={() => toggleWidget('financials')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Analytics</td>
                  <td>Historical charts and performance trends</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={pinnedWidgets.includes('analytics')}
                      onChange={() => toggleWidget('analytics')}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {modalView === 'staff' && (
        <Modal title="Staff Management" onClose={() => setModalView(null)} width="1200px">
          <StaffPanel
            gameState={gameState}
            onScoutTalent={handleScoutTalent}
            onHireFromScout={handleHireFromScout}
            onDismissScout={handleDismissScout}
            onFire={handleFireStaff}
            onAssign={handleAssignStaff}
          />
        </Modal>
      )}

      {modalView === 'research' && (
        <Modal title="Research Lab" onClose={() => setModalView(null)} width="900px">
          <ResearchPanel gameState={gameState} onStartResearch={handleStartResearch} />
        </Modal>
      )}
    </div>
  );
}
