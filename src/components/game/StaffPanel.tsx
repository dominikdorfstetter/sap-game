import { GameState } from '../../types/game.types';
import { STAFF_TYPES, RARITY_COLORS } from '../../data/staff';
import { RECIPES } from '../../data/recipes';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { getTotalHourlyCost } from '../../utils/staffSystem';
import { TalentScout } from './TalentScout';

interface StaffPanelProps {
  gameState: GameState;
  onScoutTalent: () => void;
  onHireFromScout: (candidateId: string) => void;
  onDismissScout: () => void;
  onFire: (staffId: string) => void;
  onAssign: (staffId: string, recipeId: string | null) => void;
}

export function StaffPanel({ gameState, onScoutTalent, onHireFromScout, onDismissScout, onFire, onAssign }: StaffPanelProps) {
  const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;
  const totalCost = getTotalHourlyCost(gameState);

  const availableRecipes = Object.values(RECIPES).filter((r) =>
    gameState.unlockedRecipes.includes(r.id)
  );

  const SCOUT_COST = 100;
  const canAffordScout = gameState.company.cash >= SCOUT_COST;

  return (
    <div>
      {/* Scout Talent Section */}
      {gameState.scouting ? (
        <Panel title="Talent Scout Results">
          <TalentScout
            candidates={gameState.scouting.candidates}
            onHire={onHireFromScout}
            onDismiss={onDismissScout}
            playerCash={gameState.company.cash}
          />
        </Panel>
      ) : (
        <Panel title="Talent Scouting">
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#003366' }}>
                🎯 Scout for Talent
              </div>
              <p style={{ color: '#666', marginBottom: '16px', maxWidth: '500px', margin: '0 auto' }}>
                Scout the talent market to discover 5 random candidates with varying rarities and stats.
                You can hire ONE candidate per scouting session.
              </p>
            </div>
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px', display: 'inline-block' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Scouting Cost</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: canAffordScout ? '#006600' : '#c60' }}>
                {formatMoney(SCOUT_COST)}
              </div>
            </div>
            <div>
              <Button
                onClick={onScoutTalent}
                disabled={!canAffordScout}
                primary
                style={{ minWidth: '200px', padding: '12px 24px', fontSize: '14px' }}
              >
                🔍 Scout Talent
              </Button>
            </div>
          </div>
        </Panel>
      )}

      {/* Staff Costs Summary */}
      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#FFF3CD', border: '2px solid #FFB600' }}>
        <strong>Total Hourly Cost:</strong> {formatMoney(totalCost)}/hour
        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
          Salaries are paid automatically every 60 seconds (1 in-game hour)
        </div>
      </div>

      {/* Current Staff List */}
      {gameState.staff.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ marginBottom: '12px', textTransform: 'uppercase', fontSize: '14px', color: '#003366' }}>
            Current Staff ({gameState.staff.length})
          </h3>
          <table className="erp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Rarity</th>
                <th>Salary</th>
                <th>Speed</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gameState.staff.map((staff) => {
                const staffType = STAFF_TYPES[staff.staffTypeId];
                const canProduce = staffType.specialty !== 'research';
                const effectiveSalary = staffType.baseSalary * staff.salaryMultiplier;
                const effectiveSpeed = staffType.productionSpeed * staff.speedMultiplier;

                return (
                  <tr key={staff.id}>
                    <td style={{ fontWeight: 'bold' }}>{staff.name}</td>
                    <td>{staffType.name}</td>
                    <td>
                      <span style={{
                        color: RARITY_COLORS[staff.rarity],
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '11px',
                      }}>
                        {staff.rarity}
                      </span>
                    </td>
                    <td className="money">{formatMoney(effectiveSalary)}/hr</td>
                    <td>{effectiveSpeed.toFixed(2)}x</td>
                    <td>
                      {canProduce ? (
                        <select
                          value={staff.assignedRecipe || ''}
                          onChange={(e) =>
                            onAssign(staff.id, (e.target as HTMLSelectElement).value || null)
                          }
                          style={{ padding: '4px', width: '180px' }}
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
        </div>
      )}
    </div>
  );
}
