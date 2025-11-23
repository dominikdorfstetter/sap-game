interface ProgressBarProps {
  progress: number; // 0-100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="sap-progress">
      <div
        className="sap-progress-bar"
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}
