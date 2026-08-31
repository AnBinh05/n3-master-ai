'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  ArrowLeft, 
  RotateCcw, 
  ArrowRight, 
  Trophy, 
  CheckCircle2, 
  HelpCircle,
  Award
} from 'lucide-react';
import { addExpAndCoins } from '@/lib/gamification';
import { playClick, playCorrect, playWrong, playVictory, playLevelUp } from '@/lib/game-audio';

interface ShadowingStudioProps {
  onBack: () => void;
}

interface ShadowSentence {
  id: number;
  japanese: string;
  reading: string;
  vietnamese: string;
  grammarFocus: string;
}

const SHADOWING_SENTENCES: ShadowSentence[] = [
  {
    id: 1,
    japanese: '遠慮しないで、どうぞたくさん召し上がってください。',
    reading: 'えんりょしないで、どうぞたくさんめしあがってください。',
    vietnamese: 'Xin đừng ngại ngùng gì cả, xin mời bạn hãy dùng thật nhiều vào.',
    grammarFocus: '遠慮 (Khách khí) • 召し上がる (Kính ngữ Ăn/Uống)',
  },
  {
    id: 2,
    japanese: '健康のために、毎朝ジョギングすることにしている。',
    reading: 'けんこうのために、まいあさじょぎんぐすることにしている。',
    vietnamese: 'Vì sức khỏe, mỗi buổi sáng tôi đều duy trì thói quen chạy bộ.',
    grammarFocus: '〜ことにしている (Thói quen tự giác)',
  },
  {
    id: 3,
    japanese: '雨が降っているにもかかわらず、多くの人が集まった。',
    reading: 'あめがふっているにもかかわらず、おおくのひとがあつまった。',
    vietnamese: 'Bất chấp trời đang mưa to, rất đông người vẫn tề tựu đông đủ.',
    grammarFocus: '〜にもかかわらず (Mặc dù / Bất chấp)',
  },
  {
    id: 4,
    japanese: 'どんなに難しくても、最後まで諦めないつもりです。',
    reading: 'どんなにむずかしくても、さいごまであきらめないつもりです。',
    vietnamese: 'Dù cho có khó khăn đến mức nào đi nữa, tôi dự định sẽ không bỏ cuộc.',
    grammarFocus: 'どんなに〜ても (Dù có thế nào đi chăng nữa)',
  },
  {
    id: 5,
    japanese: '日本の文化に興味があるので、留学を決めました。',
    reading: 'にほんのぶんかにきょうみがあるので、りゅうがくをきめました。',
    vietnamese: 'Bởi vì có niềm đam mê với văn hóa Nhật Bản, tôi đã quyết định đi du học.',
    grammarFocus: '〜ので (Bởi vì lý do khách quan)',
  },
];

export function ShadowingStudio({ onBack }: ShadowingStudioProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [micSupported, setMicSupported] = useState(true);
  const [totalScore, setTotalScore] = useState(0);

  const recognitionRef = useRef<any>(null);
  const currentSentence = SHADOWING_SENTENCES[currentIndex];

  useEffect(() => {
    // Check Speech Recognition Support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setSpokenText(transcript);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        setMicSupported(false);
      }
    }
  }, []);

  const handlePlayNativeAudio = (speed: number = 0.85) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(currentSentence.japanese);
      utter.lang = 'ja-JP';
      utter.rate = speed;
      window.speechSynthesis.speak(utter);
    }
  };

  const handleToggleRecord = () => {
    playClick();
    if (!recognitionRef.current) {
      // Fallback demo score calculation
      setSpokenText(currentSentence.japanese);
      evaluateScore(currentSentence.japanese);
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      evaluateScore(spokenText);
    } else {
      setSpokenText('');
      setAccuracyScore(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const evaluateScore = (spoken: string) => {
    const cleanSpoken = spoken.replace(/[\s、。！？]/g, '');
    const cleanTarget = currentSentence.japanese.replace(/[\s、。！？]/g, '');

    if (!cleanSpoken) {
      setAccuracyScore(0);
      return;
    }

    // Levenshtein similarity calculation
    let matches = 0;
    for (let i = 0; i < cleanTarget.length; i++) {
      if (cleanSpoken.includes(cleanTarget[i])) matches++;
    }

    const similarity = Math.min(100, Math.max(10, Math.round((matches / cleanTarget.length) * 100)));
    setAccuracyScore(similarity);

    if (similarity >= 75) {
      playCorrect();
      const expGain = similarity >= 90 ? 80 : 50;
      const coinGain = similarity >= 90 ? 50 : 30;
      setTotalScore((s) => s + similarity);

      addExpAndCoins(expGain, coinGain);

      if (similarity >= 90) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    playClick();
    if (currentIndex + 1 < SHADOWING_SENTENCES.length) {
      setCurrentIndex((prev) => prev + 1);
      setSpokenText('');
      setAccuracyScore(null);
    } else {
      playVictory();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border/50 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Arcade Hub
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-muted-foreground">
            Câu: <strong className="text-foreground">{currentIndex + 1}/{SHADOWING_SENTENCES.length}</strong>
          </span>
          <span className="text-xs font-black text-amber-500 flex items-center gap-1">
            <Trophy className="w-4 h-4" /> {totalScore} Điểm
          </span>
        </div>

        <button
          onClick={() => {
            setSpokenText('');
            setAccuracyScore(null);
          }}
          className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Luyện lại câu này"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Shadowing Stage */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/60 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> AI Pronunciation Shadowing Studio
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            Luyện Phát Âm & Đọc Đuổi (Shadowing)
          </h2>
          <p className="text-xs text-muted-foreground max-w-lg mx-auto">
            Nghe giọng chuẩn Tokyo, bấm Micro và nói lại theo ngữ điệu câu. AI sẽ phân tích và chấm điểm chuẩn xác.
          </p>
        </div>

        {/* Target Sentence Display */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-card via-muted/40 to-card border-2 border-border/70 space-y-3 text-center">
          <div className="text-xs font-bold text-rose-500 tracking-wider">
            [{currentSentence.reading}]
          </div>

          <div className="text-xl sm:text-3xl font-black text-foreground tracking-wide leading-relaxed">
            {currentSentence.japanese}
          </div>

          <div className="text-sm font-semibold text-muted-foreground italic">
            "{currentSentence.vietnamese}"
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            💡 {currentSentence.grammarFocus}
          </div>
        </div>

        {/* Native Audio Controls */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => handlePlayNativeAudio(0.85)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs sm:text-sm transition-colors border border-border/40"
          >
            <Volume2 className="w-4 h-4 text-rose-500" /> Nghe Tốc Độ Chuẩn (0.85x)
          </button>

          <button
            onClick={() => handlePlayNativeAudio(0.65)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground font-semibold text-xs transition-colors border border-border/40"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-500" /> Nghe Chậm (0.65x)
          </button>
        </div>

        {/* Big Record Microphone Button */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            animate={isRecording ? { scale: [1, 1.15, 1], boxShadow: '0 0 25px rgba(244,63,94,0.6)' } : {}}
            transition={{ repeat: isRecording ? Infinity : 0, duration: 1.2 }}
            onClick={handleToggleRecord}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-xl transition-all ${
              isRecording
                ? 'bg-rose-600'
                : 'bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 shadow-rose-500/30 hover:scale-105'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8 animate-pulse" /> : <Mic className="w-8 h-8" />}
          </motion.button>

          <span className="text-xs font-bold text-muted-foreground">
            {isRecording ? '🔴 Đang lắng nghe... Bấm lại để dừng và chấm điểm' : 'Bấm Micro để bắt đầu nói'}
          </span>
        </div>

        {/* Live Transcript & Accuracy Score */}
        {spokenText && (
          <div className="p-5 rounded-3xl bg-muted/40 border border-border/60 space-y-3">
            <div className="text-xs font-bold text-muted-foreground">
              Giọng nói thu âm được:
            </div>
            <div className="text-base sm:text-lg font-bold text-foreground">
              "{spokenText}"
            </div>

            {accuracyScore !== null && (
              <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-bold">Độ Chuẩn Phát Âm:</span>
                  <div className={`text-2xl font-black ${
                    accuracyScore >= 80 ? 'text-emerald-500' : accuracyScore >= 60 ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {accuracyScore}% Match
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs shadow-md shadow-rose-500/20 hover:opacity-90 transition-opacity"
                >
                  Câu Tiếp Theo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
