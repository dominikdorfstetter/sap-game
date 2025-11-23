import { GameState } from '../../types/game.types';
import { UPGRADES } from '../../data/upgrades';
import { RESEARCH_TIMES } from '../../data/staff';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface ResearchPanelProps {
  gameState: GameState;
  onStartResearch: (upgradeId: string) => void;
}

export function ResearchPanel({ gameState, onStartResearch }: ResearchPanelProps) {
  const availableInterns = gameState.staff.filter((s) => {
    const staffType = s.staffTypeId;
    return staffType === 'intern';
  }).length;

  const upgradesByCategory = {
    selling: Object.values(UPGRADES).filter((u) => u.category === 'selling'),
    market: Object.values(UPGRADES).filter((u) => u.category === 'market'),
    production: Object.values(UPGRADES).filter((u) => u.category === 'production'),
    general: Object.values(UPGRADES).filter((u) => u.category === 'general'),
  };

  const renderResearchTable = (upgrades: typeof UPGRADES[string][], title: string) => {
    if (upgrades.length === 0) return null;

    return (
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ marginBottom: '8px', textTransform: 'uppercase', fontSize: '13px' }}>
          {title}
        </h3>
        <table className="erp-table">
          <thead>
            <tr>
              <th>Upgrade</th>
              <th>Research Time</th>
              <th>Status</th>
              <th style={{ width: '150px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {upgrades.map((upgrade) => {
              const isResearched = gameState.research.completed.includes(upgrade.id);
              const isResearching =
                gameState.research.current?.upgradeId === upgrade.id;
              const researchTime = RESEARCH_TIMES[upgrade.id] || 60;

              return (
                <tr key={upgrade.id}>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{upgrade.name}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {upgrade.description}
                    </div>
                  </td>
                  <td>{researchTime}s (1 intern)</td>
                  <td>
                    {isResearched && (
                      <span style={{ color: '#006600', fontWeight: 'bold' }}>✓ Complete</span>
                    )}
                    {isResearching && (
                      <span style={{ color: '#FFB600', fontWeight: 'bold' }}>⟳ Researching</span>
                    )}
                    {!isResearched && !isResearching && (
                      <span style={{ color: '#999' }}>Not Started</span>
                    )}
                  </td>
                  <td>
                    {!isResearched && !isResearching && (
                      <Button
                        onClick={() => onStartResearch(upgrade.id)}
                        disabled={availableInterns === 0 || gameState.research.current !== null}
                      >
                        Research
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
    <div>
      <Panel title="Research Lab">
        <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#E3F2FD', border: '1px solid #003366' }}>
          <div><strong>Available Interns:</strong> {availableInterns}</div>
          {availableInterns === 0 && (
            <div style={{ fontSize: '11px', color: '#CC0000', marginTop: '4px' }}>
              ⚠ Hire interns to conduct research!
            </div>
          )}
          {gameState.research.current && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Researching: {UPGRADES[gameState.research.current.upgradeId].name}
              </div>
              <div style={{ fontSize: '11px', marginBottom: '4px' }}>
                Researchers: {gameState.research.current.researchersAssigned}
              </div>
              <ProgressBar progress={gameState.research.current.progress} />
            </div>
          )}
        </div>

        {renderResearchTable(upgradesByCategory.selling, 'Selling Research')}
        {renderResearchTable(upgradesByCategory.market, 'Market Research')}
        {renderResearchTable(upgradesByCategory.production, 'Production Research')}
        {renderResearchTable(upgradesByCategory.general, 'Technology Research')}
      </Panel>
    </div>
  );
}
