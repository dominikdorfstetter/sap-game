import { ComponentChildren } from 'preact';
import { JSX } from 'preact/jsx-runtime';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  children: ComponentChildren;
  type?: 'button' | 'submit';
  style?: JSX.CSSProperties;
}

export function Button({ onClick, disabled, primary, children, type = 'button', style }: ButtonProps) {
  const className = primary ? 'erp-button erp-button-primary' : 'erp-button';

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
