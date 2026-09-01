'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Sparkles, CheckCircle2, ChevronRight, Zap, Target, Lightbulb, ShieldAlert, Layers } from 'lucide-react';
import { DOKKAI_STRATEGIES, DokkaiStrategy } from '@/lib/dokkai-data';

interface DokkaiStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DokkaiStrategyModal({ isOpen, onClose }: DokkaiStrategyModalProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<DokkaiStrategy>(DOKKAI_STRATEGIES[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-rose-500 to-indigo-600 bg-clip-text text-transparent">
                Cẩm Nang Chiến Thuật Dokkai Cho Người Còn Yếu
              </h2>
              <p className="text-xs text-muted-foreground">
                5 Bí kíp bẻ khóa bài đọc hiểu JLPT N3 không cần dịch từng chữ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Strategy Tabs / Left Sidebar */}
          <div className="md:col-span-4 p-3 sm:p-4 space-y-2 bg-muted/20">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2">
              Danh sách Bí kíp
            </span>
            {DOKKAI_STRATEGIES.map((strat) => {
              const isSelected = selectedStrategy.id === strat.id;
              return (
                <button
                  key={strat.id}
                  onClick={() => setSelectedStrategy(strat)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 font-bold'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <span className="text-xl shrink-0">{strat.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs truncate ${isSelected ? 'text-white' : 'font-semibold'}`}>
                      {strat.title}
                    </p>
                    <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-rose-100' : 'text-muted-foreground'}`}>
                      {strat.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Strategy Detail / Right Panel */}
          <div className="md:col-span-8 p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[60vh] md:max-h-full">
            {/* Header & Golden Rule */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-2xl">{selectedStrategy.icon}</span>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {selectedStrategy.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">{selectedStrategy.summary}</p>
            </div>

            {/* Golden Rule Banner */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300">
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Quy Tắc Vàng Cốt Lõi:</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold pl-6">
                {selectedStrategy.goldenRule}
              </p>
            </div>

            {/* Key Signal Keywords Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                Dấu hiệu nhận biết & Hành động tức thì
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedStrategy.keySignals.map((signal, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-border bg-card/60 hover:border-rose-500/30 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-mono">
                        {signal.keyword}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {signal.meaning}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      👉 <strong className="text-foreground">{signal.action}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Example Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" />
                Ví dụ phân tích thực tế
              </h4>
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs whitespace-pre-line leading-relaxed font-sans">
                {selectedStrategy.examplePassage}
              </div>
            </div>

            {/* Analysis Guide */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>
                <strong>Lời khuyên:</strong> {selectedStrategy.analysisGuide}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-border bg-muted/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
          >
            Đã hiểu, bắt đầu luyện tập ngay
          </button>
        </div>
      </motion.div>
    </div>
  );
}
