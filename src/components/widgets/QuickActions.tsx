import { Button } from '../ui/Button';

interface QuickActionsProps {
  onOpenProduction: () => void;
  onOpenMarket: () => void;
  onOpenUpgrades: () => void;
  onOpenMachines: () => void;
  onOpenStaff: () => void;
  onOpenResearch: () => void;
}

export function QuickActions({
  onOpenProduction,
  onOpenMarket,
  onOpenUpgrades,
  onOpenMachines,
  onOpenStaff,
  onOpenResearch,
}: QuickActionsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <Button onClick={onOpenProduction} primary>
        📋 Production
      </Button>
      <Button onClick={onOpenMachines}>🏭 Machines</Button>
      <Button onClick={onOpenStaff}>👥 Staff</Button>
      <Button onClick={onOpenResearch}>🔬 Research</Button>
      <Button onClick={onOpenMarket}>💰 Market</Button>
      <Button onClick={onOpenUpgrades}>⬆️ Upgrades</Button>
    </div>
  );
}
