import { useState, useEffect, useRef } from 'preact/hooks';

interface HoldReleaseInputProps {
  onComplete: () => void;
  disabled?: boolean;
  actionLabel: string; // e.g., "Gather Sand", "Collect"
}

export function HoldReleaseInput({ onComplete, disabled, actionLabel }: HoldReleaseInputProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [power, setPower] = useState(0);
  const [targetZone, setTargetZone] = useState({ min: 60, max: 80 });
  const [result, setResult] = useState<'success' | 'fail' | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Animate power bar when holding
  useEffect(() => {
    if (isHolding && !disabled) {
      startTimeRef.current = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        // Power oscillates between 0 and 100 with a period of 2 seconds
        const progress = (elapsed % 2000) / 2000;
        const powerValue = Math.sin(progress * Math.PI * 2) * 50 + 50; // Oscillate between 0-100
        setPower(powerValue);

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isHolding, disabled]);

  const handleMouseDown = () => {
    if (disabled || result) return;
    setIsHolding(true);
    setResult(null);
  };

  const handleMouseUp = () => {
    if (!isHolding || disabled) return;
    setIsHolding(false);

    // Check if power is in target zone
    if (power >= targetZone.min && power <= targetZone.max) {
      setResult('success');
      setTimeout(() => {
        onComplete();
        setResult(null);
        setPower(0);
        // Randomize target zone for next time
        const min = Math.random() * 40 + 30; // 30-70
        setTargetZone({ min, max: min + 20 });
      }, 300);
    } else {
      setResult('fail');
      setTimeout(() => {
        setResult(null);
        setPower(0);
      }, 500);
    }
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isHolding, power, targetZone]);

  const inTargetZone = power >= targetZone.min && power <= targetZone.max;

  return (
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <div style={{ marginBottom: '8px', fontSize: '14px', color: '#003366' }}>
        ⏱️ {actionLabel}
      </div>
      <div style={{ marginBottom: '12px', fontSize: '12px', color: '#666' }}>
        Hold and release when the bar is in the green zone!
      </div>

      {/* Power bar */}
      <div
        style={{
          position: 'relative',
          height: '60px',
          backgroundColor: '#E5E5E5',
          border: '2px solid #003366',
          borderRadius: '4px',
          marginBottom: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Target zone */}
        <div
          style={{
            position: 'absolute',
            left: `${targetZone.min}%`,
            top: 0,
            width: `${targetZone.max - targetZone.min}%`,
            height: '100%',
            backgroundColor: 'rgba(0, 170, 0, 0.3)',
            border: '2px dashed #0a0',
          }}
        />

        {/* Power indicator */}
        <div
          style={{
            position: 'absolute',
            left: `${power}%`,
            top: 0,
            width: '4px',
            height: '100%',
            backgroundColor: inTargetZone ? '#0a0' : '#ff6b00',
            boxShadow: '0 0 8px rgba(0,0,0,0.5)',
            transition: 'background-color 0.1s ease',
          }}
        />

        {/* Power fill */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${power}%`,
            height: '100%',
            backgroundColor: inTargetZone ? 'rgba(0, 170, 0, 0.2)' : 'rgba(255, 107, 0, 0.2)',
            transition: 'background-color 0.1s ease',
          }}
        />
      </div>

      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{
          display: 'inline-block',
          minWidth: '200px',
          padding: '16px 32px',
          fontSize: '16px',
          backgroundColor: disabled || result !== null
            ? '#ccc'
            : result === 'success'
            ? '#0a0'
            : result === 'fail'
            ? '#c60'
            : '#003366',
          color: '#fff',
          border: '2px solid #003366',
          borderRadius: '4px',
          cursor: disabled || result !== null ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          fontWeight: 'bold',
          transform: isHolding ? 'scale(0.98)' : 'scale(1)',
          transition: 'transform 0.1s ease, background-color 0.2s ease',
          userSelect: 'none',
        }}
      >
        {result === 'success'
          ? '✓ Perfect!'
          : result === 'fail'
          ? '✗ Missed!'
          : isHolding
          ? '⏸ RELEASE!'
          : '▶ HOLD'}
      </div>

      {result === null && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#888' }}>
          Power: {Math.round(power)}%
        </div>
      )}
    </div>
  );
}
