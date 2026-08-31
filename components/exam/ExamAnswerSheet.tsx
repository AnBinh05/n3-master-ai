'use client';

import React from 'react';
import { ExamQuestion } from '@/lib/mock-exam';
import { Flag, CheckCircle, Clock } from 'lucide-react';
import { playClick } from '@/lib/game-audio';

interface ExamAnswerSheetProps {
  questions: ExamQuestion[];
  currentIndex: number;
  answers: { [questionId: number]: number };
  flaggedQuestions: number[];
  onSelectQuestion: (index: number) => void;
  onToggleFlag: (questionId: number) => void;
}

export function ExamAnswerSheet({
  questions,
  currentIndex,
  answers,
  flaggedQuestions,
  onSelectQuestion,
  onToggleFlag,
}: ExamAnswerSheetProps) {
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = flaggedQuestions.length;

  return (
    <div className="p-5 rounded-3xl bg-card border border-border/60 shadow-lg space-y-4">
      {/* Title & Stats */}
      <div className="space-y-2 border-b border-border/50 pb-3">
        <h4 className="font-black text-sm text-foreground flex items-center justify-between">
          <span>Phiếu Tô Đáp Án (OMR Sheet)</span>
          <span className="text-xs text-rose-500 font-bold">
            {answeredCount}/{questions.length}
          </span>
        </h4>

        {/* Legend pills */}
        <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-center">
            Đã làm: {answeredCount}
          </div>
          <div className="p-1.5 rounded-lg bg-muted text-muted-foreground text-center">
            Chưa: {unansweredCount}
          </div>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-center">
            Gắn cờ: {flaggedCount} 🚩
          </div>
        </div>
      </div>

      {/* Bubble Grid */}
      <div className="max-h-[360px] overflow-y-auto pr-1">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isFlagged = flaggedQuestions.includes(q.id);
            const isCurrent = currentIndex === idx;

            return (
              <button
                key={q.id}
                onClick={() => {
                  playClick();
                  onSelectQuestion(idx);
                }}
                className={`relative h-10 rounded-xl font-black text-xs transition-all flex items-center justify-center border ${
                  isCurrent
                    ? 'border-rose-500 ring-2 ring-rose-500/40 bg-rose-500/15 text-rose-600 scale-105 z-10'
                    : isAnswered
                      ? 'bg-emerald-500 text-white border-transparent shadow-sm'
                      : 'bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {q.id}

                {/* Flag Icon Indicator */}
                {isFlagged && (
                  <span className="absolute -top-1.5 -right-1 text-[10px]">🚩</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
