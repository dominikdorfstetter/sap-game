import { useState } from 'preact/hooks';
import { Button } from '../ui/Button';

interface ClickInputProps {
  onComplete: () => void;
  disabled?: boolean;
  actionLabel: string; // e.g., "Mine Ore", "Gather Resource"
}

export function ClickInput({ onComplete, disabled, actionLabel }: ClickInputProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    setIsAnimating(true);
    onComplete();

    // Reset animation after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <Button
        onClick={handleClick}
        disabled={disabled}
        primary
        style={{
          minWidth: '200px',
          padding: '16px 32px',
          fontSize: '16px',
          transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.1s ease',
        }}
      >
        ⛏️ {actionLabel}
      </Button>
    </div>
  );
}
