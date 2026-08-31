import { HeatmapCalendar } from '@/components/stats/HeatmapCalendar';
import { RetentionChart } from '@/components/stats/RetentionChart';
import { BarChart3, Flame, Award, CheckCircle2, BookOpen } from 'lucide-react';

export default function StatsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-black text-foreground flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-rose-500" /> Báo Cáo & Thống Kê Học Tập
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Theo dõi sát sao tiến độ ghi nhớ SRS và khả năng hoàn thành mục tiêu JLPT N3.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-3xl font-black text-foreground">7 Ngày</div>
            <div className="text-xs font-semibold text-muted-foreground">Streak Liên Tục</div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-500">93.4%</div>
            <div className="text-xs font-semibold text-muted-foreground">Tỷ Lệ Nhớ Thẻ (Retention)</div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-black text-rose-500">Mastered</div>
            <div className="text-xs font-semibold text-muted-foreground">Trạng Thái Ôn Tập</div>
          </div>
        </div>
      </div>

      {/* Recharts retention & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RetentionChart />
        <HeatmapCalendar />
      </div>

      {/* Card Mastery Distribution */}
      <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-500" /> Phân Phối Trạng Thái Thẻ (Card Mastery)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-muted/50 border border-border text-center">
            <div className="text-2xl font-black text-rose-500">45</div>
            <div className="text-xs font-semibold text-muted-foreground mt-1">Mới (New)</div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/50 border border-border text-center">
            <div className="text-2xl font-black text-amber-500">30</div>
            <div className="text-xs font-semibold text-muted-foreground mt-1">Đang Học (Learning)</div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/50 border border-border text-center">
            <div className="text-2xl font-black text-indigo-500">55</div>
            <div className="text-xs font-semibold text-muted-foreground mt-1">Ôn Lại (Review)</div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/50 border border-border text-center">
            <div className="text-2xl font-black text-emerald-500">120</div>
            <div className="text-xs font-semibold text-muted-foreground mt-1">Thành Thục (Graduated)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
