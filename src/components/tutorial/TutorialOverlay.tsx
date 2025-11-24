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

  // Calculate tooltip position with better bounds checking
  const getTooltipStyle = () => {
    if (!highlightRect) {
      // Center of screen
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '350px',
        maxWidth: '500px',
      };
    }

    const baseStyle = {
      position: 'fixed' as const,
      minWidth: '350px',
      maxWidth: '500px',
      zIndex: 10002,
    };

    const padding = 24;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Try positioning based on preference, but ensure it stays on screen
    switch (step.position) {
      case 'top':
        // Position above the highlighted element
        if (highlightRect.top > 250) {
          return {
            ...baseStyle,
            bottom: `${screenHeight - highlightRect.top + padding}px`,
            left: '50%',
            transform: 'translateX(-50%)',
          };
        }
        // Fallback to bottom if not enough space on top
        return {
          ...baseStyle,
          top: `${highlightRect.bottom + padding}px`,
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        // Position below the highlighted element
        if (screenHeight - highlightRect.bottom > 250) {
          return {
            ...baseStyle,
            top: `${highlightRect.bottom + padding}px`,
            left: '50%',
            transform: 'translateX(-50%)',
          };
        }
        // Fallback to top if not enough space below
        return {
          ...baseStyle,
          bottom: `${screenHeight - highlightRect.top + padding}px`,
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'left':
        // Position to the left
        if (highlightRect.left > 450) {
          return {
            ...baseStyle,
            top: `${Math.max(padding, highlightRect.top + highlightRect.height / 2 - 100)}px`,
            right: `${screenWidth - highlightRect.left + padding}px`,
          };
        }
        // Fallback to right
        return {
          ...baseStyle,
          top: `${Math.max(padding, highlightRect.top + highlightRect.height / 2 - 100)}px`,
          left: `${highlightRect.right + padding}px`,
        };
      case 'right':
        // Position to the right
        if (screenWidth - highlightRect.right > 450) {
          return {
            ...baseStyle,
            top: `${Math.max(padding, highlightRect.top + highlightRect.height / 2 - 100)}px`,
            left: `${highlightRect.right + padding}px`,
          };
        }
        // Fallback to left
        return {
          ...baseStyle,
          top: `${Math.max(padding, highlightRect.top + highlightRect.height / 2 - 100)}px`,
          right: `${screenWidth - highlightRect.left + padding}px`,
        };
      default:
        // Center
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
          backgroundColor: '#ffffff',
          border: '4px solid #ff9800',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5), 0 0 0 2px #003366',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{
            margin: 0,
            color: '#003366',
            fontSize: '20px',
            fontWeight: 'bold',
            lineHeight: '1.3',
          }}>
            {step.title}
          </h3>
        </div>

        <div style={{
          marginBottom: '20px',
          fontSize: '15px',
          lineHeight: '1.6',
          color: '#222',
          fontWeight: '500',
        }}>
          {message}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button onClick={onSkip} style={{ padding: '10px 20px', fontSize: '14px' }}>
            Skip Tutorial
          </Button>
          {step.action === 'click_continue' && (
            <Button onClick={onNext} primary style={{ padding: '10px 20px', fontSize: '14px' }}>
              Next →
            </Button>
          )}
          {step.action !== 'click_continue' && (
            <div style={{
              fontSize: '14px',
              color: '#ff9800',
              fontWeight: 'bold',
              padding: '8px 12px',
              backgroundColor: '#fff3e0',
              borderRadius: '4px',
            }}>
              {step.action === 'produce_item' && '⏳ Craft an item to continue'}
              {step.action === 'sell_item' && '⏳ Sell an item to continue'}
              {step.action === 'buy_machine' && '⏳ Buy a machine to continue'}
              {step.action === 'hire_staff' && '⏳ Hire staff to continue'}
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
