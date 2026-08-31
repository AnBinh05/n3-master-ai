'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Swords, 
  Trophy, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Bot, 
  CheckCircle2, 
  XCircle,
  Timer
} from 'lucide-react';
import { ALL_880_WORDS, MimikaraWord } from '@/prisma/data/mimikara_n3_880';
import { addExpAndCoins } from '@/lib/gamification';
import { playClick, playSlash, playWrong, playVictory, playLevelUp } from '@/lib/game-audio';

interface PvpArenaGameProps {
  onBack: () => void;
}

interface Opponent {
  id: string;
  name: string;
  avatar: string;
  title: string;
  accuracyRate: number; // 0.7 - 0.95
  reactionSpeedMs: number; // 2500 - 4500 ms
}

const OPPONENTS: Opponent[] = [
  {
    id: 'akira',
    name: 'Akira Bot 🤖',
    avatar: '🤖',
    title: 'Học Viên Tập Sự',
    accuracyRate: 0.75,
    reactionSpeedMs: 3800,
  },
  {
    id: 'yuki',
    name: 'Yuki Sensei 🌸',
    avatar: '👩‍🏫',
    title: 'Giáo Viên N3',
    accuracyRate: 0.88,
    reactionSpeedMs: 2800,
  },
  {
    id: 'ryu',
    name: 'Master Ryu ⚡',
    avatar: '🥷',
    title: 'Kiếm Thánh JLPT',
    accuracyRate: 0.96,
    reactionSpeedMs: 2000,
  },
];

export function PvpArenaGame({ onBack }: PvpArenaGameProps) {
  const [selectedOpponent, setSelectedOpponent] = useState<Opponent>(OPPONENTS[0]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState<boolean[]>([]);
  const [opponentAnswers, setOpponentAnswers] = useState<boolean[]>([]);

  // Current Question
  const [currentWord, setCurrentWord] = useState<MimikaraWord | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [correctOption, setCorrectOption] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [matchOver, setMatchOver] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(8);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const TOTAL_QUESTIONS = 5;

  useEffect(() => {
    startMatch(selectedOpponent);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedOpponent]);

  const startMatch = (opp: Opponent) => {
    setQuestionIndex(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setPlayerAnswers([]);
    setOpponentAnswers([]);
    setMatchOver(false);
    loadQuestion();
  };

  const loadQuestion = () => {
    setIsAnswered(false);
    setQuestionTimer(8);

    const pool = [...ALL_880_WORDS].sort(() => Math.random() - 0.5);
    const target = pool[0];
    const distractors = pool.slice(1, 4).map((w) => w.meaning);

    setCurrentWord(target);
    setCorrectOption(target.meaning);

    const allOptions = [target.meaning, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(allOptions);

    // Question countdown
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeOut = () => {
    if (isAnswered) return;
    handleSelectAnswer('');
  };

  const handleSelectAnswer = (selected: string) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswered(true);

    const playerCorrect = selected === correctOption;
    const speedBonus = questionTimer > 5 ? 1.5 : 1;
    const playerPoints = playerCorrect ? Math.round(100 * speedBonus) : 0;

    if (playerCorrect) {
      playSlash();
    } else {
      playWrong();
    }

    setPlayerScore((s) => s + playerPoints);
    setPlayerAnswers((prev) => [...prev, playerCorrect]);

    // Simulate Opponent AI Answer
    const oppCorrect = Math.random() < selectedOpponent.accuracyRate;
    const oppPoints = oppCorrect ? Math.round(100 * (Math.random() > 0.4 ? 1.5 : 1)) : 0;
    setOpponentScore((s) => s + oppPoints);
    setOpponentAnswers((prev) => [...prev, oppCorrect]);

    // Proceed to next question or conclude match
    setTimeout(() => {
      if (questionIndex + 1 < TOTAL_QUESTIONS) {
        setQuestionIndex((idx) => idx + 1);
        loadQuestion();
      } else {
        handleEndMatch(playerScore + playerPoints, opponentScore + oppPoints);
      }
    }, 1500);
  };

  const handleEndMatch = (finalPlayer: number, finalOpp: number) => {
    setMatchOver(true);
    if (finalPlayer >= finalOpp) {
      playVictory();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      const { leveledUp } = addExpAndCoins(150, 100);
      if (leveledUp) setTimeout(() => playLevelUp(), 1000);
    } else {
      playWrong();
      addExpAndCoins(50, 30);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border/50 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Arcade Hub
        </button>

        {/* Opponent Selector */}
        <div className="flex items-center gap-2">
          {OPPONENTS.map((opp) => (
            <button
              key={opp.id}
              onClick={() => setSelectedOpponent(opp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedOpponent.id === opp.id
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {opp.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => startMatch(selectedOpponent)}
          className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Đấu lại trận này"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Duel Arena Split Stage */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/60 shadow-xl space-y-6">
        {/* Top Split Progress HUD */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border/50">
          {/* Player Score Bar */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-rose-600 dark:text-rose-400">
                🥋 Bạn (Dũng Sĩ N3)
              </span>
              <span className="text-lg font-black text-rose-500">{playerScore} Điểm</span>
            </div>
            {/* Rounds Indicators */}
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    playerAnswers[i] === true
                      ? 'bg-emerald-500'
                      : playerAnswers[i] === false
                        ? 'bg-rose-500'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Opponent Score Bar */}
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-purple-600 dark:text-purple-400">
                {selectedOpponent.name}
              </span>
              <span className="text-lg font-black text-purple-500">{opponentScore} Điểm</span>
            </div>
            {/* Rounds Indicators */}
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    opponentAnswers[i] === true
                      ? 'bg-emerald-500'
                      : opponentAnswers[i] === false
                        ? 'bg-rose-500'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {!matchOver && currentWord ? (
          <div className="space-y-5">
            {/* Question Countdown Timer */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                Hiệp đấu: <strong>{questionIndex + 1}/{TOTAL_QUESTIONS}</strong>
              </span>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-black">
                <Timer className="w-4 h-4" /> {questionTimer}s
              </div>
            </div>

            {/* Target Word Display */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-card via-muted/30 to-card border-2 border-border/80 text-center space-y-2">
              <div className="text-xs font-bold text-rose-500">
                [{currentWord.reading}]
              </div>
              <div className="text-3xl sm:text-4xl font-black text-foreground">
                {currentWord.word}
              </div>
              {currentWord.hanViet && (
                <div className="text-xs text-amber-500 font-bold">
                  Hán Việt: {currentWord.hanViet}
                </div>
              )}
            </div>

            {/* Multiple Choice Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectAnswer(opt)}
                  className={`p-4 rounded-2xl text-left font-bold text-xs sm:text-sm border transition-all ${
                    isAnswered && opt === correctOption
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-md'
                      : 'bg-card border-border/70 hover:border-rose-500 hover:bg-muted/60'
                  }`}
                >
                  <span className="inline-block w-5 h-5 rounded-full bg-muted text-center leading-5 text-[10px] mr-2 font-black">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Match Concluded Podium */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center mx-auto shadow-xl">
              <Trophy className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-foreground">
              {playerScore >= opponentScore ? '🎉 CHIẾN THẮNG TRẬN ĐẤU!' : '⚔️ THẤT BẠI SÁT NÚT!'}
            </h3>

            <p className="text-sm text-muted-foreground">
              Tỷ số chung cuộc: <strong>{playerScore}</strong> (Bạn) vs <strong>{opponentScore}</strong> ({selectedOpponent.name})
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl bg-muted text-foreground font-bold text-xs hover:bg-muted/80 transition-colors"
              >
                Arcade Hub
              </button>
              <button
                onClick={() => startMatch(selectedOpponent)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-500/30 hover:opacity-90 transition-opacity"
              >
                Tái Đấu Ngay ⚡
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
