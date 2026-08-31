'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Trophy, 
  Volume2, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { addExpAndCoins } from '@/lib/gamification';
import { playClick, playCorrect, playWrong, playVictory, playLevelUp } from '@/lib/game-audio';

interface SentenceScrambleGameProps {
  onBack: () => void;
}

interface ScrambleSentence {
  id: number;
  tokens: string[]; // Correct ordered tokens
  vietnamese: string;
  grammarPoint: string;
  fullJapanese: string;
}

const N3_SENTENCES: ScrambleSentence[] = [
  {
    id: 1,
    tokens: ['毎朝、', '30分', 'ジョギング', 'することに', 'している。'],
    vietnamese: 'Mỗi buổi sáng, tôi đều duy trì thói quen chạy bộ 30 phút.',
    grammarPoint: '〜ことにしている (Thói quen do bản thân tự quy định)',
    fullJapanese: '毎朝、30分ジョギングすることにしている。',
  },
  {
    id: 2,
    tokens: ['遠慮しないで、', 'どうぞ', 'たくさん', '食べて', 'ください。'],
    vietnamese: 'Đừng ngại ngùng gì cả, xin mời bạn hãy ăn thật nhiều vào.',
    grammarPoint: '遠慮しないで (Xin đừng e ngại/khách khí)',
    fullJapanese: '遠慮しないで、どうぞたくさん食べてください。',
  },
  {
    id: 3,
    tokens: ['雨が', '降っている', 'にもかかわらず、', '試合は', '行われた。'],
    vietnamese: 'Mặc cho trời đang mưa, trận đấu vẫn được tiến hành.',
    grammarPoint: '〜にもかかわらず (Mặc dù / Bất chấp)',
    fullJapanese: '雨が降っているにもかかわらず、試合は行われた。',
  },
  {
    id: 4,
    tokens: ['健康の', 'ために、', '野菜を', '食べるように', 'しています。'],
    vietnamese: 'Vì sức khỏe, tôi đang cố gắng tập ăn nhiều rau củ.',
    grammarPoint: '〜ようにしている (Cố gắng tạo thói quen tốt)',
    fullJapanese: '健康のために、野菜を食べるようにしています。',
  },
  {
    id: 5,
    tokens: ['約束を', '破る', 'わけには', 'いかない。'],
    vietnamese: 'Tôi không thể nào nuốt lời hứa được (về mặt đạo đức).',
    grammarPoint: '〜わけにはいかない (Không thể làm vì lý do đạo lý/xã hội)',
    fullJapanese: '約束を破るわけにはいかない。',
  },
  {
    id: 6,
    tokens: ['この仕事は', '明日までに', '終わらせる', 'つもりです。'],
    vietnamese: 'Tôi dự định sẽ hoàn thành công việc này trước ngày mai.',
    grammarPoint: '〜つもりだ (Dự định của bản thân)',
    fullJapanese: 'この仕事は明日までに終わらせるつもりです。',
  },
  {
    id: 7,
    tokens: ['台風の', '影響によって、', '電車が', '遅延しています。'],
    vietnamese: 'Do ảnh hưởng của bão lớn, các chuyến tàu điện đang bị trễ.',
    grammarPoint: '〜によって (Do / Bởi vì nguyên nhân)',
    fullJapanese: '台風の影響によって、電車が遅延しています。',
  },
];

export function SentenceScrambleGame({ onBack }: SentenceScrambleGameProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  const currentSentence = N3_SENTENCES[currentIndex];

  useEffect(() => {
    loadSentence(currentIndex);
  }, [currentIndex]);

  const loadSentence = (idx: number) => {
    const target = N3_SENTENCES[idx];
    if (!target) {
      setGameCompleted(true);
      return;
    }
    // Shuffle tokens
    const shuffled = [...target.tokens].sort(() => Math.random() - 0.5);
    setAvailableTokens(shuffled);
    setSelectedTokens([]);
    setIsAnswered(false);
    setIsCorrect(null);
  };

  const handlePickToken = (token: string, tokenIdx: number) => {
    if (isAnswered) return;
    playClick();
    const newAvail = [...availableTokens];
    newAvail.splice(tokenIdx, 1);
    setAvailableTokens(newAvail);
    setSelectedTokens([...selectedTokens, token]);
  };

  const handleRemoveToken = (token: string, tokenIdx: number) => {
    if (isAnswered) return;
    playClick();
    const newSel = [...selectedTokens];
    newSel.splice(tokenIdx, 1);
    setSelectedTokens(newSel);
    setAvailableTokens([...availableTokens, token]);
  };

  const handleCheckAnswer = () => {
    if (selectedTokens.length !== currentSentence.tokens.length) return;

    const userSentence = selectedTokens.join('');
    const correctSentence = currentSentence.tokens.join('');
    const correct = userSentence === correctSentence;

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      playCorrect();
      setScore((s) => s + 100);
      handleSpeak(currentSentence.fullJapanese);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < N3_SENTENCES.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setGameCompleted(true);
      playVictory();
      const totalExp = score + 50;
      const totalCoins = Math.round(score / 2);
      const { leveledUp } = addExpAndCoins(totalExp, totalCoins);
      if (leveledUp) setTimeout(() => playLevelUp(), 1000);
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

        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-muted-foreground">
            Câu: <strong className="text-foreground">{currentIndex + 1}/{N3_SENTENCES.length}</strong>
          </div>
          <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
            <Trophy className="w-4 h-4" />
            <span>{score} Điểm</span>
          </div>
        </div>

        <button
          onClick={() => loadSentence(currentIndex)}
          className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Xếp lại câu này"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {!gameCompleted ? (
        <div className="space-y-6">
          {/* Target Meaning Box */}
          <div className="p-6 rounded-3xl bg-card border border-border/60 shadow-lg space-y-3 text-center">
            <div className="text-xs font-black uppercase text-rose-500 tracking-wider">
              Nhiệm Vụ: Ghép Các Mảnh Từ Thành Câu Đúng
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              "{currentSentence.vietnamese}"
            </h2>
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              💡 {currentSentence.grammarPoint}
            </div>
          </div>

          {/* Construction Drop Zone */}
          <div className="p-6 rounded-3xl bg-muted/40 border-2 border-dashed border-border/80 min-h-[100px] flex flex-wrap items-center justify-center gap-2.5">
            {selectedTokens.length === 0 ? (
              <span className="text-xs font-semibold text-muted-foreground/60 select-none">
                Bấm vào các mảnh từ bên dưới để xếp vào đây theo thứ tự...
              </span>
            ) : (
              selectedTokens.map((token, idx) => (
                <motion.button
                  key={`${token}_${idx}`}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={() => handleRemoveToken(token, idx)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-base shadow-md shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {token}
                </motion.button>
              ))
            )}
          </div>

          {/* Available Word Pieces Pool */}
          <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm space-y-3">
            <div className="text-xs font-bold text-muted-foreground text-center">
              Kho mảnh ghép từ:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {availableTokens.map((token, idx) => (
                <motion.button
                  key={`${token}_avail_${idx}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePickToken(token, idx)}
                  className="px-4 py-2.5 rounded-2xl bg-card border-2 border-border hover:border-rose-500 text-foreground font-bold text-base shadow-sm transition-all"
                >
                  {token}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Verification & Result Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              onClick={() => handleSpeak(currentSentence.fullJapanese)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <Volume2 className="w-4 h-4 text-rose-500" /> Nghe Âm Thanh Câu Gợi Ý
            </button>

            {!isAnswered ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedTokens.length !== currentSentence.tokens.length}
                className={`px-8 py-3 rounded-2xl font-black text-sm shadow-lg transition-all ${
                  selectedTokens.length === currentSentence.tokens.length
                    ? 'bg-rose-500 text-white shadow-rose-500/30 hover:opacity-90 active:scale-95'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Kiểm Tra Đáp Án ⚡
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-500/30 hover:opacity-90 active:scale-95 transition-all"
              >
                Câu Kế Tiếp <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Explanation Box */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-3xl border-2 ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-sm mb-1">
                  {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : '❌'}
                  {isCorrect ? 'Tuyệt Vời! Đáp án hoàn toàn chính xác!' : 'Chưa Đúng Rồi! Hãy xem đáp án chuẩn:'}
                </div>
                <p className="text-base font-black mt-1">
                  👉 {currentSentence.fullJapanese}
                </p>
                <p className="text-xs mt-1 opacity-90">
                  Ý nghĩa: {currentSentence.vietnamese}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Game Completed Summary */
        <div className="p-8 rounded-3xl bg-card border border-border/60 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30">
            <Trophy className="w-9 h-9" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground">
              Hoàn Thành Toàn Bộ Câu N3! 🎌
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Bạn đã xếp đúng tất cả cấu trúc ngữ pháp và nhận được {score} điểm!
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-8 py-3 rounded-2xl bg-rose-500 text-white font-black text-sm shadow-lg shadow-rose-500/30 hover:opacity-90 transition-opacity"
          >
            Quay Lại Arcade Hub
          </button>
        </div>
      )}
    </div>
  );
}
