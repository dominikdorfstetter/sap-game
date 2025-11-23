import { GameState } from '../../types/game.types';
import { UPGRADES } from '../../data/upgrades';
import { STAFF_TYPES } from '../../data/staff';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface QuickResearchProps {
  gameState: GameState;
  onViewDetails: () => void;
}

export function QuickResearch({ gameState, onViewDetails }: QuickResearchProps) {
  const currentProject = gameState.research.current;
  const completedCount = gameState.research.completed.length;
  const totalUpgrades = Object.keys(UPGRADES).length;

  const availableInterns = gameState.staff.filter(
    (s) => STAFF_TYPES[s.staffTypeId].specialty === 'research'
  ).length;

  if (!currentProject && availableInterns === 0) {
    return (
      <div style={{ padding: '12px', textAlign: 'center' }}>
        <div style={{ color: '#666', marginBottom: '12px' }}>No research interns hired</div>
        <Button onClick={onViewDetails}>View Research Lab</Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Completed</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {completedCount}/{totalUpgrades}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Interns</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0af' }}>{availableInterns}</div>
          </div>
        </div>

        {currentProject ? (
          <div style={{ marginBottom: '12px', paddingTop: '8px', borderTop: '1px solid #444' }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Current Research</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
              {UPGRADES[currentProject.upgradeId]?.name || 'Unknown'}
            </div>
            <ProgressBar progress={currentProject.progress} />
            <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', textAlign: 'center' }}>
              {currentProject.researchersAssigned} intern{currentProject.researchersAssigned !== 1 ? 's' : ''} assigned
            </div>
          </div>
        ) : availableInterns > 0 ? (
          <div style={{ marginBottom: '12px', paddingTop: '8px', borderTop: '1px solid #444' }}>
            <div style={{ color: '#c60', fontSize: '12px', textAlign: 'center' }}>
              🔬 Interns idle - Start a research project
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ padding: '0 12px 12px', textAlign: 'center' }}>
        <Button onClick={onViewDetails}>Research Lab</Button>
      </div>
    </div>
  );
}
