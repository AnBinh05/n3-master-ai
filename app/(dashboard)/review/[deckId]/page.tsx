'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Flashcard, CardData } from '@/components/review/Flashcard';
import { SRSControls } from '@/components/review/SRSControls';
import { Rating } from '@/lib/srs';
import { Sparkles, Trophy, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DeckReviewPage() {
  const params = useParams();
  const deckId = params.deckId as string;

  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  useEffect(() => {
    fetchDeckCards();
  }, [deckId]);

  const fetchDeckCards = async () => {
    try {
      const res = await fetch(`/api/cards?deckId=${deckId}`);
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards || []);
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

    setStats((prev) => ({
      ...prev,
      [rating.toLowerCase()]: (prev as any)[rating.toLowerCase()] + 1,
    }));

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

    setIsFlipped(false);
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Sparkles className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-sm font-bold text-muted-foreground">Đang tải phiên học...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-card rounded-3xl border border-border text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Bộ Thẻ Này Chưa Có Thẻ Nào</h2>
        <p className="text-xs text-muted-foreground">Hãy thêm thẻ mới hoặc tự tạo thẻ AI trước khi bắt đầu học.</p>
        <Link href={`/decks/${deckId}`} className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs inline-block">
          Thêm Thẻ Cho Deck
        </Link>
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
          <h2 className="text-2xl font-black text-foreground">Hoàn Thành Deck! 🎉</h2>
          <p className="text-xs text-muted-foreground mt-1">Chúc mừng bạn đã ôn xong tất cả các thẻ trong bộ này.</p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href={`/quiz/${deckId}`}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-black text-sm shadow-lg shadow-rose-500/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> 🎯 Làm Bài Kiểm Tra Ghi Nhớ Ngay (Quiz)
          </Link>
          <button
            onClick={() => {
              setCompleted(false);
              setCurrentIndex(0);
            }}
            className="w-full py-3 rounded-2xl border border-border font-bold text-sm text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Học Lại Thẻ Trong Deck Này
          </button>
          <Link href="/dashboard" className="w-full py-2.5 font-semibold text-xs text-muted-foreground hover:text-rose-500 block text-center">
            ← Quay Lại Bảng Điều Khiển
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/decks" className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-rose-500">
          <ArrowLeft className="w-4 h-4" /> Danh sách Decks
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-rose-500">
            Thẻ {currentIndex + 1} / {cards.length}
          </span>
          <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {currentCard && (
        <Flashcard card={currentCard} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
      )}

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
