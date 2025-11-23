import { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';

interface ModalProps {
  title: string;
  children: ComponentChildren;
  onClose: () => void;
  width?: string;
}

export function Modal({ title, children, onClose, width = '800px' }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="erp-panel"
        style={{
          width,
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflow: 'auto',
          margin: '0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="erp-panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '0 8px',
            }}
          >
            ×
          </button>
        </div>
        <div className="erp-panel-content">{children}</div>
      </div>
    </div>
  );
}
