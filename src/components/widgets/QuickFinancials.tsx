import { GameState } from '../../types/game.types';
import { getQuarterProgress, getQuarterTimeRemaining, formatTime, getProductivityGrade } from '../../utils/fiscalSystem';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface QuickFinancialsProps {
  gameState: GameState;
  onPayTaxes: () => void;
}

export function QuickFinancials({ gameState, onPayTaxes }: QuickFinancialsProps) {
  const { fiscal } = gameState;
  const quarterProgress = getQuarterProgress(gameState);
  const timeRemaining = getQuarterTimeRemaining(gameState);
  const profit = fiscal.quarterlyRevenue - fiscal.quarterlyExpenses;
  const productivityGrade = getProductivityGrade(fiscal.productivityRating);

  return (
    <div>
      <div style={{ padding: '12px' }}>
        {/* Quarter Info */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
              FY{fiscal.fiscalYear} Q{fiscal.currentQuarter}
            </div>
            <div style={{ fontSize: '11px', color: '#0af' }}>
              {formatTime(timeRemaining)} remaining
            </div>
          </div>
          <ProgressBar progress={quarterProgress} />
        </div>

        {/* Quarterly Performance */}
        <div style={{ marginBottom: '12px', paddingTop: '8px', borderTop: '1px solid #444' }}>
          <table className="erp-table" style={{ fontSize: '11px' }}>
            <tbody>
              <tr>
                <td>Revenue</td>
                <td className="money" style={{ textAlign: 'right' }}>
                  ${fiscal.quarterlyRevenue.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>Expenses</td>
                <td className="money" style={{ textAlign: 'right', color: '#c66' }}>
                  ${fiscal.quarterlyExpenses.toFixed(2)}
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid #444' }}>
                <td style={{ fontWeight: 'bold' }}>Profit</td>
                <td
                  className="money"
                  style={{
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: profit >= 0 ? '#0a0' : '#c60',
                  }}
                >
                  ${profit.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Productivity Rating */}
        <div style={{ marginBottom: '12px', paddingTop: '8px', borderTop: '1px solid #444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#666' }}>Productivity Rating</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0af' }}>{productivityGrade}</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{fiscal.productivityRating}%</div>
            </div>
          </div>
        </div>

        {/* Taxes */}
        {fiscal.taxesOwed > 0 && (
          <div style={{ marginBottom: '8px', paddingTop: '8px', borderTop: '1px solid #444' }}>
            <div style={{ fontSize: '11px', color: '#c60', marginBottom: '4px' }}>⚠️ Taxes Owed</div>
            <div className="money" style={{ fontSize: '16px', fontWeight: 'bold', color: '#c60' }}>
              ${fiscal.taxesOwed.toFixed(2)}
            </div>
            <div style={{ marginTop: '8px' }}>
              <Button
                onClick={onPayTaxes}
                primary
                disabled={gameState.company.cash < fiscal.taxesOwed}
              >
                Pay Taxes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
