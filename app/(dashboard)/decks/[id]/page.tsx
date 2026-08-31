'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layers, Plus, Sparkles, Trash2, ArrowLeft, Upload, Volume2, BookOpen } from 'lucide-react';
import { parseCSVCards } from '@/lib/anki-parser';

export default function DeckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const [deck, setDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Add Card Form
  const [frontText, setFrontText] = useState('');
  const [backReading, setBackReading] = useState('');
  const [backMeaning, setBackMeaning] = useState('');
  const [backText, setBackText] = useState('');

  // AI Prompt Form
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchDeckDetails();
  }, [deckId]);

  const fetchDeckDetails = async () => {
    try {
      const res = await fetch('/api/decks');
      const data = await res.json();
      const match = (data.decks || []).find((d: any) => d.id === deckId);
      if (match) setDeck(match);

      // Fetch cards for deck
      const resCards = await fetch(`/api/cards?deckId=${deckId}`);
      if (resCards.ok) {
        const cardsData = await resCards.json();
        setCards(cardsData.cards || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontText || !backMeaning) return;

    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckId,
          frontText,
          backReading,
          backMeaning,
          backText,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setFrontText('');
        setBackReading('');
        setBackMeaning('');
        setBackText('');
        fetchDeckDetails();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAiGenerateCard = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await res.json();
      if (data.card) {
        // Save to DB
        await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deckId,
            ...data.card,
          }),
        });

        setShowAiModal(false);
        setAiPrompt('');
        fetchDeckDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thẻ này?')) return;
    try {
      await fetch(`/api/cards?id=${cardId}`, { method: 'DELETE' });
      fetchDeckDetails();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSVCards(text);
      if (parsed.length > 0) {
        await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckId, cards: parsed }),
        });
        fetchDeckDetails();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link href="/decks" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-rose-500 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách Decks
      </Link>

      {/* Deck Header */}
      <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
            {deck?.category || 'VOCABULARY'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground mt-2">{deck?.title || 'Chi Tiết Bộ Thẻ'}</h1>
          <p className="text-sm text-muted-foreground mt-1">{deck?.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-xs shadow-md hover:opacity-95"
          >
            <Sparkles className="w-4 h-4" /> AI Tạo Thẻ Tự Động
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-muted text-foreground font-bold text-xs hover:bg-muted/80 cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-500" /> Import Anki/CSV
            <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
          </label>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500 text-white font-extrabold text-xs shadow-md hover:bg-rose-600"
          >
            <Plus className="w-4 h-4" /> Thêm Thẻ Thủ Công
          </button>
        </div>
      </div>

      {/* Cards Table / Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-500" /> Danh Sách Thẻ Trong Bộ ({cards.length})
        </h2>

        {cards.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-3xl border border-border/50 p-6 text-muted-foreground">
            Bộ thẻ này hiện chưa có thẻ nào. Hãy nhấp &quot;AI Tạo Thẻ Tự Động&quot; hoặc &quot;Thêm Thẻ Thủ Công&quot;!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div key={card.id} className="bg-card p-4 rounded-2xl border border-border/60 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-2xl font-black text-foreground font-japanese">{card.frontText}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{card.backReading}</p>
                    <p className="text-sm font-bold text-rose-500 mt-1">{card.backMeaning}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                    title="Xóa thẻ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {card.backText && (
                  <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-xl italic">
                    &quot;{card.backText}&quot;
                  </p>
                )}

                <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/40 flex items-center justify-between font-semibold">
                  <span>EF: {card.easeFactor}</span>
                  <span>Lần ôn: {card.repetitions}</span>
                  <span className="uppercase text-rose-500">{card.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Generate Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md p-6 rounded-3xl border border-border shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" /> AI Auto Generate Flashcard
            </h3>

            <p className="text-xs text-muted-foreground">
              Nhập từ vựng, kanji hoặc câu tiếng Nhật N3. AI sẽ tự động phân tích nghĩa, Furigana, ví dụ và Hán tự breakdown!
            </p>

            <input
              type="text"
              placeholder="VD: 解決, 遠慮, わけがない"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full p-3 rounded-xl bg-muted/50 border border-border text-sm focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted"
              >
                Hủy
              </button>
              <button
                onClick={handleAiGenerateCard}
                disabled={aiLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-xs shadow-md disabled:opacity-50"
              >
                {aiLoading ? 'AI Đang Tạo...' : 'Tạo Thẻ Ngay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md p-6 rounded-3xl border border-border shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground">Thêm Thẻ Mới Thủ Công</h3>

            <form onSubmit={handleAddCard} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Mặt trước (Kanji/Kana)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 遠慮"
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-muted/50 border border-border text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Cách đọc (Reading/Furigana)</label>
                <input
                  type="text"
                  placeholder="VD: えんりょ"
                  value={backReading}
                  onChange={(e) => setBackReading(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-muted/50 border border-border text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Nghĩa tiếng Việt</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Ngại ngùng, e dè"
                  value={backMeaning}
                  onChange={(e) => setBackMeaning(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-muted/50 border border-border text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Ví dụ minh họa</label>
                <textarea
                  placeholder="VD: 遠慮しないでください。"
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-muted/50 border border-border text-sm h-20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs shadow-md"
                >
                  Lưu Thẻ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
