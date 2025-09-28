import { FC, useId, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { MetricSeries } from '../types';

interface MetricTrendChartProps {
  series: MetricSeries;
}

const MetricTooltip: FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-4 shadow-sm px-3 py-2 small">
      <div className="text-muted">{label}</div>
      <div className="fw-semibold">{payload[0].value}</div>
    </div>
  );
};

const MetricTrendChart: FC<MetricTrendChartProps> = ({ series }) => {
  const gradientId = useId();
  const RANGE_OPTIONS: { id: '3m' | '6m' | '12m' | 'ytd'; label: string; months: number | 'all' }[] = [
    { id: '3m', label: '3m', months: 3 },
    { id: '6m', label: '6m', months: 6 },
    { id: '12m', label: '12m', months: 12 },
    { id: 'ytd', label: 'ytd', months: 'all' }
  ];

  const [range, setRange] = useState<'3m' | '6m' | '12m' | 'ytd'>('ytd');

  const data = useMemo(() => {
    const selected = RANGE_OPTIONS.find((option) => option.id === range);
    if (!selected || selected.months === 'all') {
      return series.points;
    }
    const count = selected.months;
    return series.points.slice(-count);
  }, [range, series.points]);

  return (
    <div className="gradient-ghost rounded-4 p-4" style={{ minHeight: 220 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className="section-title d-block">{series.name}</span>
          {series.unit && <span className="text-muted small">{series.unit}</span>}
        </div>
        <div className="btn-group btn-group-sm" role="group" aria-label="Metric range">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`btn ${
                range === option.id
                  ? 'btn-gradient text-white'
                  : 'btn-outline-secondary bg-white border-0'
              }`}
              onClick={() => setRange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(223, 151, 200, 1)" />
                <stop offset="100%" stopColor="rgba(123, 128, 184, 1)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(123, 128, 184, 0.2)" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#6c6a78' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6c6a78' }} axisLine={false} tickLine={false} width={48} />
            <Tooltip content={<MetricTooltip />} cursor={{ stroke: 'rgba(123, 128, 184, 0.25)', strokeWidth: 2 }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={`url(#${gradientId})`}
              strokeWidth={3}
              dot={{ stroke: '#2e2c35', strokeWidth: 1.5, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricTrendChart;
