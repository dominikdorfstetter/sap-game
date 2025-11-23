import { GameState } from '../../types/game.types';
import { RetroChart, RetroLineChart } from '../ui/RetroChart';

interface QuickAnalyticsProps {
  gameState: GameState;
}

export function QuickAnalytics({ gameState }: QuickAnalyticsProps) {
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
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          {/* Profit Chart */}
          <div>
            <RetroChart
              data={history.profit}
              labels={labels}
              height={120}
              color={history.profit[history.profit.length - 1] >= 0 ? '#0a0' : '#c60'}
              title="Quarterly Profit"
              showValues={true}
            />
          </div>

          {/* Revenue Chart */}
          <div>
            <RetroChart
              data={history.revenue}
              labels={labels}
              height={120}
              color="#0af"
              title="Revenue"
              showValues={true}
            />
          </div>

          {/* Expenses Chart */}
          <div>
            <RetroChart
              data={history.expenses}
              labels={labels}
              height={120}
              color="#c66"
              title="Expenses"
              showValues={true}
            />
          </div>
        </div>

        {/* Productivity Trend - Full Width */}
        <div style={{ marginTop: '24px' }}>
          <RetroLineChart
            data={history.productivity}
            labels={labels}
            height={100}
            color="#fa0"
            title="Productivity Trend"
          />
        </div>
      </div>
    </div>
  );
}
