'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Timer, 
  Trophy, 
  Zap, 
  Coins, 
  ArrowLeft, 
  Volume2, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { ALL_880_WORDS } from '@/prisma/data/mimikara_n3_880';
import { addExpAndCoins, unlockAchievement } from '@/lib/gamification';
import { 
  playClick, 
  playCorrect, 
  playWrong, 
  playCombo, 
  playVictory,
  playLevelUp 
} from '@/lib/game-audio';

interface SpeedMatchGameProps {
  onBack: () => void;
}

interface MatchCard {
  id: string;
  pairId: number;
  type: 'KANJI' | 'MEANING';
  content: string;
  subContent?: string;
  fullWord: any;
  isFlipped: boolean;
  isMatched: boolean;
}

export function SpeedMatchGame({ onBack }: SpeedMatchGameProps) {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MatchCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [totalPairs, setTotalPairs] = useState<number>(6);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY'); // 6, 8, 10 pairs
  const [unitFilter, setUnitFilter] = useState<number>(0); // 0 = all

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startNewGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty, unitFilter]);

  useEffect(() => {
    if (gameStarted && !gameWon) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameWon]);

  const startNewGame = () => {
    const pairCount = difficulty === 'EASY' ? 6 : difficulty === 'MEDIUM' ? 8 : 10;
    setTotalPairs(pairCount);
    setMatchedPairs(0);
    setSelectedCards([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeElapsed(0);
    setGameWon(false);

    // Pick random words
    let pool = ALL_880_WORDS;
    if (unitFilter > 0) {
      // Approximate units: unit 1 (0-70), unit 2 (70-120), etc.
      const start = (unitFilter - 1) * 70;
      const end = start + 70;
      pool = ALL_880_WORDS.slice(start, end);
      if (pool.length < pairCount) pool = ALL_880_WORDS;
    }

    const shuffledWords = [...pool].sort(() => Math.random() - 0.5).slice(0, pairCount);

    // Generate matching cards
    const deck: MatchCard[] = [];
    shuffledWords.forEach((wordItem, idx) => {
      // Card 1: Kanji
      deck.push({
        id: `kanji-${idx}`,
        pairId: idx,
        type: 'KANJI',
        content: wordItem.word,
        subContent: wordItem.hanViet || wordItem.reading,
        fullWord: wordItem,
        isFlipped: false,
        isMatched: false,
      });

      // Card 2: Meaning & Reading
      deck.push({
        id: `meaning-${idx}`,
        pairId: idx,
        type: 'MEANING',
        content: wordItem.meaning,
        subContent: wordItem.reading,
        fullWord: wordItem,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle the final board
    setCards(deck.sort(() => Math.random() - 0.5));
    setGameStarted(true);
  };

  const handleCardClick = (card: MatchCard) => {
    if (card.isMatched || card.isFlipped || selectedCards.length >= 2 || gameWon) return;

    playClick();

    // Flip card
    const updatedCards = cards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;

      // Check if matched
      if (first.pairId === second.pairId && first.type !== second.type) {
        // MATCHED!
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);

        playCombo(newCombo);
        playCorrect();

        const addedScore = 100 * newCombo;
        setScore((s) => s + addedScore);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.pairId === first.pairId ? { ...c, isMatched: true } : c))
          );
          setSelectedCards([]);
          const newMatched = matchedPairs + 1;
          setMatchedPairs(newMatched);

          if (newMatched === totalPairs) {
            handleVictory();
          }
        }, 350);
      } else {
        // WRONG MATCH
        playWrong();
        setCombo(0);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const handleVictory = () => {
    setGameWon(true);
    setGameStarted(false);
    playVictory();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const baseExp = difficulty === 'EASY' ? 60 : difficulty === 'MEDIUM' ? 90 : 120;
    const baseCoins = difficulty === 'EASY' ? 40 : difficulty === 'MEDIUM' ? 60 : 80;
    const timeBonus = Math.max(10, 60 - timeElapsed);

    const totalExp = baseExp + timeBonus;
    const totalCoins = baseCoins + Math.round(score / 50);

    const { leveledUp } = addExpAndCoins(totalExp, totalCoins);
    if (leveledUp) {
      setTimeout(() => playLevelUp(), 1000);
    }

    if (timeElapsed <= 45) {
      unlockAchievement('match_master');
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

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border/50 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát Arcade Hub
        </button>

        {/* Stats Row */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-rose-500 font-bold text-sm">
            <Timer className="w-4 h-4 animate-spin-slow" />
            <span>{formatTime(timeElapsed)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
            <Trophy className="w-4 h-4" />
            <span>{score} Điểm</span>
          </div>

          {combo > 1 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.2, 1] }}
              className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md"
            >
              🔥 Combo x{combo}
            </motion.div>
          )}

          <div className="text-xs font-bold text-muted-foreground">
            Cặp: <strong className="text-foreground">{matchedPairs}/{totalPairs}</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Difficulty Dropdown */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-muted text-xs font-bold border border-border/40 text-foreground cursor-pointer focus:outline-none"
          >
            <option value="EASY">6 Cặp (Dễ)</option>
            <option value="MEDIUM">8 Cặp (Vừa)</option>
            <option value="HARD">10 Cặp (Thách Thức)</option>
          </select>

          <button
            onClick={startNewGame}
            className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Chơi lại ván mới"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game Board Grid */}
      <div className={`grid gap-3 sm:gap-4 ${
        difficulty === 'EASY' 
          ? 'grid-cols-3 sm:grid-cols-4' 
          : difficulty === 'MEDIUM' 
            ? 'grid-cols-4' 
            : 'grid-cols-4 sm:grid-cols-5'
      }`}>
        {cards.map((card) => {
          const isFlippedOrMatched = card.isFlipped || card.isMatched;

          return (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(card)}
              whileHover={!isFlippedOrMatched ? { scale: 1.03 } : {}}
              whileTap={!isFlippedOrMatched ? { scale: 0.96 } : {}}
              className={`relative h-28 sm:h-36 rounded-2xl sm:rounded-3xl p-3 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-300 ${
                card.isMatched
                  ? 'bg-emerald-500/10 border-2 border-emerald-500/50 opacity-60 scale-95 pointer-events-none'
                  : isFlippedOrMatched
                    ? card.type === 'KANJI'
                      ? 'bg-gradient-to-br from-rose-500/20 via-pink-500/10 to-card border-2 border-rose-500 shadow-lg shadow-rose-500/20'
                      : 'bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-card border-2 border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : 'bg-card border-2 border-border/70 hover:border-rose-400/50 shadow-md'
              }`}
            >
              {isFlippedOrMatched ? (
                <div className="space-y-1 animate-in fade-in zoom-in duration-200">
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    {card.type === 'KANJI' ? '🌸 Hán Tự' : '📖 Ý Nghĩa'}
                  </div>
                  
                  <div className={`font-black tracking-tight ${
                    card.type === 'KANJI' ? 'text-xl sm:text-2xl text-foreground' : 'text-xs sm:text-sm text-foreground line-clamp-2'
                  }`}>
                    {card.content}
                  </div>

                  {card.subContent && (
                    <div className="text-[11px] font-semibold text-rose-500 dark:text-rose-400">
                      {card.subContent}
                    </div>
                  )}

                  {card.isMatched && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mt-1" />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1 text-muted-foreground/60">
                  <div className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center font-black text-xs text-rose-500">
                    N3
                  </div>
                  <span className="text-[10px] font-bold">Lật Thẻ</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Victory Modal */}
      <AnimatePresence>
        {gameWon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-card border-2 border-amber-500/50 shadow-2xl p-6 sm:p-8 text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30">
                <Trophy className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-foreground">
                  Chiến Thắng Xuất Sắc! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Bạn đã ghép chính xác toàn bộ {totalPairs} cặp từ N3 trong <strong>{formatTime(timeElapsed)}</strong>
                </p>
              </div>

              {/* Reward stats */}
              <div className="grid grid-cols-3 gap-2 bg-muted/50 p-4 rounded-2xl border border-border/40">
                <div>
                  <div className="text-[11px] text-muted-foreground font-bold">Điểm Số</div>
                  <div className="text-lg font-black text-amber-500">{score}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground font-bold">Max Combo</div>
                  <div className="text-lg font-black text-rose-500">x{maxCombo || 1}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground font-bold">Thời Gian</div>
                  <div className="text-lg font-black text-indigo-500">{formatTime(timeElapsed)}</div>
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
                  Chơi Tiếp Ván Mới ⚡
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
