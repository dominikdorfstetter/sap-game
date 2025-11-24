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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <Button onClick={onOpenMachines}>🏭 Machines</Button>
      <Button onClick={onOpenStaff}>👥 Staff</Button>
      <Button onClick={onOpenMarket}>💰 Market</Button>
      <Button onClick={onOpenTechTree} style={{ gridColumn: 'span 2' }}>
        🔬 Technology Tree
      </Button>
    </div>
  );
}
