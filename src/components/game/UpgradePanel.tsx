import { GameState } from '../../types/game.types';
import { UPGRADES } from '../../data/upgrades';
import { getUpgradeLevel, getUpgradeCost, canPurchaseUpgrade } from '../../utils/upgradeSystem';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';

interface UpgradePanelProps {
  gameState: GameState;
  onPurchase: (upgradeId: string) => void;
}

export function UpgradePanel({ gameState, onPurchase }: UpgradePanelProps) {
  const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

  const upgradesByCategory = {
    selling: Object.values(UPGRADES).filter((u) => u.category === 'selling'),
    market: Object.values(UPGRADES).filter((u) => u.category === 'market'),
    production: Object.values(UPGRADES).filter((u) => u.category === 'production'),
    general: Object.values(UPGRADES).filter((u) => u.category === 'general'),
  };

  const renderUpgradeTable = (upgrades: typeof UPGRADES[string][], title: string) => {
    if (upgrades.length === 0) return null;

    return (
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ marginBottom: '8px', textTransform: 'uppercase', fontSize: '13px' }}>
          {title}
        </h3>
        <table className="sap-table">
          <thead>
            <tr>
              <th>Upgrade</th>
              <th>Level</th>
              <th>Cost</th>
              <th style={{ width: '150px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {upgrades.map((upgrade) => {
              const currentLevel = getUpgradeLevel(gameState, upgrade.id);
              const cost = getUpgradeCost(upgrade.id, currentLevel);
              const affordable = canPurchaseUpgrade(gameState, upgrade.id);
              const maxed = currentLevel >= upgrade.maxLevel;

              return (
                <tr key={upgrade.id}>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{upgrade.name}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {upgrade.description}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'Courier New' }}>
                    {currentLevel} / {upgrade.maxLevel}
                  </td>
                  <td className="money">{maxed ? '-' : formatMoney(cost)}</td>
                  <td>
                    {maxed ? (
                      <span style={{ color: '#FFB600', fontWeight: 'bold' }}>MAX</span>
                    ) : (
                      <Button onClick={() => onPurchase(upgrade.id)} disabled={!affordable}>
                        Buy
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Panel title="Upgrades">
      {renderUpgradeTable(upgradesByCategory.selling, 'Selling Upgrades')}
      {renderUpgradeTable(upgradesByCategory.market, 'Market Upgrades')}
      {renderUpgradeTable(upgradesByCategory.production, 'Production Upgrades')}
      {renderUpgradeTable(upgradesByCategory.general, 'Research & Unlocks')}
    </Panel>
  );
}
