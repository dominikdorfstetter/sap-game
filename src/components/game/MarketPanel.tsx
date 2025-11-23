import { GameState } from '../../types/game.types';
import { ITEMS } from '../../data/items';
import { getCurrentPrice } from '../../utils/marketSystem';
import { Panel } from '../ui/Panel';

interface MarketPanelProps {
  gameState: GameState;
}

export function MarketPanel({ gameState }: MarketPanelProps) {
  const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

  const getPriceChange = (itemId: string): string => {
    const history = gameState.market.priceHistory[itemId] || [];
    if (history.length < 2) return '';

    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    const change = ((current - previous) / previous) * 100;

    if (Math.abs(change) < 0.1) return '→';
    if (change > 0) return `↑ ${change.toFixed(1)}%`;
    return `↓ ${Math.abs(change).toFixed(1)}%`;
  };

  const getPriceColor = (itemId: string): string => {
    const history = gameState.market.priceHistory[itemId] || [];
    if (history.length < 2) return '#000000';

    const current = history[history.length - 1];
    const previous = history[history.length - 2];

    if (current > previous) return '#006600'; // Green for up
    if (current < previous) return '#CC0000'; // Red for down
    return '#666666'; // Gray for stable
  };

  const getDemandIndicator = (itemId: string): string => {
    const demand = gameState.market.demandModifiers[itemId] || 1.0;
    if (demand >= 1.2) return 'Very High';
    if (demand >= 1.1) return 'High';
    if (demand >= 0.95) return 'Normal';
    if (demand >= 0.8) return 'Low';
    return 'Very Low';
  };

  return (
    <Panel title="Market - Current Prices">
      <table className="erp-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Base Price</th>
            <th>Current Price</th>
            <th>Change</th>
            <th>Demand</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(ITEMS).map((itemId) => {
            const item = ITEMS[itemId];
            const currentPrice = getCurrentPrice(gameState, itemId);
            const priceChange = getPriceChange(itemId);
            const priceColor = getPriceColor(itemId);
            const demand = getDemandIndicator(itemId);

            return (
              <tr key={itemId}>
                <td style={{ fontWeight: 'bold' }}>{item.name}</td>
                <td className="money">{formatMoney(item.basePrice)}</td>
                <td className="money" style={{ color: priceColor, fontWeight: 'bold' }}>
                  {formatMoney(currentPrice)}
                </td>
                <td style={{ color: priceColor, fontSize: '11px' }}>{priceChange}</td>
                <td style={{ fontSize: '11px' }}>{demand}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: '12px', fontSize: '11px', color: '#666' }}>
        * Prices update every 30 seconds based on market demand
      </div>
    </Panel>
  );
}
