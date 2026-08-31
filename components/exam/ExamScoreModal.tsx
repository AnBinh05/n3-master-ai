'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Coins, 
  Zap,
  Sparkles
} from 'lucide-react';
import { ExamResult } from '@/lib/mock-exam';
import { playClick } from '@/lib/game-audio';

interface ExamScoreModalProps {
  isOpen: boolean;
  result: ExamResult | null;
  onRetake: () => void;
  onExit: () => void;
}

export function ExamScoreModal({ isOpen, result, onRetake, onExit }: ExamScoreModalProps) {
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'REVIEW'>('SUMMARY');
  const [filterWrongOnly, setFilterWrongOnly] = useState(false);

  if (!isOpen || !result) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins} phút ${rem < 10 ? '0' : ''}${rem} giây`;
  };

  const displayedQuestions = filterWrongOnly
    ? result.details.filter((d) => !d.isCorrect)
    : result.details;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] rounded-3xl bg-card border border-border/80 shadow-2xl p-6 sm:p-8 overflow-hidden flex flex-col">
        {/* Glow */}
        <div className={`absolute -top-20 -left-20 w-56 h-56 rounded-full blur-3xl pointer-events-none ${
          result.isPassed ? 'bg-emerald-500/20' : 'bg-rose-500/20'
        }`} />

        {/* Header Title */}
        <div className="flex items-center justify-between pb-4 border-b border-border/50 shrink-0">
          <div>
            <div className="text-xs font-black text-rose-500 uppercase tracking-widest">
              Bảng Điểm Đánh Giá Chuẩn JLPT N3
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              {result.examTitle}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-2xl">
            <button
              onClick={() => setActiveTab('SUMMARY')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'SUMMARY' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Tổng Kết
            </button>
            <button
              onClick={() => setActiveTab('REVIEW')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'REVIEW' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Xem Chi Tiết Bài Làm ({result.details.length})
            </button>
          </div>
        </div>

        {/* Modal Body Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 text-xs sm:text-sm">
          {activeTab === 'SUMMARY' ? (
            <div className="space-y-6">
              {/* Official Result Banner */}
              <div className={`p-6 rounded-3xl border-2 text-center space-y-3 shadow-lg ${
                result.isPassed
                  ? 'bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-card border-emerald-500/50'
                  : 'bg-gradient-to-b from-rose-500/15 via-pink-500/10 to-card border-rose-500/50'
              }`}>
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-md ${
                  result.isPassed
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white'
                    : 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white'
                }`}>
                  {result.isPassed ? <Trophy className="w-9 h-9" /> : <Award className="w-9 h-9" />}
                </div>

                <div>
                  <span className={`text-2xl sm:text-4xl font-black block tracking-tight ${
                    result.isPassed ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {result.isPassed ? '合格 (ĐẠT - PASS)' : '不合格 (CHƯA ĐẠT - FAIL)'}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.isPassed
                      ? 'Xin chúc mừng! Bạn đã xuất sắc vượt qua bài thi chuẩn JLPT N3!'
                      : 'Đừng nản lòng! Hãy ôn lại các câu sai để chuẩn bị tốt hơn cho kỳ thi thật!'}
                  </p>
                </div>

                {/* Score Big Display */}
                <div className="inline-block p-4 rounded-2xl bg-card border border-border/60 shadow-inner">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">
                    Tổng Điểm Chuẩn JLPT N3
                  </span>
                  <span className="text-3xl sm:text-5xl font-black text-foreground">
                    {result.totalScore} <span className="text-lg text-muted-foreground font-semibold">/ 180 Điểm</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-1">
                    (Điểm chuẩn đậu N3: ≥ 95/180 điểm & Không môn nào bị điểm liệt)
                  </span>
                </div>
              </div>

              {/* Section Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vocab Section */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-foreground">1. Chữ Hán & Từ Vựng</span>
                    <span className={`text-base font-black ${
                      result.vocabScore >= 19 ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {result.vocabScore} / 60 Điểm
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${(result.vocabScore / 60) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground block">
                    {result.vocabScore >= 19 ? '✅ Đạt điểm sàn' : '⚠️ Dưới điểm sàn (Liệt < 19đ)'}
                  </span>
                </div>

                {/* Grammar & Reading Section */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-foreground">2. Ngữ Pháp & Đọc Hiểu</span>
                    <span className={`text-base font-black ${
                      result.grammarReadingScore >= 38 ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {result.grammarReadingScore} / 120 Điểm
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${(result.grammarReadingScore / 120) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground block">
                    {result.grammarReadingScore >= 38 ? '✅ Đạt điểm sàn' : '⚠️ Dưới điểm sàn (Liệt < 38đ)'}
                  </span>
                </div>
              </div>

              {/* Stats & Rewards Banner */}
              <div className="p-4 rounded-2xl bg-card border border-border/50 flex items-center justify-between flex-wrap gap-4 text-xs">
                <div>
                  Thời gian làm bài: <strong>{formatTime(result.timeSpentSeconds)}</strong>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-500 font-bold">Đúng: {result.correctCount} câu</span>
                  <span className="text-rose-500 font-bold">Sai: {result.wrongCount} câu</span>
                </div>
              </div>
            </div>
          ) : (
            /* Review Questions Breakdown */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">
                  Danh sách {displayedQuestions.length} câu hỏi:
                </span>

                <button
                  onClick={() => setFilterWrongOnly(!filterWrongOnly)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    filterWrongOnly
                      ? 'bg-rose-500 text-white'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filterWrongOnly ? 'Hiện tất cả' : 'Chỉ xem câu làm sai'}
                </button>
              </div>

              {displayedQuestions.map((item, idx) => (
                <div
                  key={item.question.id}
                  className={`p-4 rounded-2xl border space-y-3 ${
                    item.isCorrect
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-rose-500/5 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center font-black text-xs">
                        {item.question.id}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        {item.question.sectionTitle}
                      </span>
                    </div>

                    <span className={`text-xs font-black flex items-center gap-1 ${
                      item.isCorrect ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {item.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {item.isCorrect ? 'Đúng' : 'Sai'}
                    </span>
                  </div>

                  {/* Passage Text if reading */}
                  {item.question.passageText && (
                    <div className="p-3 rounded-xl bg-card border border-border/50 text-xs font-medium text-muted-foreground">
                      {item.question.passageText}
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="font-bold text-sm text-foreground whitespace-pre-line">
                    {item.question.questionText}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {item.question.options.map((opt, optIdx) => {
                      const isCorrectAnswer = optIdx === item.question.correctIndex;
                      const isUserChoice = optIdx === item.userChoice;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border font-medium ${
                            isCorrectAnswer
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300 font-bold'
                              : isUserChoice
                                ? 'bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-300 font-bold'
                                : 'bg-card border-border/40 text-muted-foreground'
                          }`}
                        >
                          <span className="font-black mr-1.5">{optIdx + 1}.</span>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="p-3 rounded-xl bg-card border border-border/40 text-xs text-muted-foreground">
                    💡 <strong>Giải thích:</strong> {item.question.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onExit}
            className="px-5 py-2.5 rounded-xl bg-muted text-foreground font-bold text-xs hover:bg-muted/80 transition-colors"
          >
            Về Trang Chủ
          </button>

          <button
            onClick={onRetake}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-500/20 hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Làm Lại Đề Này
          </button>
        </div>
      </div>
    </div>
  );
}
