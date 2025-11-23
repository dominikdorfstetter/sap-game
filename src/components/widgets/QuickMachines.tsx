import { GameState } from '../../types/game.types';
import { MACHINES } from '../../data/machines';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';

interface QuickMachinesProps {
  gameState: GameState;
  onViewDetails: () => void;
}

export function QuickMachines({ gameState, onViewDetails }: QuickMachinesProps) {
  if (gameState.machines.length === 0) {
    return (
      <div style={{ padding: '12px', textAlign: 'center' }}>
        <div style={{ color: '#666', marginBottom: '8px' }}>No machines purchased</div>
        <Button onClick={onViewDetails}>Buy Machines</Button>
      </div>
    );
  }

  const activeMachines = gameState.machines.filter((m) => m.active);
  const idleMachines = gameState.machines.filter((m) => !m.active);

  return (
    <div>
      <div style={{ marginBottom: '8px', fontSize: '12px' }}>
        <strong>Active:</strong> {activeMachines.length} | <strong>Idle:</strong> {idleMachines.length}
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {gameState.machines.slice(0, 3).map((machine) => {
          const machineData = MACHINES[machine.machineId];
          return (
            <div key={machine.id} style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                {machineData.name}
              </div>
              <ProgressBar progress={machine.progress} />
            </div>
          );
        })}
      </div>
      {gameState.machines.length > 3 && (
        <div style={{ padding: '4px', fontSize: '11px', color: '#666', textAlign: 'center' }}>
          +{gameState.machines.length - 3} more
        </div>
      )}
      <div style={{ marginTop: '8px', textAlign: 'center' }}>
        <Button onClick={onViewDetails}>Manage Machines</Button>
      </div>
    </div>
  );
}
