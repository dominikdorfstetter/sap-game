interface ProgressBarProps {
  progress: number; // 0-100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="erp-progress">
      <div
        className="erp-progress-bar"
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}
