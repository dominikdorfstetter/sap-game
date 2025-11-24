import { Button } from '../ui/Button';

interface QuickActionsProps {
  onOpenMarket: () => void;
  onOpenTechTree: () => void;
  onOpenMachines: () => void;
  onOpenStaff: () => void;
}

export function QuickActions({
  onOpenMarket,
  onOpenTechTree,
  onOpenMachines,
  onOpenStaff,
}: QuickActionsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        <Button onClick={onOpenMachines}>🏭 Machines</Button>
        <Button onClick={onOpenStaff}>👥 Staff</Button>
        <Button onClick={onOpenMarket}>💰 Market</Button>
      </div>
      <Button onClick={onOpenTechTree}>
        🔬 Technology Tree
      </Button>
    </div>
  );
}
