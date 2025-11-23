import { GameState } from '../../types/game.types';
import { STAFF_TYPES } from '../../data/staff';
import { getTotalHourlyCost } from '../../utils/staffSystem';
import { Button } from '../ui/Button';

interface QuickStaffProps {
  gameState: GameState;
  onViewDetails: () => void;
}

export function QuickStaff({ gameState, onViewDetails }: QuickStaffProps) {
  const hourlyCost = getTotalHourlyCost(gameState);
  const totalStaff = gameState.staff.length;
  const assignedStaff = gameState.staff.filter((s) => s.assignedRecipe !== null).length;
  const idleStaff = totalStaff - assignedStaff;

  // Count by type
  const staffByType = Object.keys(STAFF_TYPES).map((typeId) => {
    const count = gameState.staff.filter((s) => s.staffTypeId === typeId).length;
    return { typeId, count, name: STAFF_TYPES[typeId].name };
  }).filter((s) => s.count > 0);

  if (totalStaff === 0) {
    return (
      <div style={{ padding: '12px', textAlign: 'center' }}>
        <div style={{ color: '#666', marginBottom: '12px' }}>No staff hired</div>
        <Button onClick={onViewDetails}>Hire Staff</Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Total Staff</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{totalStaff}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Active</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0a0' }}>{assignedStaff}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Idle</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#c60' }}>{idleStaff}</div>
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingTop: '8px', borderTop: '1px solid #444' }}>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Hourly Cost</div>
          <div className="money" style={{ fontSize: '16px' }}>${hourlyCost.toFixed(2)}/hr</div>
        </div>

        {staffByType.length > 0 && (
          <div style={{ marginBottom: '12px', paddingTop: '8px', borderTop: '1px solid #444' }}>
            <table className="erp-table" style={{ fontSize: '11px' }}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {staffByType.slice(0, 3).map(({ typeId, name, count }) => (
                  <tr key={typeId}>
                    <td>{name}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'Courier New' }}>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {staffByType.length > 3 && (
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', textAlign: 'center' }}>
                +{staffByType.length - 3} more types
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: '0 12px 12px', textAlign: 'center' }}>
        <Button onClick={onViewDetails}>Manage Staff</Button>
      </div>
    </div>
  );
}
