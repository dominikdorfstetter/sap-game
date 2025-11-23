import { GameState } from '../../types/game.types';
import { ITEMS } from '../../data/items';
import { getCurrentPrice } from '../../utils/marketSystem';
import { getSellQuantities } from '../../utils/upgradeSystem';
import { Button } from '../ui/Button';

interface QuickInventoryProps {
  gameState: GameState;
  onSell: (itemId: string, amount: number) => void;
  onViewDetails: () => void;
}

export function QuickInventory({ gameState, onSell, onViewDetails }: QuickInventoryProps) {
  const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;
  const sellQuantities = getSellQuantities(gameState);

  // Show only items with inventory > 0
  const itemsWithStock = Object.keys(ITEMS).filter((id) => (gameState.inventory[id] || 0) > 0);

  if (itemsWithStock.length === 0) {
    return (
      <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
        No items in inventory
      </div>
    );
  }

  return (
    <div>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table className="erp-table" style={{ fontSize: '12px' }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemsWithStock.slice(0, 5).map((itemId) => {
              const item = ITEMS[itemId];
              const quantity = gameState.inventory[itemId];
              const price = getCurrentPrice(gameState, itemId);

              return (
                <tr key={itemId}>
                  <td style={{ fontWeight: 'bold' }}>{item.name}</td>
                  <td style={{ fontFamily: 'Courier New' }}>{quantity}</td>
                  <td className="money">{formatMoney(price)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {sellQuantities.slice(0, 2).map((qty) => (
                        <Button
                          key={qty}
                          onClick={() => onSell(itemId, Math.min(qty, quantity))}
                          disabled={quantity < 1}
                        >
                          {qty}
                        </Button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {itemsWithStock.length > 5 && (
        <div style={{ padding: '8px', fontSize: '11px', color: '#666', textAlign: 'center' }}>
          +{itemsWithStock.length - 5} more items
        </div>
      )}
      <div style={{ marginTop: '8px', textAlign: 'center' }}>
        <Button onClick={onViewDetails}>View All Inventory</Button>
      </div>
    </div>
  );
}
