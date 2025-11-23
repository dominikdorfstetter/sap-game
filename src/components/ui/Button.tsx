import { ComponentChildren } from 'preact';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  children: ComponentChildren;
  type?: 'button' | 'submit';
}

export function Button({ onClick, disabled, primary, children, type = 'button' }: ButtonProps) {
  const className = primary ? 'erp-button erp-button-primary' : 'erp-button';

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
