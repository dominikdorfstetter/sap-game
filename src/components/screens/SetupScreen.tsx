import { useState } from 'preact/hooks';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';

interface SetupScreenProps {
  onComplete: (companyName: string) => void;
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (companyName.trim()) {
      onComplete(companyName.trim());
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '500px' }}>
        <div className="sap-header" style={{ marginBottom: '0' }}>
          <div className="sap-header-title">SAP Production Manager - Setup</div>
        </div>
        <Panel title="Company Setup">
          <form onSubmit={handleSubmit}>
            <div className="mb-md">
              <label className="sap-label">Company Name:</label>
              <input
                type="text"
                className="sap-input"
                value={companyName}
                onInput={(e) => setCompanyName((e.target as HTMLInputElement).value)}
                placeholder="Enter company name"
                maxLength={50}
                autoFocus
              />
            </div>
            <div className="text-center mt-md">
              <Button primary disabled={!companyName.trim()} type="submit">
                Start Company
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
