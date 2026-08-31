'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flashcard, CardData } from '@/components/review/Flashcard';
import { SRSControls } from '@/components/review/SRSControls';
import { Rating } from '@/lib/srs';
import { Sparkles, Trophy, CheckCircle2, RotateCcw, ArrowLeft, Coins, Zap } from 'lucide-react';
import Link from 'next/link';
import { addExpAndCoins, unlockAchievement } from '@/lib/gamification';
import { playCorrect, playClick, playVictory, playLevelUp } from '@/lib/game-audio';

export default function ReviewPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  useEffect(() => {
    fetchReviewCards();
  }, []);

  const fetchReviewCards = async () => {
    try {
      const res = await fetch('/api/decks');
      const data = await res.json();
      const allDecks = data.decks || [];

      // Collect cards from all decks
      let reviewQueue: CardData[] = [];

      for (const deck of allDecks) {
        const resCards = await fetch(`/api/cards?deckId=${deck.id}`);
        if (resCards.ok) {
          const cardsData = await resCards.json();
          reviewQueue.push(...(cardsData.cards || []));
        }
      }

      if (reviewQueue.length > 0) {
        setCards(reviewQueue);
      } else {
        // Fallback default demo cards for immediate study enjoyment
        setCards([
          {
            id: 'demo-1',
            frontText: '遠慮',
            backReading: 'えんりょ (enryo)',
            backMeaning: 'Ngại ngùng, e dè, kiềm chế',
            backText: '遠慮しないで、どうぞたくさん食べてください。',
            backExamples: JSON.stringify(['遠慮しないで。(Xin đừng ngại.)']),
            kanjiBreakdown: JSON.stringify([{ kanji: '遠', meaning: 'Viễn (xa)' }, { kanji: '慮', meaning: 'Lự (suy nghĩ)' }]),
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
          },
          {
            id: 'demo-2',
            frontText: '〜ことにしている',
            backReading: 'koto ni shite iru',
            backMeaning: 'Quyết định / Thói quen do bản thân tự quy định',
            backText: '毎朝、30分ジョギングすることにしている。',
            backExamples: JSON.stringify(['寝る前にスマホを見ないことにしている。']),
            kanjiBreakdown: null,
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
          },
          {
            id: 'demo-3',
            frontText: '印象',
            backReading: 'いんしょう (inshou)',
            backMeaning: 'Ấn tượng',
            backText: '第一印象がとても良かった。',
            backExamples: JSON.stringify(['面接で良い印象を与える。']),
            kanjiBreakdown: JSON.stringify([{ kanji: '印', meaning: 'Ấn' }, { kanji: '象', meaning: 'Tượng' }]),
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: Rating) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    // Play feedback sound
    if (rating === 'GOOD' || rating === 'EASY') {
      playCorrect();
    } else {
      playClick();
    }

    // Award EXP & Coins
    const expBonus = rating === 'EASY' ? 15 : rating === 'GOOD' ? 10 : 5;
    const coinBonus = rating === 'EASY' ? 8 : rating === 'GOOD' ? 5 : 2;
    const { leveledUp } = addExpAndCoins(expBonus, coinBonus);
    if (leveledUp) {
      setTimeout(() => playLevelUp(), 800);
    }

    unlockAchievement('first_card');

    // Record local stat counter
    setStats((prev) => ({
      ...prev,
      [rating.toLowerCase()]: (prev as any)[rating.toLowerCase()] + 1,
    }));

    // Submit review to API
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          rating,
        }),
      });
    } catch (e) {
      console.error(e);
    }

    // Move to next card or complete session
    setIsFlipped(false);
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      playVictory();
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };


  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Sparkles className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-sm font-bold text-muted-foreground">Đang chuẩn bị phiên ôn tập SRS N3...</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-card rounded-3xl border border-rose-500/30 text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-foreground">Hoàn Thành Phiên Ôn Tập! 🎉</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Tuyệt vời! Bạn đã hoàn thành toàn bộ thẻ SRS cần học hôm nay.
          </p>
        </div>

        {/* Review Breakdown */}
        <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-muted/60 text-xs">
          <div>
            <div className="font-bold text-rose-500">{stats.again}</div>
            <div className="text-[10px] text-muted-foreground">Again</div>
          </div>
          <div>
            <div className="font-bold text-amber-500">{stats.hard}</div>
            <div className="text-[10px] text-muted-foreground">Hard</div>
          </div>
          <div>
            <div className="font-bold text-emerald-500">{stats.good}</div>
            <div className="text-[10px] text-muted-foreground">Good</div>
          </div>
          <div>
            <div className="font-bold text-indigo-500">{stats.easy}</div>
            <div className="text-[10px] text-muted-foreground">Easy</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => {
              setCompleted(false);
              setCurrentIndex(0);
            }}
            className="w-full py-3 rounded-xl bg-rose-500 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Ôn Tập Lại Phiên Này
          </button>
          <Link
            href="/dashboard"
            className="w-full py-3 rounded-xl border border-border font-bold text-sm text-foreground hover:bg-muted block text-center"
          >
            Về Trang Chủ Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Progress Bar */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-rose-500">
          <ArrowLeft className="w-4 h-4" /> Bảng điều khiển
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-rose-500">
            Thẻ {currentIndex + 1} / {cards.length}
          </span>
          <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive 3D Flashcard */}
      {currentCard && (
        <Flashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />
      )}

      {/* SRS Controls Bar */}
      {currentCard && (
        <SRSControls
          easeFactor={currentCard.easeFactor}
          interval={currentCard.interval}
          repetitions={currentCard.repetitions}
          onRating={handleRating}
        />
      )}
    </div>
  );
}
