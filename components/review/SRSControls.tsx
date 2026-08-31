'use client';

import { Rating, getIntervalPreview } from '@/lib/srs';
import { RefreshCw, Zap, ThumbsUp, Sparkles } from 'lucide-react';

interface SRSControlsProps {
  easeFactor: number;
  interval: number;
  repetitions: number;
  onRating: (rating: Rating) => void;
  disabled?: boolean;
}

export function SRSControls({
  easeFactor,
  interval,
  repetitions,
  onRating,
  disabled = false,
}: SRSControlsProps) {
  const againPreview = getIntervalPreview(Rating.AGAIN, easeFactor, interval, repetitions);
  const hardPreview = getIntervalPreview(Rating.HARD, easeFactor, interval, repetitions);
  const goodPreview = getIntervalPreview(Rating.GOOD, easeFactor, interval, repetitions);
  const easyPreview = getIntervalPreview(Rating.EASY, easeFactor, interval, repetitions);

  return (
    <div className="w-full max-w-lg mx-auto grid grid-cols-4 gap-2 sm:gap-3 p-2 bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 shadow-lg">
      {/* AGAIN Button */}
      <button
        disabled={disabled}
        onClick={() => onRating(Rating.AGAIN)}
        className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold transition-all active:scale-95 disabled:opacity-50"
      >
        <span className="text-xs font-semibold opacity-80 mb-0.5">{againPreview}</span>
        <div className="flex items-center gap-1 text-xs sm:text-sm">
          <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
          <span>Chưa nhớ</span>
        </div>
      </button>

      {/* HARD Button */}
      <button
        disabled={disabled}
        onClick={() => onRating(Rating.HARD)}
        className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-white border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold transition-all active:scale-95 disabled:opacity-50"
      >
        <span className="text-xs font-semibold opacity-80 mb-0.5">{hardPreview}</span>
        <div className="flex items-center gap-1 text-xs sm:text-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>Khó</span>
        </div>
      </button>

      {/* GOOD Button */}
      <button
        disabled={disabled}
        onClick={() => onRating(Rating.GOOD)}
        className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold transition-all active:scale-95 disabled:opacity-50"
      >
        <span className="text-xs font-semibold opacity-80 mb-0.5">{goodPreview}</span>
        <div className="flex items-center gap-1 text-xs sm:text-sm">
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Nhớ rõ</span>
        </div>
      </button>

      {/* EASY Button */}
      <button
        disabled={disabled}
        onClick={() => onRating(Rating.EASY)}
        className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold transition-all active:scale-95 disabled:opacity-50"
      >
        <span className="text-xs font-semibold opacity-80 mb-0.5">{easyPreview}</span>
        <div className="flex items-center gap-1 text-xs sm:text-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rất dễ</span>
        </div>
      </button>
    </div>
  );
}
