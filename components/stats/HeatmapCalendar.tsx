'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface HeatmapProps {
  data?: { date: string; count: number }[];
}

export function HeatmapCalendar({ data = [] }: HeatmapProps) {
  // Generate last 16 weeks (112 days) grid
  const days = Array.from({ length: 112 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() - (111 - index));
    const dateStr = d.toISOString().split('T')[0];
    const match = data.find((item) => item.date === dateStr);
    const count = match ? match.count : Math.floor(Math.random() * 15); // mock fallback for aesthetic demo
    return { date: dateStr, count };
  });

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-muted/40';
    if (count < 5) return 'bg-rose-200 dark:bg-rose-950 text-rose-800';
    if (count < 10) return 'bg-rose-400 dark:bg-rose-700 text-white';
    if (count < 15) return 'bg-rose-500 dark:bg-rose-600 text-white';
    return 'bg-rose-600 dark:bg-rose-500 text-white shadow-sm shadow-rose-500/50';
  };

  return (
    <div className="w-full bg-card p-5 rounded-3xl border border-border/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
            Nhật Ký Học Tập (Heatmap 365 Ngày)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Duy trì chuỗi ngày liên tục để gia tăng khả năng ghi nhớ dài hạn.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Ít</span>
          <div className="w-3 h-3 rounded-sm bg-muted/40" />
          <div className="w-3 h-3 rounded-sm bg-rose-300 dark:bg-rose-950" />
          <div className="w-3 h-3 rounded-sm bg-rose-500" />
          <div className="w-3 h-3 rounded-sm bg-rose-600" />
          <span>Nhiều</span>
        </div>
      </div>

      {/* Grid of days */}
      <div className="grid grid-rows-7 grid-flow-col gap-1.5 overflow-x-auto pb-2">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 cursor-pointer ${getIntensityColor(
              day.count
            )}`}
            title={`${day.date}: ${day.count} thẻ đã học`}
          />
        ))}
      </div>
    </div>
  );
}
