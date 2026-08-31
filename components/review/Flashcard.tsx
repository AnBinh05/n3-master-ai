'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Sparkles, BookOpen, Layers, HelpCircle, Eye } from 'lucide-react';

export interface CardData {
  id: string;
  frontText: string;
  backReading?: string | null;
  backMeaning: string;
  backText?: string | null;
  backExamples?: string | null;
  kanjiBreakdown?: string | null;
  easeFactor: number;
  interval: number;
  repetitions: number;
}

interface FlashcardProps {
  card: CardData;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showKanjiModal, setShowKanjiModal] = useState(false);

  // Web Speech Synthesis TTS for Japanese pronunciation
  const speakJapanese = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    setIsPlayingAudio(true);
    const utterance = new SpeechSynthesisUtterance(card.frontText);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85; // Slightly slower for clear JLPT learning
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  // Parse JSON data safely
  let examples: string[] = [];
  let kanjis: { kanji: string; meaning: string }[] = [];

  try {
    if (card.backExamples) {
      examples = typeof card.backExamples === 'string' ? JSON.parse(card.backExamples) : card.backExamples;
    }
  } catch (e) {
    examples = [];
  }

  try {
    if (card.kanjiBreakdown) {
      kanjis = typeof card.kanjiBreakdown === 'string' ? JSON.parse(card.kanjiBreakdown) : card.kanjiBreakdown;
    }
  } catch (e) {
    kanjis = [];
  }

  return (
    <div className="w-full max-w-lg mx-auto perspective-1000 my-4">
      <motion.div
        className="w-full min-h-[360px] cursor-pointer relative transform-style-3d transition-transform duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        onClick={onFlip}
      >
        {/* ================= FRONT SIDE ================= */}
        <div className="absolute inset-0 w-full h-full rounded-3xl border border-rose-500/20 bg-card p-6 shadow-2xl backface-hidden flex flex-col justify-between overflow-hidden">
          {/* Decorative Sakura Background Accent */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

          {/* Top Header info */}
          <div className="flex items-center justify-between z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <Sparkles className="w-3.5 h-3.5" /> JLPT N3 Card
            </span>
            
            <button
              onClick={speakJapanese}
              className={`p-2.5 rounded-full transition-all ${
                isPlayingAudio ? 'bg-rose-500 text-white scale-110 shadow-lg shadow-rose-500/30' : 'bg-muted hover:bg-rose-500/10 hover:text-rose-500'
              }`}
              title="Phát âm tiếng Nhật"
            >
              <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          {/* Card Front Content */}
          <div className="my-auto text-center z-10 py-6">
            <h2 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground mb-3 font-japanese">
              {card.frontText}
            </h2>
            <span className="inline-block px-3 py-1 rounded-lg bg-muted text-[11px] font-bold text-muted-foreground">
              Nhấp để xem Cách đọc & Nghĩa
            </span>
          </div>

          {/* Bottom Flip Hint */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground z-10 pt-2 border-t border-border/50">
            <Eye className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Chạm hoặc nhấp để xem đáp án</span>
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div className="absolute inset-0 w-full h-full rounded-3xl border border-indigo-500/20 bg-card p-6 shadow-2xl backface-hidden rotate-y-180 flex flex-col justify-between overflow-y-auto">
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={speakJapanese}
                className="p-2 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                title="Phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold text-foreground">{card.frontText}</span>
            </div>

            {card.backReading && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
                {card.backReading}
              </span>
            )}
          </div>

          {/* Meaning Section */}
          <div className="my-3">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
              Nghĩa tiếng Việt (JLPT N3)
            </div>
            <p className="text-xl font-bold text-foreground leading-snug">
              {card.backMeaning}
            </p>
          </div>

          {/* Examples Section */}
          {examples.length > 0 && (
            <div className="mb-3 bg-muted/50 p-3 rounded-2xl border border-border/40">
              <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                Ví dụ ngữ cảnh N3:
              </div>
              <ul className="space-y-1 text-xs text-foreground/90">
                {examples.map((ex, i) => (
                  <li key={i} className="leading-relaxed">
                    • {ex}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Kanji Breakdown Section */}
          {kanjis.length > 0 && (
            <div className="bg-amber-500/10 p-2.5 rounded-2xl border border-amber-500/20">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Hán tự cấu thành:
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {kanjis.map((k, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-background font-semibold text-foreground border border-border">
                    <strong className="text-rose-500 mr-1">{k.kanji}</strong> {k.meaning}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Footer info */}
          <div className="pt-2 text-center text-[11px] text-muted-foreground border-t border-border/40">
            EF: {card.easeFactor} | Lần ôn: {card.repetitions}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
