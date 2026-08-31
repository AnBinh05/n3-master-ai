'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Plus, Search, Sparkles, BookOpen, Upload, FolderPlus } from 'lucide-react';

export default function DecksPage() {
  const [decks, setDecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('VOCABULARY');

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const res = await fetch('/api/decks');
      const data = await res.json();
      if (data.decks) setDecks(data.decks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, isPublic: true }),
      });
      if (res.ok) {
        setShowModal(false);
        setTitle('');
        setDescription('');
        fetchDecks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredDecks = decks.filter((deck) => {
    const matchesSearch = deck.title.toLowerCase().includes(search.toLowerCase()) || (deck.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || deck.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2">
            <Layers className="w-7 h-7 text-rose-500" /> Quản Lý Bộ Thẻ (Decks)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tất cả bộ thẻ từ vựng, ngữ pháp, kanji và đề thi JLPT N3 của bạn.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 hover:bg-rose-600 transition-colors"
        >
          <Plus className="w-5 h-5" /> Tạo Bộ Thẻ Mới
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-3xl border border-border/50">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm bộ thẻ N3..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/60 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'VOCABULARY', 'GRAMMAR', 'KANJI', 'LISTENING'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat === 'ALL' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Decks Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Đang tải bộ thẻ JLPT N3...</div>
      ) : filteredDecks.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-3xl border border-border/50 p-8 space-y-4">
          <FolderPlus className="w-12 h-12 text-rose-500 mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-foreground">Chưa có bộ thẻ nào</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Hãy tạo bộ thẻ mới hoặc sử dụng dữ liệu N3 mẫu sẵn có để bắt đầu ôn tập.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-rose-500 text-white font-bold text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tạo Thẻ Ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map((deck) => (
            <div
              key={deck.id}
              className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm hover:border-rose-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {deck.category}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {deck.totalCards} Thẻ
                  </span>
                </div>

                <Link href={`/decks/${deck.id}`}>
                  <h3 className="text-lg font-extrabold text-foreground group-hover:text-rose-500 transition-colors">
                    {deck.title}
                  </h3>
                </Link>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {deck.description || 'Chưa có mô tả cho bộ thẻ này.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500">
                  ⚡ {deck.dueCardsCount} thẻ cần học
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/decks/${deck.id}`}
                    className="px-3 py-1.5 rounded-xl bg-muted text-foreground text-xs font-bold hover:bg-muted/80 transition-colors"
                  >
                    Chi tiết
                  </Link>
                  <Link
                    href={`/review/${deck.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors shadow-sm"
                  >
                    Học
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Deck Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md p-6 rounded-3xl border border-border shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground">Tạo Bộ Thẻ JLPT N3 Mới</h3>

            <form onSubmit={handleCreateDeck} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Tên bộ thẻ</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Từ vựng N3 Mimikara Oboeru"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-muted/50 border border-border text-sm focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Phân loại (Category)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-muted/50 border border-border text-sm focus:ring-2 focus:ring-rose-500"
                >
                  <option value="VOCABULARY">TỪ VỰNG (Vocabulary)</option>
                  <option value="GRAMMAR">NGỮ PHÁP (Grammar)</option>
                  <option value="KANJI">HÁN TỰ (Kanji)</option>
                  <option value="LISTENING">NGHE HIỂU (Listening)</option>
                  <option value="READING">ĐỌC HIỂU (Reading)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Mô tả bộ thẻ</label>
                <textarea
                  placeholder="Ghi chú nội dung bộ thẻ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-muted/50 border border-border text-sm focus:ring-2 focus:ring-rose-500 h-24"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs shadow-md hover:bg-rose-600"
                >
                  Tạo Bộ Thẻ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
