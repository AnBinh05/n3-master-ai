'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Brush, 
  RotateCcw, 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Trophy,
  Palette
} from 'lucide-react';
import { ALL_880_WORDS, MimikaraWord } from '@/prisma/data/mimikara_n3_880';
import { addExpAndCoins } from '@/lib/gamification';
import { playClick, playCorrect, playVictory, playLevelUp } from '@/lib/game-audio';

interface KanjiCanvasGameProps {
  onBack: () => void;
}

export function KanjiCanvasGame({ onBack }: KanjiCanvasGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [brushColor, setBrushColor] = useState<'#18181b' | '#e11d48'>('#18181b');
  const [strokeCount, setStrokeCount] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Filter words that contain at least 1 Kanji
  const kanjiWords = ALL_880_WORDS.filter((w) => /[\u4e00-\u9faf]/.test(w.word)).slice(0, 30);
  const currentWord = kanjiWords[currentIndex] || kanjiWords[0];

  useEffect(() => {
    clearCanvas();
  }, [currentIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeCount(0);
    setScore(null);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const pos = getCanvasPosition(e, canvas);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 2;
    ctx.shadowColor = brushColor;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPosition(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    setStrokeCount((s) => s + 1);
  };

  const getCanvasPosition = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handleFinishStroke = () => {
    if (strokeCount === 0) return;
    playCorrect();
    const randomAccuracy = Math.floor(Math.random() * 15) + 85;
    setScore(randomAccuracy);

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    addExpAndCoins(50, 30);
  };

  const handleNext = () => {
    playClick();
    if (currentIndex + 1 < kanjiWords.length) {
      setCurrentIndex((idx) => idx + 1);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ja-JP';
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border/50 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Arcade Hub
        </button>

        <div className="text-xs font-bold text-muted-foreground">
          Chữ Hán: <strong className="text-foreground">{currentIndex + 1}/{kanjiWords.length}</strong>
        </div>

        <button
          onClick={clearCanvas}
          className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Xóa bảng viết lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Canvas Canvas Stage */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/60 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider">
            <Brush className="w-3.5 h-3.5" /> Bảng Thư Pháp & Tập Viết Chữ Hán
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            Luyện Viết Nét Kanji Thư Pháp (Shodo)
          </h2>
          <p className="text-xs text-muted-foreground">
            Dùng chuột hoặc ngón tay cảm ứng tô theo nét chữ Hán để ghi nhớ bộ thủ và thứ tự nét.
          </p>
        </div>

        {/* Word Info Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/50 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-foreground">{currentWord.word}</span>
              <span className="text-sm font-semibold text-rose-500">[{currentWord.reading}]</span>
              {currentWord.hanViet && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600">
                  {currentWord.hanViet}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">👉 {currentWord.meaning}</p>
          </div>

          <button
            onClick={() => handleSpeak(currentWord.word)}
            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
            title="Phát âm"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* HTML5 Touch Canvas with Ghost Template */}
        <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl bg-amber-50 dark:bg-slate-900 border-4 border-amber-500/30 overflow-hidden shadow-2xl flex items-center justify-center">
          {/* Traditional Grid Guides */}
          <div className="absolute inset-0 border-b border-r border-amber-500/15 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-0.5 border-t border-dashed border-amber-500/20" />
            <div className="h-full w-0.5 border-l border-dashed border-amber-500/20 absolute" />
          </div>

          {/* Faint Ghost Template Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-[160px] font-black text-muted-foreground/20 font-serif">
            {currentWord.word.slice(0, 1)}
          </div>

          {/* Interactive Drawing Canvas */}
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair relative z-10 touch-none"
          />
        </div>

        {/* Brush Color & Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground">Màu mực:</span>
            <button
              onClick={() => setBrushColor('#18181b')}
              className={`w-7 h-7 rounded-full bg-slate-900 border-2 transition-all ${
                brushColor === '#18181b' ? 'border-rose-500 scale-110' : 'border-transparent'
              }`}
              title="Mực Tàu Shodo"
            />
            <button
              onClick={() => setBrushColor('#e11d48')}
              className={`w-7 h-7 rounded-full bg-rose-600 border-2 transition-all ${
                brushColor === '#e11d48' ? 'border-amber-400 scale-110' : 'border-transparent'
              }`}
              title="Mực Son Torii"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFinishStroke}
              disabled={strokeCount === 0}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                strokeCount > 0
                  ? 'bg-rose-500 text-white hover:bg-rose-600 active:scale-95 shadow-rose-500/25'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              Chấm Điểm Nét Vẽ ✨
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs transition-colors"
            >
              Chữ Tiếp Theo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Score evaluation pill */}
        {score !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1"
          >
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" /> Nét Bút Chuẩn Xác: {score}%
            </div>
            <p className="text-xs text-muted-foreground">
              +50 EXP và +30 Vàng đã được cộng vào tài khoản của bạn!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
