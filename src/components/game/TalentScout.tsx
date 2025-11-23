import { StaffCandidate } from '../../types/game.types';
import { STAFF_TYPES, RARITY_COLORS } from '../../data/staff';
import { Button } from '../ui/Button';

interface TalentScoutProps {
  candidates: StaffCandidate[];
  onHire: (candidateId: string) => void;
  onDismiss: () => void;
  playerCash: number;
}

export function TalentScout({ candidates, onHire, onDismiss, playerCash }: TalentScoutProps) {
  const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h2 style={{
          color: '#003366',
          marginBottom: '8px',
          fontSize: '20px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          ✨ Talent Scouted! ✨
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Choose ONE candidate to hire. Each has unique stats based on their rarity.
        </p>
      </div>

      {/* Candidate Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {candidates.map((candidate) => {
          const staffType = STAFF_TYPES[candidate.staffTypeId];
          if (!staffType) return null;

          const canAfford = playerCash >= staffType.hireCoat;
          const rarityColor = RARITY_COLORS[candidate.rarity];

          return (
            <div
              key={candidate.id}
              style={{
                border: `3px solid ${rarityColor}`,
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#fff',
                position: 'relative',
                boxShadow: `0 4px 8px ${rarityColor}40`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                opacity: canAfford ? 1 : 0.6,
              }}
              onMouseEnter={(e) => {
                if (canAfford) {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 8px 16px ${rarityColor}60`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = `0 4px 8px ${rarityColor}40`;
              }}
            >
              {/* Rarity Badge */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: rarityColor,
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
                {candidate.rarity}
              </div>

              {/* Candidate Info */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#003366',
                  marginBottom: '4px',
                  minHeight: '32px',
                  lineHeight: '1.2',
                }}>
                  {candidate.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#666',
                  marginBottom: '8px',
                  minHeight: '40px',
                  lineHeight: '1.3',
                }}>
                  {staffType.description}
                </div>
              </div>

              {/* Stats */}
              <div style={{
                fontSize: '11px',
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
              }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Salary:</strong> {formatMoney(candidate.effectiveSalary)}/hr
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Speed:</strong> {candidate.effectiveSpeed.toFixed(2)}x
                </div>
                <div>
                  <strong>Specialty:</strong> {staffType.specialty}
                </div>
              </div>

              {/* Hire Cost */}
              <div style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: canAfford ? '#006600' : '#c60',
                marginBottom: '8px',
                textAlign: 'center',
              }}>
                Hire: {formatMoney(staffType.hireCoat)}
              </div>

              {/* Hire Button */}
              <Button
                onClick={() => onHire(candidate.id)}
                disabled={!canAfford}
                primary
                style={{ width: '100%', padding: '6px 8px', fontSize: '12px' }}
              >
                HIRE
              </Button>
            </div>
          );
        })}
      </div>

      {/* Dismiss Button */}
      <div style={{ textAlign: 'center' }}>
        <Button onClick={onDismiss} style={{ minWidth: '200px' }}>
          Dismiss All Candidates
        </Button>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          (You can only hire ONE candidate per scouting session)
        </div>
      </div>
    </div>
  );
}
