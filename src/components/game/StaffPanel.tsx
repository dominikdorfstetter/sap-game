import { GameState } from '../../types/game.types';
import { STAFF_TYPES } from '../../data/staff';
import { RECIPES } from '../../data/recipes';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { getTotalHourlyCost, getStaffByType } from '../../utils/staffSystem';

interface StaffPanelProps {
  gameState: GameState;
  onHire: (staffTypeId: string) => void;
  onFire: (staffId: string) => void;
  onAssign: (staffId: string, recipeId: string | null) => void;
}

export function StaffPanel({ gameState, onHire, onFire, onAssign }: StaffPanelProps) {
  const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;
  const totalCost = getTotalHourlyCost(gameState);

  const availableRecipes = Object.values(RECIPES).filter((r) =>
    gameState.unlockedRecipes.includes(r.id)
  );

  return (
    <div>
      <Panel title="Staff Management">
        <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#FFF3CD', border: '1px solid #FFB600' }}>
          <strong>Hourly Cost:</strong> {formatMoney(totalCost)}/hour
          <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
            Salaries paid every 60 seconds (in-game hour)
          </div>
        </div>

        <h3 style={{ marginBottom: '8px', textTransform: 'uppercase', fontSize: '13px' }}>
          Hire Staff
        </h3>
        <table className="erp-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Salary</th>
              <th>Hire Cost</th>
              <th>Employed</th>
              <th style={{ width: '100px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(STAFF_TYPES).map((staffType) => {
              const employed = getStaffByType(gameState, staffType.id).length;
              const canAfford = gameState.company.cash >= staffType.hireCoat;
              const atMax = staffType.maxHires > 0 && employed >= staffType.maxHires;

              return (
                <tr key={staffType.id}>
                  <td style={{ fontWeight: 'bold' }}>{staffType.name}</td>
                  <td>{staffType.description}</td>
                  <td className="money">{formatMoney(staffType.baseSalary)}/hr</td>
                  <td className="money">{formatMoney(staffType.hireCoat)}</td>
                  <td style={{ textAlign: 'center' }}>
                    {employed}
                    {staffType.maxHires > 0 && ` / ${staffType.maxHires}`}
                  </td>
                  <td>
                    <Button
                      onClick={() => onHire(staffType.id)}
                      disabled={!canAfford || atMax}
                    >
                      Hire
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      {gameState.staff.length > 0 && (
        <Panel title="Current Staff">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gameState.staff.map((staff) => {
                const staffType = STAFF_TYPES[staff.staffTypeId];
                const canProduce = staffType.specialty !== 'research';

                return (
                  <tr key={staff.id}>
                    <td>{staffType.name}</td>
                    <td>
                      {canProduce ? (
                        <select
                          value={staff.assignedRecipe || ''}
                          onChange={(e) =>
                            onAssign(staff.id, (e.target as HTMLSelectElement).value || null)
                          }
                          style={{ padding: '4px', width: '200px' }}
                        >
                          <option value="">Idle</option>
                          {availableRecipes.map((recipe) => (
                            <option key={recipe.id} value={recipe.id}>
                              {recipe.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ fontStyle: 'italic', color: '#666' }}>Research</span>
                      )}
                    </td>
                    <td>
                      <Button onClick={() => onFire(staff.id)}>Fire</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}
