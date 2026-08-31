'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import confetti from 'canvas-confetti';
import { 
  Clock, 
  Upload, 
  Flag, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  FileText,
  RotateCcw,
  Maximize2,
  Minimize2,
  Trophy
} from 'lucide-react';
import { 
  JLPTExam, 
  ExamQuestion, 
  ExamResult, 
  PRESET_N3_MOCK_EXAM, 
  calculateExamScore 
} from '@/lib/mock-exam';
import { addExpAndCoins } from '@/lib/gamification';
import { playClick, playCorrect, playWrong, playVictory, playLevelUp } from '@/lib/game-audio';
import { ExamUploaderModal } from '@/components/exam/ExamUploaderModal';
import { ExamAnswerSheet } from '@/components/exam/ExamAnswerSheet';
import { ExamScoreModal } from '@/components/exam/ExamScoreModal';

export default function MockTestPage() {
  const [exam, setExam] = useState<JLPTExam>(PRESET_N3_MOCK_EXAM);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(105 * 60);
  const [isExamActive, setIsExamActive] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalDurationSeconds = exam.totalDurationMinutes * 60;

  // Initialize or reset timer on exam change
  useEffect(() => {
    startExam(exam);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [exam]);

  const startExam = (targetExam: JLPTExam) => {
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions([]);
    setTimeLeftSeconds(targetExam.totalDurationMinutes * 60);
    setIsExamActive(true);
    setShowScoreModal(false);
    setExamResult(null);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Select Option for current question
  const handleSelectOption = (optIndex: number) => {
    playClick();
    const currentQ = exam.questions[currentIndex];
    if (!currentQ) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex,
    }));
  };

  // Toggle Flag for review
  const handleToggleFlag = (questionId: number) => {
    playClick();
    setFlaggedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  // Navigation handlers
  const handlePrevQuestion = () => {
    playClick();
    if (currentIndex > 0) setCurrentIndex((idx) => idx - 1);
  };

  const handleNextQuestion = () => {
    playClick();
    if (currentIndex < exam.questions.length - 1) setCurrentIndex((idx) => idx + 1);
  };

  // Submit Exam
  const handleSubmitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsExamActive(false);

    const timeSpent = totalDurationSeconds - timeLeftSeconds;
    const result = calculateExamScore(exam, userAnswers, timeSpent);
    setExamResult(result);
    setShowScoreModal(true);

    if (result.isPassed) {
      playVictory();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      const { leveledUp } = addExpAndCoins(300, 200);
      if (leveledUp) setTimeout(() => playLevelUp(), 1000);
    } else {
      playWrong();
      addExpAndCoins(100, 50);
    }
  };

  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = exam.questions[currentIndex] || exam.questions[0];
  const isTimeUrgent = timeLeftSeconds <= 15 * 60; // Less than 15 mins

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Upload Exam Modal */}
      <ExamUploaderModal
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
        onSelectExam={(newExam) => {
          setExam(newExam);
          startExam(newExam);
        }}
      />

      {/* Score Modal */}
      <ExamScoreModal
        isOpen={showScoreModal}
        result={examResult}
        onRetake={() => startExam(exam)}
        onExit={() => window.location.href = '/dashboard'}
      />

      {/* Exam Room Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 sm:p-5 rounded-3xl border border-border/60 shadow-lg">
        {/* Title & Exam Meta */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-foreground line-clamp-1">
              {exam.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              Tổng số câu: <strong>{exam.questions.length}</strong> • Thang điểm chuẩn: <strong>180đ</strong>
            </p>
          </div>
        </div>

        {/* Real-time Exam Room Clock */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm sm:text-base border shadow-sm ${
          isTimeUrgent
            ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 animate-pulse'
            : 'bg-muted/80 border-border/80 text-foreground'
        }`}>
          <Clock className="w-4 h-4 text-rose-500" />
          <span>{formatTimer(timeLeftSeconds)}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowUploader(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs transition-colors border border-border/60"
          >
            <Upload className="w-3.5 h-3.5 text-rose-500" /> Tải Đề Khác
          </button>

          <button
            onClick={handleSubmitExam}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-500/20 hover:opacity-90 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Nộp Bài Thi
          </button>
        </div>
      </div>

      {/* Main Examination Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Current Question Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/60 shadow-xl space-y-6">
            {/* Section Tag & Question Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black">
                  Câu {currentQuestion.id} / {exam.questions.length}
                </span>
                <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
                  {currentQuestion.sectionTitle}
                </span>
              </div>

              {/* Flag Button */}
              <button
                onClick={() => handleToggleFlag(currentQuestion.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  flaggedQuestions.includes(currentQuestion.id)
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedQuestions.includes(currentQuestion.id) ? 'Đã Gắn Cờ 🚩' : 'Gắn Cờ Xem Lại'}</span>
              </button>
            </div>

            {/* Reading Passage if available */}
            {currentQuestion.passageText && (
              <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/50 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line text-foreground">
                {currentQuestion.passageText}
              </div>
            )}

            {/* Question Text */}
            <div className="text-base sm:text-lg font-bold text-foreground whitespace-pre-line leading-relaxed">
              {currentQuestion.questionText}
            </div>

            {/* 4 Interactive Option Cards */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQuestion.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-4 rounded-2xl text-left font-bold text-xs sm:text-sm transition-all border flex items-center gap-3 ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-md ring-2 ring-rose-500/30'
                        : 'bg-card border-border/70 hover:border-rose-400/50 hover:bg-muted/40 text-foreground'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {optIdx + 1}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav Controls */}
            <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-4">
              <button
                onClick={handlePrevQuestion}
                disabled={currentIndex === 0}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs transition-colors ${
                  currentIndex > 0
                    ? 'bg-muted hover:bg-muted/80 text-foreground'
                    : 'bg-muted/40 text-muted-foreground/40 cursor-not-allowed'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Câu Trước
              </button>

              <div className="text-xs font-bold text-muted-foreground">
                Đã tô: <strong>{Object.keys(userAnswers).length}</strong> / {exam.questions.length}
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={currentIndex === exam.questions.length - 1}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl font-black text-xs transition-all ${
                  currentIndex < exam.questions.length - 1
                    ? 'bg-foreground text-background hover:opacity-90'
                    : 'bg-muted/40 text-muted-foreground/40 cursor-not-allowed'
                }`}
              >
                Câu Kế Tiếp <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: OMR Answer Sheet & Quick Tools */}
        <div className="space-y-6">
          <ExamAnswerSheet
            questions={exam.questions}
            currentIndex={currentIndex}
            answers={userAnswers}
            flaggedQuestions={flaggedQuestions}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
            onToggleFlag={handleToggleFlag}
          />

          {/* Quick Shortcuts Helper Card */}
          <div className="p-4 rounded-3xl bg-muted/40 border border-border/50 text-xs space-y-2 text-muted-foreground">
            <span className="font-bold text-foreground block">💡 Lời khuyên phòng thi JLPT:</span>
            <p>• Phân bổ thời gian: Khoảng 1 - 2 phút cho mỗi câu Chữ Hán, 3 - 5 phút cho câu Đọc hiểu.</p>
            <p>• Những câu chưa chắc chắn hãy bấm <strong>🚩 Gắn Cờ</strong> để quay lại kiểm tra trước khi hết giờ.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
