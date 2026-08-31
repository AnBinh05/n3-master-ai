'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const mockData = [
  { day: 'T2', cards: 25, retention: 88 },
  { day: 'T3', cards: 40, retention: 92 },
  { day: 'T4', cards: 35, retention: 85 },
  { day: 'T5', cards: 50, retention: 95 },
  { day: 'T6', cards: 65, retention: 91 },
  { day: 'T7', cards: 80, retention: 94 },
  { day: 'CN', cards: 60, retention: 96 },
];

export function RetentionChart() {
  return (
    <div className="w-full bg-card p-5 rounded-3xl border border-border/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Tỷ Lệ Ghi Nhớ (Retention Rate)</h3>
          <p className="text-xs text-muted-foreground">Tỷ lệ trả lời đúng theo thời gian ôn tập SRS</p>
        </div>
        <span className="text-2xl font-black text-rose-500">93.4%</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E53E3E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#E53E3E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="retention"
              stroke="#E53E3E"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRetention)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
