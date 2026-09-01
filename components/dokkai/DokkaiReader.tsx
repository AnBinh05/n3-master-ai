'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Volume2, 
  VolumeX, 
  Languages, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Layers, 
  RotateCcw, 
  Award, 
  Coins, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  ShieldAlert, 
  Zap,
  Play,
  Pause
} from 'lucide-react';
import { DokkaiPassage, DokkaiQuestion, SentenceAnalysis } from '@/lib/dokkai-data';
import { addExpAndCoins } from '@/lib/gamification';
import { playClick, playCorrect, playWrong, playVictory } from '@/lib/game-audio';

interface DokkaiReaderProps {
  passage: DokkaiPassage;
  onBack: () => void;
  onNextPassage?: () => void;
}

export function DokkaiReader({ passage, onBack, onNextPassage }: DokkaiReaderProps) {
  // Scaffolding Display States for Struggling Learners
  const [showFurigana, setShowFurigana] = useState(true);
  const [showTranslations, setShowTranslations] = useState(false);
  const [highlightClues, setHighlightClues] = useState(false);
  const [showVocabSheet, setShowVocabSheet] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);

  // Audio / TTS States
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  // User Answers & Exam State
  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number; expGained: number; coinsGained: number } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer
  useEffect(() => {
    setElapsedSeconds(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(null);
    setActiveSentenceIndex(null);

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [passage.id]);

  // Handle TTS Web Speech
  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(passage.plainPassage);
    utterance.lang = 'ja-JP';
    utterance.rate = audioSpeed;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleSelectOption = (questionId: number, optIndex: number) => {
    if (isSubmitted) return;
    playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optIndex,
    }));
  };

  // Submit and Calculate Score
  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let correct = 0;
    passage.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    const isAllCorrect = correct === passage.questions.length;
    const expGained = correct * 25 + (isAllCorrect ? 30 : 10);
    const coinsGained = correct * 10 + (isAllCorrect ? 15 : 5);

    // Save Gamification
    addExpAndCoins(expGained, coinsGained);

    if (isAllCorrect) {
      playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else if (correct > 0) {
      playCorrect();
    } else {
      playWrong();
    }

    setScore({
      correct,
      total: passage.questions.length,
      expGained,
      coinsGained,
    });
    setIsSubmitted(true);
    // Tự động bật soi manh mối khi nộp bài để người học đối chiếu
    setHighlightClues(true);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Trở lại danh sách</span>
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${passage.badgeColor}`}>
              {passage.levelLabel}
            </span>
            <span className="text-xs text-muted-foreground font-medium hidden md:inline">
              Mục tiêu: {passage.targetSkill}
            </span>
          </div>
        </div>

        {/* Stopwatch & Audio Control */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted/60 border border-border text-xs font-mono font-bold text-foreground">
            <span className="text-muted-foreground text-[10px]">Thời gian:</span>
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isPlayingAudio
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
            }`}
            title="Nghe giọng đọc tiếng Nhật bản ngữ"
          >
            {isPlayingAudio ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Đang đọc</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span>Nghe Audio</span>
              </>
            )}
          </button>

          {/* Speed Toggle */}
          <select
            value={audioSpeed}
            onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
            className="px-2 py-1 rounded-xl border border-border bg-background text-[11px] font-bold text-foreground focus:outline-none"
            title="Tốc độ đọc"
          >
            <option value="0.8">0.8x (Chậm)</option>
            <option value="1.0">1.0x (Chuẩn)</option>
            <option value="1.2">1.2x (Nhanh)</option>
          </select>
        </div>
      </div>

      {/* WEAK-LEARNER SCAFFOLDING TOOLBAR (BẢNG CÔNG CỤ TRỢ LỰC CHO NGƯỜI YẾU) */}
      <div className="p-3 sm:p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-foreground block">
              Trợ Lực Đọc Hiểu (Dành Cho Người Còn Yếu)
            </span>
            <span className="text-[10px] text-muted-foreground">
              Bật các công cụ bên dưới để bẻ khóa bài đọc dễ dàng
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Furigana Toggle */}
          <button
            onClick={() => setShowFurigana(!showFurigana)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showFurigana
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-muted/60 border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {showFurigana ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>Furigana</span>
          </button>

          {/* Translation Toggle */}
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showTranslations
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-700 dark:text-indigo-300'
                : 'bg-muted/60 border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Languages className="h-3.5 w-3.5" />
            <span>Dịch từng câu</span>
          </button>

          {/* Clue Highlighter Toggle */}
          <button
            onClick={() => setHighlightClues(!highlightClues)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              highlightClues
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
            }`}
            title="Tự động làm sáng các câu văn chứa câu trả lời"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>💡 Soi Manh Mối</span>
          </button>

          {/* Pre-reading Vocab Sheet */}
          <button
            onClick={() => setShowVocabSheet(!showVocabSheet)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showVocabSheet
                ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Từ vựng trước khi đọc ({passage.preReadingVocab.length})</span>
          </button>
        </div>
      </div>

      {/* PRE-READING VOCABULARY POPUP / ACCORDION */}
      <AnimatePresence>
        {showVocabSheet && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl border border-rose-500/30 bg-card shadow-lg space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-rose-500" />
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Bảng từ vựng chuẩn bị trước khi đọc (Xem trước để không bị ngợp)
                </h4>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Tip: Đọc qua nghĩa 1 lần trước khi vào bài đọc chính!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {passage.preReadingVocab.map((v, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-border bg-muted/20 hover:border-rose-500/40 transition-all text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span className="text-sm text-rose-600 dark:text-rose-400 font-mono">
                      {v.word}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      {v.reading}
                    </span>
                  </div>
                  {v.hanViet && (
                    <span className="text-[10px] text-indigo-500 font-semibold block mt-0.5">
                      Hán Việt: {v.hanViet}
                    </span>
                  )}
                  <p className="mt-1 text-xs text-foreground font-medium">{v.meaning}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN TWO-COLUMN WORKSPACE: LEFT PASSAGE, RIGHT QUESTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PASSAGE & SENTENCE BREAKDOWN */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm space-y-5">
            {/* Passage Header */}
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-foreground">
                  {passage.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Thể loại: {passage.category} • Thời lượng đề xuất: {passage.estimatedMinutes} phút
                </p>
              </div>
            </div>

            {/* Reading Box */}
            <div className="relative">
              {/* Sentence-by-Sentence Assisted Reader */}
              <div className="space-y-3">
                {passage.sentenceBreakdown.map((s, idx) => {
                  const isClue = highlightClues && s.isClue;
                  const isSelected = activeSentenceIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveSentenceIndex(isSelected ? null : idx)}
                      className={`p-3 rounded-xl transition-all cursor-pointer border ${
                        isClue
                          ? 'border-amber-500/80 bg-amber-500/10 ring-2 ring-amber-500/30'
                          : isSelected
                            ? 'border-rose-500 bg-rose-500/5'
                            : 'border-transparent hover:bg-muted/40'
                      }`}
                    >
                      {/* Japanese Sentence */}
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground shrink-0 mt-1 select-none">
                          [{idx + 1}]
                        </span>
                        <div className="flex-1">
                          {showFurigana && s.furiganaHtml ? (
                            <p
                              className="text-base sm:text-lg font-medium leading-loose text-foreground"
                              dangerouslySetInnerHTML={{ __html: s.furiganaHtml }}
                            />
                          ) : (
                            <p className="text-base sm:text-lg font-medium leading-relaxed text-foreground">
                              {s.jp}
                            </p>
                          )}
                        </div>

                        {isClue && (
                          <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm animate-bounce">
                            <Lightbulb className="h-3 w-3" /> Manh mối
                          </span>
                        )}
                      </div>

                      {/* Sentence Translation (If Toggled) */}
                      {(showTranslations || isSelected) && (
                        <div className="mt-2 pl-6 pt-2 border-t border-border/50 text-xs text-muted-foreground leading-relaxed">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">Dịch nghĩa: </span>
                          {s.vi}
                        </div>
                      )}

                      {/* Detailed Sentence Anatomy (Subject - Predicate - Connector) */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pl-6 pt-2 border-t border-dashed border-border space-y-1.5 text-xs"
                        >
                          <div className="font-bold text-rose-500 uppercase tracking-wider text-[10px]">
                            🔍 Giải phẫu cấu trúc câu #{idx + 1}:
                          </div>
                          {s.subject && (
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 font-semibold text-[10px]">
                                Chủ ngữ
                              </span>
                              <span className="text-foreground">{s.subject}</span>
                            </div>
                          )}
                          {s.predicate && (
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold text-[10px]">
                                Vị ngữ / Động từ
                              </span>
                              <span className="text-foreground">{s.predicate}</span>
                            </div>
                          )}
                          {s.connector && (
                            <div className="flex items-start gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 font-semibold text-[10px] shrink-0">
                                Liên từ nối
                              </span>
                              <span className="text-foreground font-medium">
                                {s.connector} {s.connectorNote ? `(${s.connectorNote})` : ''}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grammar Notes Box */}
            {passage.grammarNotes && passage.grammarNotes.length > 0 && (
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1.5 text-xs">
                <span className="font-bold text-foreground text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  Điểm Ngữ Pháp N3 Xuất Hiện Trong Bài:
                </span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                  {passage.grammarNotes.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: QUESTIONS & TACTICAL ANALYSIS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-rose-500" />
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
                  Câu Hỏi Đọc Hiểu ({passage.questions.length} câu)
                </h3>
              </div>
              <span className="text-xs text-muted-foreground">
                Đã chọn {Object.keys(userAnswers).length}/{passage.questions.length}
              </span>
            </div>

            {/* Question Items */}
            <div className="space-y-6">
              {passage.questions.map((q, qIndex) => {
                const selectedOpt = userAnswers[q.id];
                const isAnswered = selectedOpt !== undefined;

                return (
                  <div key={q.id} className="space-y-3 p-4 rounded-xl border border-border/80 bg-background/50">
                    {/* Question Text */}
                    <div className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white text-[11px] font-bold">
                        {qIndex + 1}
                      </span>
                      <h4 className="text-sm font-bold text-foreground leading-snug">
                        {q.question}
                      </h4>
                    </div>

                    {/* 4 Options */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        const isCorrectOpt = q.correctIndex === optIdx;

                        let buttonStyles = 'border-border bg-card hover:bg-muted/60 text-foreground';

                        if (isSubmitted) {
                          if (isCorrectOpt) {
                            buttonStyles = 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold';
                          } else if (isChosen && !isCorrectOpt) {
                            buttonStyles = 'border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-300 line-through';
                          }
                        } else if (isChosen) {
                          buttonStyles = 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold ring-1 ring-rose-500';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 text-xs ${buttonStyles}`}
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-current text-[11px] font-bold">
                              {optIdx + 1}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt}</span>
                            {isSubmitted && isCorrectOpt && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                            )}
                            {isSubmitted && isChosen && !isCorrectOpt && (
                              <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Tactical Hint (Khi chưa nộp bài hoặc bấm muốn xem) */}
                    {q.tacticalHint && !isSubmitted && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] flex items-start gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-500 mt-0.5" />
                        <span><strong>Mẹo chiến thuật:</strong> {q.tacticalHint}</span>
                      </div>
                    )}

                    {/* Explanation & Trap Analysis (Khi đã nộp bài) */}
                    {isSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2.5 text-xs"
                      >
                        <div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                            💡 Giải thích đáp án đúng:
                          </span>
                          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>

                        {q.trapAnalysis && q.trapAnalysis.length > 0 && (
                          <div className="pt-2 border-t border-border/50">
                            <span className="font-bold text-rose-500 block mb-1 flex items-center gap-1">
                              <ShieldAlert className="h-3.5 w-3.5" /> Phân tích bẫy các phương án sai:
                            </span>
                            <div className="space-y-1.5 text-[11px] text-muted-foreground">
                              {q.trapAnalysis.map((trap, tIdx) => (
                                <p key={tIdx}>
                                  • <strong className="text-foreground">Đáp án {trap.optionIndex + 1}:</strong> {trap.reason}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit / Complete Button */}
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length === 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Nộp Bài & Xem Phân Tích Chi Tiết</span>
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                {/* Score Summary Box */}
                {score && (
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-black text-lg">
                      <Award className="h-5 w-5" />
                      <span>
                        Kết Quả: {score.correct} / {score.total} Câu Đúng
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs font-bold text-foreground">
                      <span className="text-rose-500">+{score.expGained} EXP</span>
                      <span className="text-amber-500 flex items-center gap-1">
                        <Coins className="h-3.5 w-3.5 fill-amber-500" />
                        +{score.coinsGained} Xu
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setUserAnswers({});
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-bold text-foreground flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Làm lại</span>
                  </button>

                  {onNextPassage && (
                    <button
                      type="button"
                      onClick={onNextPassage}
                      className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5"
                    >
                      <span>Bài tiếp theo</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
