import { useEffect, useState } from 'preact/hooks';
import { TutorialStep } from '../../types/game.types';
import { Button } from '../ui/Button';

interface TutorialOverlayProps {
  step: TutorialStep;
  companyName: string;
  onNext: () => void;
  onSkip: () => void;
}

export function TutorialOverlay({ step, companyName, onNext, onSkip }: TutorialOverlayProps) {
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (step.highlightTarget) {
      // Find element by data-tutorial-id or fallback to class
      let element = document.querySelector(`[data-tutorial-id="${step.highlightTarget}"]`);
      if (!element) {
        element = document.querySelector(`.${step.highlightTarget}`);
      }

      if (element) {
        setHighlightRect(element.getBoundingClientRect());
      } else {
        setHighlightRect(null);
      }
    } else {
      setHighlightRect(null);
    }
  }, [step]);

  const message = step.message.replace('{companyName}', companyName);

  // Calculate tooltip position
  const getTooltipStyle = () => {
    if (!highlightRect) {
      // Center of screen
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const baseStyle = {
      position: 'fixed' as const,
      maxWidth: '400px',
      zIndex: 10002,
    };

    switch (step.position) {
      case 'top':
        return {
          ...baseStyle,
          bottom: `${window.innerHeight - highlightRect.top + 16}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: `${highlightRect.bottom + 16}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          ...baseStyle,
          top: `${highlightRect.top + highlightRect.height / 2}px`,
          right: `${window.innerWidth - highlightRect.left + 16}px`,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          ...baseStyle,
          top: `${highlightRect.top + highlightRect.height / 2}px`,
          left: `${highlightRect.right + 16}px`,
          transform: 'translateY(-50%)',
        };
      default:
        return {
          ...baseStyle,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }
  };

  return (
    <div>
      {/* Dark overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 10000,
        }}
        onClick={step.action === 'click_continue' ? onNext : undefined}
      />

      {/* Highlight cutout */}
      {highlightRect && (
        <div
          style={{
            position: 'fixed',
            top: `${highlightRect.top - 4}px`,
            left: `${highlightRect.left - 4}px`,
            width: `${highlightRect.width + 8}px`,
            height: `${highlightRect.height + 8}px`,
            border: '4px solid #ff9800',
            borderRadius: '8px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 152, 0, 0.8)',
            zIndex: 10001,
            pointerEvents: 'none',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        style={{
          ...getTooltipStyle(),
          backgroundColor: '#fff',
          border: '3px solid #003366',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ margin: 0, color: '#003366', fontSize: '18px', fontWeight: 'bold' }}>
            {step.title}
          </h3>
        </div>

        <div style={{ marginBottom: '16px', fontSize: '14px', lineHeight: '1.5', color: '#333' }}>
          {message}
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button onClick={onSkip} style={{ padding: '8px 16px', fontSize: '13px' }}>
            Skip Tutorial
          </Button>
          {step.action === 'click_continue' && (
            <Button onClick={onNext} primary style={{ padding: '8px 16px', fontSize: '13px' }}>
              Next →
            </Button>
          )}
          {step.action !== 'click_continue' && (
            <div style={{ fontSize: '12px', color: '#666', alignSelf: 'center' }}>
              {step.action === 'produce_item' && '⏳ Complete the action to continue...'}
              {step.action === 'sell_item' && '⏳ Sell an item to continue...'}
              {step.action === 'buy_machine' && '⏳ Buy a machine to continue...'}
              {step.action === 'hire_staff' && '⏳ Hire staff to continue...'}
            </div>
          )}
        </div>
      </div>

      {/* Pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              border-color: #ff9800;
              box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 152, 0, 0.8);
            }
            50% {
              border-color: #ffc107;
              box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 193, 7, 1);
            }
          }
        `}
      </style>
    </div>
  );
}
