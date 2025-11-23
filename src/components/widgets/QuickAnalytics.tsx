import { GameState } from '../../types/game.types';
import { RetroChart, RetroLineChart } from '../ui/RetroChart';
import { Button } from '../ui/Button';

interface QuickAnalyticsProps {
  gameState: GameState;
  onViewDetails?: () => void;
}

export function QuickAnalytics({ gameState, onViewDetails }: QuickAnalyticsProps) {
  const { fiscal } = gameState;
  const { history } = fiscal;

  const hasData = history.revenue.length > 0;

  if (!hasData) {
    return (
      <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
        No historical data yet. Complete a quarter to see analytics.
      </div>
    );
  }

  // Generate quarter labels (Q1, Q2, Q3, Q4, Q1...)
  const labels = history.revenue.map((_, index) => {
    const quarter = (index % 4) + 1;
    return `Q${quarter}`;
  });

  return (
    <div>
      <div style={{ padding: '8px' }}>
        {/* Profit Chart */}
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #444' }}>
          <RetroChart
            data={history.profit}
            labels={labels}
            height={80}
            color={history.profit[history.profit.length - 1] >= 0 ? '#0a0' : '#c60'}
            title="Quarterly Profit"
          />
        </div>

        {/* Revenue vs Expenses */}
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #444' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#0af', padding: '0 8px' }}>
            Revenue & Expenses
          </div>
          <div style={{ display: 'flex', gap: '4px', padding: '0 8px' }}>
            <div style={{ flex: 1 }}>
              <RetroChart data={history.revenue} labels={labels} height={60} color="#0af" />
            </div>
            <div style={{ flex: 1 }}>
              <RetroChart data={history.expenses} labels={labels} height={60} color="#c66" />
            </div>
          </div>
        </div>

        {/* Productivity Trend */}
        <div style={{ marginBottom: '8px' }}>
          <RetroLineChart
            data={history.productivity}
            labels={labels}
            height={70}
            color="#fa0"
            title="Productivity Trend"
          />
        </div>
      </div>

      {onViewDetails && (
        <div style={{ padding: '0 12px 12px', textAlign: 'center' }}>
          <Button onClick={onViewDetails}>Detailed Analytics</Button>
        </div>
      )}
    </div>
  );
}
