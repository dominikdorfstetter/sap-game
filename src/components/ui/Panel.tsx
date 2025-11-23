import { ComponentChildren } from 'preact';

interface PanelProps {
  title: string;
  children: ComponentChildren;
}

export function Panel({ title, children }: PanelProps) {
  return (
    <div className="sap-panel">
      <div className="sap-panel-header">{title}</div>
      <div className="sap-panel-content">{children}</div>
    </div>
  );
}
