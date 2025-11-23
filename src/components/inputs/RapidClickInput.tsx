import { useState, useEffect, useRef } from 'preact/hooks';
import { Button } from '../ui/Button';

interface RapidClickInputProps {
  onComplete: () => void;
  disabled?: boolean;
  actionLabel: string; // e.g., "Mine Coal", "Hammer"
  requiredClicks?: number; // Default: 5
}

export function RapidClickInput({ onComplete, disabled, actionLabel, requiredClicks = 5 }: RapidClickInputProps) {
  const [clicks, setClicks] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Reset clicks after 2 seconds of inactivity
  useEffect(() => {
    if (clicks > 0 && clicks < requiredClicks) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setClicks(0);
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [clicks, requiredClicks]);

  const handleClick = () => {
    if (disabled) return;

    const newClicks = clicks + 1;
    setClicks(newClicks);
    setIsShaking(true);

    setTimeout(() => {
      setIsShaking(false);
    }, 100);

    if (newClicks >= requiredClicks) {
      onComplete();
      setClicks(0);
    }
  };

  const progress = (clicks / requiredClicks) * 100;

  return (
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <div style={{ marginBottom: '12px', fontSize: '14px', color: '#003366' }}>
        🔨 {actionLabel}
      </div>
      <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
        Click rapidly! ({clicks}/{requiredClicks})
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: '8px',
          backgroundColor: '#E5E5E5',
          border: '1px solid #003366',
          borderRadius: '4px',
          marginBottom: '12px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: progress >= 100 ? '#0a0' : '#ff6b00',
            transition: 'width 0.1s ease',
          }}
        />
      </div>

      <Button
        onClick={handleClick}
        disabled={disabled}
        primary
        style={{
          minWidth: '200px',
          padding: '16px 32px',
          fontSize: '16px',
          transform: isShaking ? 'translate(2px, -2px)' : 'translate(0, 0)',
          transition: 'none',
        }}
      >
        💥 CLICK!
      </Button>

      {clicks > 0 && clicks < requiredClicks && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#c60' }}>
          Keep clicking! Resets in 2s if you stop
        </div>
      )}
    </div>
  );
}
