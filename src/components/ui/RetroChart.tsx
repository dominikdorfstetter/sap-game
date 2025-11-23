interface RetroChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  showValues?: boolean;
  title?: string;
}

export function RetroChart({
  data,
  labels,
  height = 100,
  color = '#0af',
  showValues = false,
  title,
}: RetroChartProps) {
  if (data.length === 0) {
    return (
      <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue || 1;

  return (
    <div style={{ padding: '8px' }}>
      {title && (
        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#0af' }}>
          {title}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          height: `${height}px`,
          borderBottom: '2px solid #444',
          paddingBottom: '4px',
        }}
      >
        {data.map((value, index) => {
          const normalizedValue = ((value - minValue) / range) * 100;
          const barHeight = Math.max(normalizedValue, 2); // Minimum 2% height for visibility

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                maxWidth: '60px',
              }}
            >
              {showValues && (
                <div style={{ fontSize: '9px', color: '#0af', marginBottom: '2px', minHeight: '12px' }}>
                  {value.toFixed(0)}
                </div>
              )}
              <div
                style={{
                  width: '100%',
                  height: `${barHeight}%`,
                  backgroundColor: color,
                  border: '1px solid #000',
                  boxShadow: '0 0 2px ' + color,
                  minHeight: '2px',
                }}
                title={`${labels?.[index] || index}: ${value.toFixed(2)}`}
              />
            </div>
          );
        })}
      </div>
      {labels && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '4px',
          }}
        >
          {labels.map((label, index) => (
            <div
              key={index}
              style={{
                fontSize: '9px',
                color: '#666',
                flex: 1,
                textAlign: 'center',
                maxWidth: '60px',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface RetroLineChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  title?: string;
}

export function RetroLineChart({ data, labels, height = 80, color = '#0af', title }: RetroLineChartProps) {
  if (data.length === 0) {
    return (
      <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue || 1;
  const width = 300;
  const padding = 10;

  // Calculate points for the line
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ padding: '8px' }}>
      {title && (
        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#0af' }}>
          {title}
        </div>
      )}
      <svg
        width={width}
        height={height}
        style={{ border: '1px solid #444', backgroundColor: '#000' }}
      >
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#333" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#333" strokeWidth="1" />

        {/* Data line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          style={{ filter: `drop-shadow(0 0 2px ${color})` }}
        />

        {/* Data points */}
        {data.map((value, index) => {
          const x = padding + (index / (data.length - 1)) * (width - padding * 2);
          const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              stroke="#000"
              strokeWidth="1"
            >
              <title>{`${labels?.[index] || index}: ${value.toFixed(2)}`}</title>
            </circle>
          );
        })}
      </svg>
      {labels && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', paddingLeft: `${padding}px`, paddingRight: `${padding}px` }}>
          <div style={{ fontSize: '9px', color: '#666' }}>{labels[0]}</div>
          <div style={{ fontSize: '9px', color: '#666' }}>{labels[labels.length - 1]}</div>
        </div>
      )}
    </div>
  );
}
