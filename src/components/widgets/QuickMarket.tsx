import { GameState } from '../../types/game.types';
import { ITEMS } from '../../data/items';
import { getCurrentPrice } from '../../utils/marketSystem';
import { Button } from '../ui/Button';

interface QuickMarketProps {
  gameState: GameState;
  onViewDetails: () => void;
}

export function QuickMarket({ gameState, onViewDetails }: QuickMarketProps) {
  const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

  const topItems = ['screw', 'bracket', 'hinge', 'door', 'cabinet'].filter(
    (id) => ITEMS[id]
  );

  return (
    <div>
      <table className="erp-table" style={{ fontSize: '11px' }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {topItems.slice(0, 5).map((itemId) => {
            const item = ITEMS[itemId];
            const price = getCurrentPrice(gameState, itemId);

            return (
              <tr key={itemId}>
                <td>{item.name}</td>
                <td className="money">{formatMoney(price)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: '8px', textAlign: 'center' }}>
        <Button onClick={onViewDetails}>Full Market</Button>
      </div>
    </div>
  );
}
