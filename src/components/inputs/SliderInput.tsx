import { useState, useRef, useEffect } from 'preact/hooks';

interface SliderInputProps {
  onComplete: () => void;
  disabled?: boolean;
  actionLabel: string; // e.g., "Saw Wood", "Cut Plank"
}

export function SliderInput({ onComplete, disabled, actionLabel }: SliderInputProps) {
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Reset progress when user stops dragging
  useEffect(() => {
    if (!isDragging && progress > 0) {
      const resetTimer = setTimeout(() => {
        setProgress(0);
      }, 500);
      return () => clearTimeout(resetTimer);
    }
  }, [isDragging, progress]);

  const handleMouseDown = () => {
    if (disabled) return;
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setProgress(percentage);

    if (percentage >= 95) {
      onComplete();
      setProgress(0);
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || disabled || !sliderRef.current) return;

    const touch = e.touches[0];
    const rect = sliderRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setProgress(percentage);

    if (percentage >= 95) {
      onComplete();
      setProgress(0);
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, disabled]);

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '8px', textAlign: 'center', fontSize: '14px', color: '#003366' }}>
        🪚 {actionLabel}
      </div>
      <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        Drag the slider to the right →
      </div>
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{
          position: 'relative',
          height: '50px',
          backgroundColor: '#E5E5E5',
          border: '2px solid #003366',
          borderRadius: '4px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress}%`,
            backgroundColor: progress >= 95 ? '#0a0' : '#ff9800',
            transition: isDragging ? 'none' : 'width 0.3s ease',
            borderRadius: '2px',
          }}
        />
        {/* Handle */}
        <div
          style={{
            position: 'absolute',
            left: `calc(${progress}% - 15px)`,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '30px',
            height: '40px',
            backgroundColor: '#003366',
            border: '2px solid #fff',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: isDragging ? 'none' : 'left 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '18px',
          }}
        >
          ↔
        </div>
      </div>
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}
