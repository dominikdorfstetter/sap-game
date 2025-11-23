import { GameState } from '../../types/game.types';
import { MACHINES } from '../../data/machines';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface MachinePanelProps {
  gameState: GameState;
  onPurchase: (machineId: string) => void;
}

export function MachinePanel({ gameState, onPurchase }: MachinePanelProps) {
  const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

  const canAfford = (machineId: string) => {
    const machine = MACHINES[machineId];
    return gameState.company.cash >= machine.cost;
  };

  const isUnlocked = (machineId: string) => {
    return gameState.unlockedMachines.includes(machineId);
  };

  const ownedCount = (machineId: string) => {
    return gameState.machines.filter((m) => m.machineId === machineId).length;
  };

  return (
    <Panel title="Automation - Purchase Machines">
      <table className="sap-table">
        <thead>
          <tr>
            <th>Machine</th>
            <th>Description</th>
            <th>Cost</th>
            <th>Speed</th>
            <th>Owned</th>
            <th style={{ width: '150px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(MACHINES).map((machineId) => {
            const machine = MACHINES[machineId];
            const unlocked = isUnlocked(machineId);
            const owned = ownedCount(machineId);
            const affordable = canAfford(machineId);

            return (
              <tr key={machineId}>
                <td style={{ fontWeight: 'bold' }}>{machine.name}</td>
                <td>{machine.description}</td>
                <td className="money">{formatMoney(machine.cost)}</td>
                <td>{(machine.productionTime / 1000).toFixed(1)}s</td>
                <td style={{ textAlign: 'center', fontFamily: 'Courier New' }}>
                  {owned}
                </td>
                <td>
                  {unlocked ? (
                    <Button
                      onClick={() => onPurchase(machineId)}
                      disabled={!affordable}
                    >
                      Buy
                    </Button>
                  ) : (
                    <span style={{ color: '#999', fontSize: '12px' }}>LOCKED</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {gameState.machines.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
            Active Machines
          </div>
          <table className="sap-table">
            <thead>
              <tr>
                <th>Machine</th>
                <th>Status</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {gameState.machines.map((machineInstance) => {
                const machine = MACHINES[machineInstance.machineId];
                return (
                  <tr key={machineInstance.id}>
                    <td>{machine.name}</td>
                    <td>
                      <span style={{ color: machineInstance.active ? '#006600' : '#999999' }}>
                        {machineInstance.active ? 'RUNNING' : 'IDLE'}
                      </span>
                    </td>
                    <td style={{ width: '200px' }}>
                      <ProgressBar progress={machineInstance.progress} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
