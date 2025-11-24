import { GameState } from '../../types/game.types';
import { TECH_TREE } from '../../data/techTree';
import { STAFF_TYPES } from '../../data/staff';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface TechTreePanelProps {
  gameState: GameState;
  onStartResearch: (techId: string) => void;
  onPurchaseTech: (techId: string) => void;
}

export function TechTreePanel({ gameState, onStartResearch, onPurchaseTech }: TechTreePanelProps) {
  const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

  const availableInterns = gameState.staff.filter(
    (s) => STAFF_TYPES[s.staffTypeId].specialty === 'research'
  ).length;

  const isResearched = (techId: string) => gameState.research.completed.includes(techId);
  const isResearching = (techId: string) => gameState.research.current?.upgradeId === techId;
  const isPurchased = (techId: string) => (gameState.upgrades[techId] || 0) > 0;

  const canResearch = (techId: string) => {
    const tech = TECH_TREE[techId];
    if (!tech) return false;

    // Check path restriction
    if (tech.pathRestriction && tech.pathRestriction !== gameState.company.type) {
      return false;
    }

    // Already researched or currently researching
    if (isResearched(techId) || isResearching(techId)) return false;

    // Check if another tech is being researched
    if (gameState.research.current !== null) return false;

    // No interns available
    if (availableInterns === 0) return false;

    // Check prerequisites
    for (const prereqId of tech.prerequisites) {
      if (!isResearched(prereqId)) return false;
    }

    return true;
  };

  const canPurchase = (techId: string) => {
    const tech = TECH_TREE[techId];
    if (!tech) return false;

    // Must be researched first
    if (!isResearched(techId)) return false;

    // Already at max level
    const currentLevel = gameState.upgrades[techId] || 0;
    if (currentLevel >= tech.maxLevel) return false;

    // Check affordability
    return gameState.company.cash >= tech.cost;
  };

  const getPrereqDisplay = (techId: string): string => {
    const tech = TECH_TREE[techId];
    if (tech.prerequisites.length === 0) return 'None';
    return tech.prerequisites
      .map((id) => TECH_TREE[id]?.name || id)
      .join(', ');
  };

  const techsByBranch = {
    production: Object.values(TECH_TREE).filter((t) => t.branch === 'production'),
    market: Object.values(TECH_TREE).filter((t) => t.branch === 'market'),
    technology: Object.values(TECH_TREE).filter((t) => t.branch === 'technology'),
  };

  // Filter by path restriction
  const filterByPath = (techs: typeof TECH_TREE[string][]) => {
    return techs.filter(
      (t) => !t.pathRestriction || t.pathRestriction === gameState.company.type
    );
  };

  const renderTechTable = (techs: typeof TECH_TREE[string][], title: string, emoji: string) => {
    const filteredTechs = filterByPath(techs);
    if (filteredTechs.length === 0) return null;

    return (
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{emoji}</span>
          <span>{title}</span>
        </h3>
        <table className="erp-table">
          <thead>
            <tr>
              <th>Technology</th>
              <th>Prerequisites</th>
              <th>Research Time</th>
              <th>Cost</th>
              <th>Status</th>
              <th style={{ width: '150px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTechs.map((tech) => {
              const researched = isResearched(tech.id);
              const researching = isResearching(tech.id);
              const purchased = isPurchased(tech.id);
              const currentLevel = gameState.upgrades[tech.id] || 0;
              const maxed = currentLevel >= tech.maxLevel;

              return (
                <tr key={tech.id} style={{ opacity: researched ? 1 : 0.7 }}>
                  <td>
                    <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {researched && purchased && '✓ '}
                      {tech.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {tech.description}
                    </div>
                    {tech.maxLevel > 1 && (
                      <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
                        Level: {currentLevel} / {tech.maxLevel}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '11px' }}>{getPrereqDisplay(tech.id)}</td>
                  <td>{tech.researchTime}s</td>
                  <td className="money">
                    {tech.cost === 0 ? 'Free' : formatMoney(tech.cost)}
                  </td>
                  <td>
                    {maxed && (
                      <span style={{ color: '#FFB600', fontWeight: 'bold' }}>MAX</span>
                    )}
                    {!maxed && researched && !purchased && (
                      <span style={{ color: '#0a0', fontWeight: 'bold' }}>✓ Ready to Buy</span>
                    )}
                    {!maxed && researched && purchased && !maxed && (
                      <span style={{ color: '#0a0', fontWeight: 'bold' }}>✓ Owned</span>
                    )}
                    {researching && (
                      <span style={{ color: '#FFB600', fontWeight: 'bold' }}>⟳ Researching</span>
                    )}
                    {!researched && !researching && (
                      <span style={{ color: '#999' }}>Not Researched</span>
                    )}
                  </td>
                  <td>
                    {!researched && !researching && (
                      <Button
                        onClick={() => onStartResearch(tech.id)}
                        disabled={!canResearch(tech.id)}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        Research
                      </Button>
                    )}
                    {researched && !maxed && (
                      <Button
                        onClick={() => onPurchaseTech(tech.id)}
                        disabled={!canPurchase(tech.id)}
                        primary
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        Buy
                      </Button>
                    )}
                    {researching && (
                      <div style={{ fontSize: '11px' }}>
                        <ProgressBar progress={gameState.research.current!.progress} />
                        <div style={{ textAlign: 'center', marginTop: '2px', color: '#666' }}>
                          {Math.round(gameState.research.current!.progress)}%
                        </div>
                      </div>
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
      <Panel title="Technology Tree">
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#E3F2FD', border: '1px solid #003366', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Available Interns:</strong> {availableInterns}
            </div>
            <div>
              <strong>Researched:</strong> {gameState.research.completed.length} / {Object.keys(TECH_TREE).length}
            </div>
          </div>
          {availableInterns === 0 && (
            <div style={{ fontSize: '11px', color: '#CC0000', marginTop: '8px' }}>
              ⚠ Hire interns to conduct research! Visit the Staff panel to scout for talent.
            </div>
          )}
          {gameState.research.current && (
            <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ccc' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Currently Researching: {TECH_TREE[gameState.research.current.upgradeId]?.name || 'Unknown'}
              </div>
              <div style={{ fontSize: '11px', marginBottom: '6px', color: '#666' }}>
                {gameState.research.current.researchersAssigned} intern{gameState.research.current.researchersAssigned !== 1 ? 's' : ''} assigned
              </div>
              <ProgressBar progress={gameState.research.current.progress} />
            </div>
          )}
        </div>

        {renderTechTable(techsByBranch.production, 'Production Branch', '⚙️')}
        {renderTechTable(techsByBranch.market, 'Market Branch', '💰')}
        {renderTechTable(techsByBranch.technology, 'Technology Branch', '🔬')}

        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '11px', color: '#666' }}>
          <strong>How it works:</strong> Research technologies using interns (free workers), then purchase them with cash to unlock their effects.
          Some technologies have prerequisites that must be researched first.
        </div>
      </Panel>
    </div>
  );
}
