import { ComponentChildren } from 'preact';

interface PanelProps {
  title: string;
  children: ComponentChildren;
}

export function Panel({ title, children }: PanelProps) {
  return (
    <div className="erp-panel">
      <div className="erp-panel-header">{title}</div>
      <div className="erp-panel-content">{children}</div>
    </div>
  );
}
