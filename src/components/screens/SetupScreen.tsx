import { useState } from 'preact/hooks';
import { CompanyType } from '../../types/game.types';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';

interface SetupScreenProps {
  onComplete: (companyName: string, companyType: CompanyType) => void;
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [companyName, setCompanyName] = useState('');
  const [step, setStep] = useState<'name' | 'type'>('name');

  const handleNameSubmit = (e: Event) => {
    e.preventDefault();
    if (companyName.trim()) {
      setStep('type');
    }
  };

  const handleTypeSelect = (type: CompanyType) => {
    onComplete(companyName.trim(), type);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5' }}>
      <div style={{ width: '700px' }}>
        <div className="erp-header" style={{ marginBottom: '0' }}>
          <div className="erp-header-title">ERP Production Manager - Setup</div>
        </div>

        {step === 'name' && (
          <Panel title="Company Setup - Step 1/2">
            <form onSubmit={handleNameSubmit}>
              <div className="mb-md">
                <label className="erp-label">Company Name:</label>
                <input
                  type="text"
                  className="erp-input"
                  value={companyName}
                  onInput={(e) => setCompanyName((e.target as HTMLInputElement).value)}
                  placeholder="Enter company name"
                  maxLength={50}
                  autoFocus
                />
              </div>
              <div className="text-center mt-md">
                <Button primary disabled={!companyName.trim()} type="submit">
                  Next →
                </Button>
              </div>
            </form>
          </Panel>
        )}

        {step === 'type' && (
          <Panel title="Company Setup - Step 2/2">
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ color: '#003366', marginBottom: '8px' }}>Choose Your Specialization</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                Select your company's primary focus. You can research the other path later, but it will take time and resources.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Wood Path */}
              <div
                onClick={() => handleTypeSelect('wood')}
                style={{
                  border: '3px solid #8B4513',
                  borderRadius: '8px',
                  padding: '20px',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(139, 69, 19, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '12px' }}>🌲</div>
                <h3 style={{ textAlign: 'center', color: '#8B4513', marginBottom: '12px' }}>Wood Industry</h3>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                  Focus on forestry and carpentry. Start with wood, planks, and sand-based production.
                </p>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  <strong>Starting Resources:</strong>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    <li>Wood chopping & processing</li>
                    <li>Sand gathering</li>
                    <li>Glass production</li>
                    <li>Carpentry products</li>
                  </ul>
                </div>
              </div>

              {/* Steel Path */}
              <div
                onClick={() => handleTypeSelect('steel')}
                style={{
                  border: '3px solid #708090',
                  borderRadius: '8px',
                  padding: '20px',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(112, 128, 144, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '12px' }}>⚙️</div>
                <h3 style={{ textAlign: 'center', color: '#708090', marginBottom: '12px' }}>Steel Industry</h3>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                  Focus on mining and metallurgy. Start with ore, coal, and steel-based production.
                </p>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  <strong>Starting Resources:</strong>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    <li>Ore & coal mining</li>
                    <li>Metal smelting</li>
                    <li>Steel forging</li>
                    <li>Metal components</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Button onClick={() => setStep('name')}>← Back</Button>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
