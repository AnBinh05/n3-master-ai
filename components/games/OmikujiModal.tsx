'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, X, Volume2, Award, Coins, Zap, RefreshCw } from 'lucide-react';
import { 
  getGamificationProfile, 
  saveGamificationProfile, 
  OmikujiResult,
  addExpAndCoins,
  unlockAchievement
} from '@/lib/gamification';
import { playOmikujiBell, playVictory, playClick } from '@/lib/game-audio';
import { ALL_880_WORDS } from '@/prisma/data/mimikara_n3_880';

interface OmikujiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORTUNES = [
  {
    grade: 'DAI_KICHI' as const,
    japaneseName: '大吉',
    vietnameseTitle: 'ĐẠI CÁT - VẬN MAY ĐỈNH CAO 🌟',
    color: 'from-amber-500 via-rose-500 to-yellow-400',
    borderColor: 'border-amber-400',
    message: 'Trí tuệ hanh thông, học đâu nhớ đó! Mọi mục tiêu N3 hôm nay đều sẽ đạt kết quả rực rỡ.',
    studyAdvice: 'Hôm nay là ngày vàng để ôn tập các Unit khó và thử thách bản thân với Boss Battle!',
    rewardCoins: 150,
    rewardExp: 100,
  },
  {
    grade: 'CHU_KICHI' as const,
    japaneseName: '中吉',
    vietnameseTitle: 'TRUNG CÁT - TẤN TỚI THÀNH CÔNG ✨',
    color: 'from-purple-500 via-indigo-500 to-pink-500',
    borderColor: 'border-purple-400',
    message: 'Kiên trì từng bước, hạt giống bạn gieo trồng hôm nay sẽ nở hoa rực rỡ trong kỳ thi JLPT.',
    studyAdvice: 'Dành 15 phút ôn 30 thẻ SRS và hoàn thành 1 màn Ghép Thẻ Thần Tốc nhé.',
    rewardCoins: 100,
    rewardExp: 70,
  },
  {
    grade: 'SHO_KICHI' as const,
    japaneseName: '小吉',
    vietnameseTitle: 'TIỂU CÁT - BÌNH AN TIẾN BỘ 🌸',
    color: 'from-emerald-500 via-teal-500 to-cyan-500',
    borderColor: 'border-emerald-400',
    message: 'Mỗi ngày tích lũy một ít từ vựng, kiến thức N3 sẽ vững như bàn thạch.',
    studyAdvice: 'Học chắc từng mẫu ngữ pháp và phát âm shadowing câu ví dụ thật to.',
    rewardCoins: 70,
    rewardExp: 50,
  },
  {
    grade: 'KICHI' as const,
    japaneseName: '吉',
    vietnameseTitle: 'CÁT - VẠN SỰ HANH THÔNG 🍀',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-400',
    message: 'Tâm tĩnh như nước, tập trung cao độ sẽ mang lại đột phá bất ngờ.',
    studyAdvice: 'Thư giãn một chút với game Kanji Samurai Slasher để rèn luyện phản xạ từ vựng.',
    rewardCoins: 50,
    rewardExp: 40,
  },
];

export function OmikujiModal({ isOpen, onClose }: OmikujiModalProps) {
  const [shaking, setShaking] = useState(false);
  const [result, setResult] = useState<OmikujiResult | null>(null);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      const profile = getGamificationProfile();
      if (profile.omikujiHistory && profile.omikujiHistory[todayStr]) {
        setResult(profile.omikujiHistory[todayStr]);
        setHasDrawnToday(true);
      } else {
        setResult(null);
        setHasDrawnToday(false);
      }
    }
  }, [isOpen, todayStr]);

  if (!isOpen) return null;

  const handleDraw = () => {
    playClick();
    setShaking(true);

    setTimeout(() => {
      // Pick random fortune
      const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      
      // Pick random lucky word from 880 Mimikara words
      const randomWord = ALL_880_WORDS[Math.floor(Math.random() * ALL_880_WORDS.length)];

      const newResult: OmikujiResult = {
        date: todayStr,
        grade: fortune.grade,
        japaneseName: fortune.japaneseName,
        vietnameseTitle: fortune.vietnameseTitle,
        message: fortune.message,
        studyAdvice: fortune.studyAdvice,
        luckyWord: {
          word: randomWord.word,
          reading: randomWord.reading,
          meaning: randomWord.meaning,
          hanViet: randomWord.hanViet,
          example: randomWord.example,
        },
        rewardCoins: fortune.rewardCoins,
        rewardExp: fortune.rewardExp,
      };

      // Save to gamification profile
      const profile = getGamificationProfile();
      profile.omikujiHistory = {
        ...(profile.omikujiHistory || {}),
        [todayStr]: newResult,
      };
      saveGamificationProfile(profile);

      // Add rewards
      addExpAndCoins(fortune.rewardExp, fortune.rewardCoins);

      if (fortune.grade === 'DAI_KICHI') {
        unlockAchievement('omikuji_fortune');
      }

      setShaking(false);
      setResult(newResult);
      setHasDrawnToday(true);

      playOmikujiBell();
      setTimeout(() => {
        playVictory();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
        });
      }, 500);
    }, 1800);
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

  const handleResetForTesting = () => {
    const profile = getGamificationProfile();
    const newHistory = { ...profile.omikujiHistory };
    delete newHistory[todayStr];
    profile.omikujiHistory = newHistory;
    saveGamificationProfile(profile);
    setResult(null);
    setHasDrawnToday(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border/60 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Đền Thờ Tri Thức N3 Master
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            🥠 Rút Quẻ Omikuji Hằng Ngày
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Rung lắc ống quẻ để nhận lời chúc may mắn, phần thưởng Vàng & Từ vựng N3 của ngày!
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="draw"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-6 space-y-6"
            >
              {/* Animated Bamboo Shaker Cylinder */}
              <motion.div
                animate={
                  shaking
                    ? {
                        rotate: [-15, 15, -20, 20, -10, 10, 0],
                        y: [-10, 5, -12, 6, -5, 0],
                        transition: { duration: 1.8, ease: 'easeInOut' },
                      }
                    : { y: [0, -6, 0], transition: { repeat: Infinity, duration: 2.5 } }
                }
                className="relative w-32 h-44 rounded-3xl bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-4 border-amber-500/60 shadow-2xl flex flex-col items-center justify-between p-3 cursor-pointer select-none group"
                onClick={!shaking ? handleDraw : undefined}
              >
                {/* Bamboo texture rings */}
                <div className="w-full h-1 bg-amber-400/40 rounded-full" />
                <div className="text-center space-y-1">
                  <span className="text-2xl font-black text-amber-200 tracking-widest block font-serif">
                    御神籤
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                    OMIKUJI
                  </span>
                </div>
                <div className="w-full h-1.5 bg-amber-950 rounded-full" />

                {/* Stick peeking out */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-8 bg-amber-200 rounded-t-sm shadow-md border-t-2 border-rose-500" />
              </motion.div>

              <div className="text-center space-y-2">
                <button
                  onClick={handleDraw}
                  disabled={shaking}
                  className={`px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-extrabold text-base shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all ${
                    shaking ? 'opacity-80 cursor-wait' : ''
                  }`}
                >
                  {shaking ? '🎋 Đang Rung Lắc Ống Quẻ...' : '✨ Lắc Ống Rút Quẻ Hôm Nay'}
                </button>
                <p className="text-xs text-muted-foreground">Mỗi ngày nhận 1 lần rút miễn phí</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Fortune Result Card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-card to-muted/50 p-6 border-2 border-amber-500/40 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-4">
                  <div>
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                      Quẻ Ngày {result.date}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-foreground mt-0.5">
                      {result.vietnameseTitle}
                    </h3>
                  </div>
                  <div className="text-3xl font-black text-rose-500 bg-rose-500/10 px-4 py-1.5 rounded-2xl border border-rose-500/20 font-serif">
                    {result.japaneseName}
                  </div>
                </div>

                <div className="py-3 space-y-2 text-sm">
                  <p className="text-foreground font-medium italic">"{result.message}"</p>
                  <p className="text-xs text-muted-foreground">💡 <strong>Lời khuyên học tập:</strong> {result.studyAdvice}</p>
                </div>

                {/* Lucky Word of the Day Box */}
                <div className="mt-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Từ Vựng May Mắn Của Ngày
                    </span>
                    <button
                      onClick={() => handleSpeak(result.luckyWord.word)}
                      className="p-1.5 rounded-xl bg-rose-500/20 text-rose-600 hover:bg-rose-500/30 transition-colors"
                      title="Phát âm tiếng Nhật"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-black text-foreground">{result.luckyWord.word}</span>
                    <span className="text-sm font-semibold text-rose-500">[{result.luckyWord.reading}]</span>
                    {result.luckyWord.hanViet && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold">
                        {result.luckyWord.hanViet}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-foreground">
                    👉 {result.luckyWord.meaning}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    "{result.luckyWord.example}"
                  </p>
                </div>

                {/* Rewards Banner */}
                <div className="mt-4 flex items-center justify-center gap-6 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-amber-500 font-black text-sm">
                    <Coins className="w-4 h-4 fill-amber-500" />
                    <span>+{result.rewardCoins} Vàng</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-500 font-black text-sm">
                    <Zap className="w-4 h-4 fill-indigo-500" />
                    <span>+{result.rewardExp} EXP</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleResetForTesting}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  title="Thử rút lại quẻ khác (Chế độ phát triển)"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Rút Lại Thử Nghiệm
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Đã Nhận Thưởng & Đóng
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
