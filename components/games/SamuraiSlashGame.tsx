'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Heart, 
  Trophy, 
  Zap, 
  Coins, 
  ArrowLeft, 
  Volume2, 
  Flame,
  Swords
} from 'lucide-react';
import { ALL_880_WORDS, MimikaraWord } from '@/prisma/data/mimikara_n3_880';
import { addExpAndCoins, unlockAchievement } from '@/lib/gamification';
import { 
  playClick, 
  playSlash, 
  playWrong, 
  playCombo, 
  playVictory,
  playLevelUp 
} from '@/lib/game-audio';

interface SamuraiSlashGameProps {
  onBack: () => void;
}

interface SlasherTarget {
  id: string;
  word: MimikaraWord;
  isCorrect: boolean;
  xPercent: number; // 10% to 80%
  yPercent: number; // 0% down to 100%
  isSlashed: boolean;
}

export function SamuraiSlashGame({ onBack }: SamuraiSlashGameProps) {
  const [currentPrompt, setCurrentPrompt] = useState<{
    targetWord: MimikaraWord;
    questionText: string;
    subText?: string;
  } | null>(null);

  const [targets, setTargets] = useState<SlasherTarget[]>([]);
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [slashesCount, setSlashesCount] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gamePaused, setGamePaused] = useState<boolean>(false);
  const [slashEffect, setSlashEffect] = useState<{ x: number; y: number } | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const speedRef = useRef<number>(12); // Fall speed percent per second

  useEffect(() => {
    startNewGame();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const startNewGame = () => {
    setLives(3);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setSlashesCount(0);
    setGameOver(false);
    setGamePaused(false);
    speedRef.current = 14;
    generateNextWave();
  };

  const generateNextWave = () => {
    // Pick 1 correct target word and 2-3 distractors
    const shuffled = [...ALL_880_WORDS].sort(() => Math.random() - 0.5);
    const targetWord = shuffled[0];
    const distractors = shuffled.slice(1, 4);

    const questionType = Math.random() > 0.4 ? 'MEANING' : 'READING';
    const questionText = questionType === 'MEANING' 
      ? `Chém từ có nghĩa: "${targetWord.meaning}"`
      : `Chém từ có cách đọc: "${targetWord.reading}"`;

    setCurrentPrompt({
      targetWord,
      questionText,
      subText: targetWord.hanViet ? `Âm Hán: ${targetWord.hanViet}` : undefined,
    });

    // Create falling candidate orbs at horizontal slots
    const allCandidates = [targetWord, ...distractors].sort(() => Math.random() - 0.5);
    const slots = [12, 36, 60, 82]; // X percentages

    const newTargets: SlasherTarget[] = allCandidates.map((word, idx) => ({
      id: `${word.num}_${Date.now()}_${idx}`,
      word,
      isCorrect: word.num === targetWord.num,
      xPercent: slots[idx] || 50,
      yPercent: -15 - idx * 8, // Staggered drop
      isSlashed: false,
    }));

    setTargets(newTargets);
    lastTimeRef.current = Date.now();
  };

  // Falling animation loop
  useEffect(() => {
    if (gameOver || gamePaused || targets.length === 0) return;

    const loop = () => {
      const now = Date.now();
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setTargets((prevTargets) => {
        let reachedBottom = false;
        const updated = prevTargets.map((t) => {
          if (t.isSlashed) return t;
          const nextY = t.yPercent + speedRef.current * deltaSec;
          if (nextY >= 95 && t.isCorrect) {
            reachedBottom = true;
          }
          return { ...t, yPercent: nextY };
        });

        if (reachedBottom) {
          handleMissTarget();
          return [];
        }

        return updated;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameOver, gamePaused, targets]);

  const handleMissTarget = () => {
    playWrong();
    setCombo(0);
    setLives((prev) => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        handleGameOver();
      } else {
        generateNextWave();
      }
      return nextLives;
    });
  };

  const handleSlashTarget = (target: SlasherTarget, e: React.MouseEvent) => {
    if (target.isSlashed || gameOver) return;

    // Visual Katana Slash position
    const rect = e.currentTarget.getBoundingClientRect();
    setSlashEffect({ x: e.clientX, y: e.clientY });
    setTimeout(() => setSlashEffect(null), 300);

    if (target.isCorrect) {
      // SLASH SUCCESS!
      playSlash();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      playCombo(newCombo);

      const addedScore = 150 + newCombo * 25;
      setScore((s) => s + addedScore);
      setSlashesCount((c) => c + 1);

      // Increase speed slightly
      speedRef.current = Math.min(32, speedRef.current + 0.8);

      if (newCombo >= 10) {
        unlockAchievement('samurai_combo');
      }

      setTargets((prev) =>
        prev.map((t) => (t.id === target.id ? { ...t, isSlashed: true } : t))
      );

      // Confetti on big combo
      if (newCombo % 5 === 0) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }

      // Next wave after brief delay
      setTimeout(() => {
        generateNextWave();
      }, 400);
    } else {
      // SLASH WRONG TARGET
      playWrong();
      setCombo(0);
      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          handleGameOver();
        }
        return nextLives;
      });
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const expGain = Math.round(score / 15) + slashesCount * 5;
    const coinGain = Math.round(score / 30) + slashesCount * 3;

    const { leveledUp } = addExpAndCoins(expGain, coinGain);
    if (leveledUp) {
      setTimeout(() => playLevelUp(), 800);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border/50 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Arcade Hub
        </button>

        {/* Lives, Score & Combo */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Katana Lives */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-5 h-5 transition-all ${
                  heart <= lives
                    ? 'text-rose-500 fill-rose-500 scale-110'
                    : 'text-muted-foreground/30 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
            <Trophy className="w-4 h-4" />
            <span>{score}</span>
          </div>

          {/* Combo */}
          {combo > 1 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-500/20"
            >
              ⚔️ Combo x{combo}
            </motion.div>
          )}
        </div>

        <button
          onClick={startNewGame}
          className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Bắt đầu lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Target Mission Banner */}
      {currentPrompt && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-500/15 via-purple-500/10 to-amber-500/15 border-2 border-rose-500/30 text-center space-y-1 shadow-md">
          <div className="text-xs font-black uppercase text-rose-500 tracking-wider flex items-center justify-center gap-1.5">
            <Swords className="w-4 h-4" /> Nhiệm Vụ Kiếm Khách
          </div>
          <h2 className="text-lg sm:text-xl font-black text-foreground">
            {currentPrompt.questionText}
          </h2>
          {currentPrompt.subText && (
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {currentPrompt.subText}
            </span>
          )}
        </div>
      )}

      {/* Slasher Arena Runway */}
      <div className="relative w-full h-[450px] sm:h-[500px] rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 border-2 border-border/80 overflow-hidden shadow-2xl select-none">
        {/* Background Dojo / Bamboo Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Danger Line at bottom */}
        <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-rose-500/40 border-b border-dashed border-rose-500/60">
          <span className="absolute right-4 -top-3 text-[10px] font-black uppercase text-rose-500 tracking-widest">
            Vạch Nguy Hiểm
          </span>
        </div>

        {/* Falling Target Orbs */}
        {targets.map((target) => (
          <div
            key={target.id}
            onClick={(e) => handleSlashTarget(target, e)}
            style={{
              position: 'absolute',
              left: `${target.xPercent}%`,
              top: `${target.yPercent}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`cursor-pointer transition-transform duration-75 active:scale-90 ${
              target.isSlashed ? 'pointer-events-none' : ''
            }`}
          >
            {target.isSlashed ? (
              // Slashed Split Animation
              <div className="relative w-16 h-16 flex items-center justify-center">
                <motion.div
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                  animate={{ x: -25, y: 30, opacity: 0, rotate: -35 }}
                  transition={{ duration: 0.4 }}
                  className="absolute text-2xl font-black text-rose-400"
                >
                  {target.word.word.slice(0, 1)}
                </motion.div>
                <motion.div
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                  animate={{ x: 25, y: 30, opacity: 0, rotate: 35 }}
                  transition={{ duration: 0.4 }}
                  className="absolute text-2xl font-black text-rose-400"
                >
                  {target.word.word.slice(1) || target.word.word}
                </motion.div>
              </div>
            ) : (
              // Normal Target Orb
              <div className="group relative flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-rose-500/50 group-hover:border-rose-400 group-hover:scale-105 transition-all shadow-lg shadow-rose-500/20 flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-xl sm:text-2xl font-black text-white group-hover:text-rose-300">
                    {target.word.word}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-400/80 truncate max-w-full">
                    {target.word.reading}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Katana Slash Light Trail Effect */}
        {slashEffect && (
          <motion.div
            initial={{ opacity: 1, scaleX: 0 }}
            animate={{ opacity: 0, scaleX: 1.5 }}
            transition={{ duration: 0.25 }}
            className="fixed pointer-events-none z-50 h-1 bg-white shadow-[0_0_15px_#fff,0_0_30px_#f43f5e] -rotate-45 origin-center"
            style={{
              left: slashEffect.x - 75,
              top: slashEffect.y,
              width: '150px',
            }}
          />
        )}
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-card border-2 border-rose-500/60 shadow-2xl p-6 sm:p-8 text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30">
                <Swords className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-foreground">
                  Trận Đấu Kết Thúc! ⚔️
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Kiếm thuật của bạn đã chém trúng <strong>{slashesCount} từ vựng N3</strong>
                </p>
              </div>

              {/* Stats Breakdown */}
              <div className="grid grid-cols-3 gap-2 bg-muted/50 p-4 rounded-2xl border border-border/40">
                <div>
                  <div className="text-[11px] text-muted-foreground font-bold">Tổng Điểm</div>
                  <div className="text-lg font-black text-amber-500">{score}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground font-bold">Max Combo</div>
                  <div className="text-lg font-black text-rose-500">x{maxCombo}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground font-bold">Số Từ Chém</div>
                  <div className="text-lg font-black text-indigo-500">{slashesCount}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onBack}
                  className="flex-1 py-3 rounded-2xl bg-muted text-foreground font-bold text-sm hover:bg-muted/80 transition-colors"
                >
                  Arcade Hub
                </button>
                <button
                  onClick={startNewGame}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-sm shadow-lg shadow-rose-500/30 hover:opacity-90 transition-opacity"
                >
                  Thách Đấu Lại ⚔️
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
