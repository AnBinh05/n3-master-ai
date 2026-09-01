'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Layers, 
  Flame, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Brain, 
  BookOpen,
  Zap,
  Bot,
  GraduationCap,
  PlayCircle,
  Gamepad2,
  Swords,
  Coins,
  Search,
  X,
  Filter,
  ChevronRight,
  TrendingUp,
  Calendar,
  Gift,
  HelpCircle,
  Compass
} from 'lucide-react';
import { MascotWidget } from '@/components/games/MascotWidget';
import { OmikujiModal } from '@/components/games/OmikujiModal';
import { HeatmapCalendar } from '@/components/stats/HeatmapCalendar';
import { getGamificationProfile } from '@/lib/gamification';

interface DeckItem {
  id: string;
  title: string;
  description: string;
  category: string;
  totalCards: number;
  dueCardsCount: number;
}

interface DashboardClientViewProps {
  initialDecks: DeckItem[];
  totalCards: number;
  totalDue: number;
}

type CategoryFilter = 'ALL' | 'NOUN' | 'VERB' | 'ADJ_KATA' | 'ADV_CONJ' | 'GRAMMAR';

export function DashboardClientView({ initialDecks, totalCards, totalDue }: DashboardClientViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');
  const [showOmikuji, setShowOmikuji] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Sync profile & gamification updates
  useEffect(() => {
    loadProfile();
    const handleGamificationUpdate = () => {
      loadProfile();
    };
    window.addEventListener('gamification_update', handleGamificationUpdate);
    return () => window.removeEventListener('gamification_update', handleGamificationUpdate);
  }, []);

  const loadProfile = () => {
    try {
      const p = getGamificationProfile();
      setUserProfile(p);
    } catch (e) {
      console.error(e);
    }
  };

  // Tính số ngày còn lại đến kỳ thi JLPT gần nhất (Chủ nhật đầu tiên của Tháng 7 hoặc Tháng 12)
  const jlptDaysRemaining = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    // JLPT Tháng 7 (Chủ nhật đầu tiên tháng 7)
    const july1 = new Date(currentYear, 6, 1);
    const julySunday = 1 + ((7 - july1.getDay()) % 7);
    const examJuly = new Date(currentYear, 6, julySunday);

    // JLPT Tháng 12 (Chủ nhật đầu tiên tháng 12)
    const dec1 = new Date(currentYear, 11, 1);
    const decSunday = 1 + ((7 - dec1.getDay()) % 7);
    const examDec = new Date(currentYear, 11, decSunday);

    let nextExam = examJuly;
    if (now > examJuly) {
      if (now <= examDec) {
        nextExam = examDec;
      } else {
        const nextJuly1 = new Date(currentYear + 1, 6, 1);
        const nextJulySunday = 1 + ((7 - nextJuly1.getDay()) % 7);
        nextExam = new Date(currentYear + 1, 6, nextJulySunday);
      }
    }

    const diffTime = nextExam.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, []);

  // Lời chào thông minh theo thời gian
  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: 'Ohayou gozaimasu! Chào buổi sáng', icon: '🌅' };
    } else if (hour >= 12 && hour < 18) {
      return { text: 'Konnichiwa! Chúc bạn buổi chiều học tập hiệu quả', icon: '☀️' };
    } else {
      return { text: 'Konbanwa! Chúc bạn buổi tối ôn tập tập trung', icon: '🌙' };
    }
  }, []);

  // Phân loại Deck theo Category
  const categorizeDeck = (deck: DeckItem): CategoryFilter => {
    if (deck.category === 'GRAMMAR' || deck.id.includes('grammar')) return 'GRAMMAR';
    
    const numMatch = deck.title.match(/Unit\s*(\d+)/i) || deck.id.match(/unit-(\d+)/i);
    const unitNum = numMatch ? parseInt(numMatch[1], 10) : 1;

    if ([1, 2, 4].includes(unitNum)) return 'NOUN';
    if ([3, 6, 7, 10].includes(unitNum)) return 'VERB';
    if ([5, 8, 11].includes(unitNum)) return 'ADJ_KATA';
    if ([9, 12].includes(unitNum)) return 'ADV_CONJ';

    return 'NOUN';
  };

  // Lọc Deck theo tab và search query
  const filteredDecks = useMemo(() => {
    return initialDecks.filter((deck) => {
      // 1. Lọc theo danh mục
      if (selectedCategory !== 'ALL') {
        const cat = categorizeDeck(deck);
        if (cat !== selectedCategory) return false;
      }

      // 2. Lọc theo từ khóa tìm kiếm
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = deck.title.toLowerCase().includes(q);
        const descMatch = deck.description?.toLowerCase().includes(q);
        return titleMatch || descMatch;
      }

      return true;
    });
  }, [initialDecks, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Omikuji Luck Modal */}
      <OmikujiModal isOpen={showOmikuji} onClose={() => setShowOmikuji(false)} />

      {/* Hero Interactive Banner with Sakura Gradient */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 text-white shadow-2xl shadow-rose-500/20 border border-white/10">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-black shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> {timeGreeting.icon} {timeGreeting.text}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-extrabold backdrop-blur-md">
                <Clock className="w-3.5 h-3.5" /> Còn {jlptDaysRemaining} ngày tới kỳ thi JLPT N3
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Chinh Phục <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-white bg-clip-text text-transparent">880 Từ Vựng & Ngữ Pháp</span> JLPT N3 🎌
            </h1>

            <p className="text-white/90 text-sm sm:text-base font-medium leading-relaxed">
              Bạn có <strong className="px-2 py-0.5 rounded-lg bg-white/20 text-amber-300 font-extrabold">{totalDue} thẻ đang chờ học</strong> hôm nay.
              Học ngắt quãng SRS đều đặn để nhớ sâu vào trí nhớ dài hạn!
            </p>
          </div>

          {/* Quick Action Hub in Hero */}
          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-3 shrink-0">
            <Link
              href="/review"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-rose-600 font-black text-sm sm:text-base shadow-xl hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all group"
            >
              <Zap className="w-5 h-5 fill-rose-600 group-hover:animate-bounce" />
              Ôn Thẻ SRS Ngay ({totalDue})
            </Link>

            <button
              onClick={() => setShowOmikuji(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs sm:text-sm backdrop-blur-md border border-white/25 transition-all shadow-md active:scale-95"
            >
              <Gift className="w-4 h-4 text-amber-300" /> Rút Quẻ May Mắn (Omikuji)
            </button>
          </div>
        </div>
      </div>

      {/* Bento Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Streak */}
        <div className="bg-card p-5 rounded-3xl border border-border/60 shadow-sm hover:border-amber-500/40 hover:shadow-md transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shrink-0">
            <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-foreground truncate">
              {userProfile?.streak || 7} Ngày
            </div>
            <div className="text-xs font-bold text-muted-foreground flex items-center gap-1 truncate">
              <TrendingUp className="w-3 h-3 text-amber-500" /> Chuỗi học liên tục
            </div>
          </div>
        </div>

        {/* Due Cards */}
        <div className="bg-card p-5 rounded-3xl border border-border/60 shadow-sm hover:border-rose-500/40 hover:shadow-md transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-rose-500 truncate">
              {totalDue} Thẻ
            </div>
            <div className="text-xs font-bold text-muted-foreground truncate">
              Cần ôn tập hôm nay
            </div>
          </div>
        </div>

        {/* Total Mimikara Units */}
        <div className="bg-card p-5 rounded-3xl border border-border/60 shadow-sm hover:border-indigo-500/40 hover:shadow-md transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-foreground truncate">
              {totalCards} Từ
            </div>
            <div className="text-xs font-bold text-muted-foreground truncate">
              12 Unit Mimikara N3
            </div>
          </div>
        </div>

        {/* Gamification Coins & Level */}
        <div className="bg-card p-5 rounded-3xl border border-border/60 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shrink-0">
            <Coins className="w-6 h-6 text-amber-500" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 truncate">
              {userProfile?.coins || 120} Vàng
            </div>
            <div className="text-xs font-bold text-muted-foreground truncate">
              Cấp độ {userProfile?.level || 1} (EXP: {userProfile?.exp || 0})
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Mascot & Quick Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mascot Widget */}
        <div className="lg:col-span-2">
          <MascotWidget />
        </div>

        {/* Fast Action Cards */}
        <div className="flex flex-col justify-between gap-3">
          <Link
            href="/dokkai"
            className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/20 via-purple-500/10 to-card border border-rose-500/40 hover:border-rose-500/80 shadow-md hover:shadow-xl transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-foreground">Luyện Đọc Hiểu Dokkai</h3>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-rose-500 text-white">Mới</span>
                </div>
                <p className="text-xs text-muted-foreground">Furigana • Mổ xẻ câu • Soi manh mối</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-rose-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/mock-test"
            className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-card border border-indigo-500/30 hover:border-indigo-500/60 shadow-md hover:shadow-xl transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-foreground">Phòng Thi Thử JLPT N3</h3>
                <p className="text-xs text-muted-foreground">105 phút • Phiếu OMR • 180 điểm</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/games"
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-card border border-rose-500/30 hover:border-rose-500/60 shadow-md hover:shadow-xl transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-foreground">Võ Đài Trò Chơi N3</h3>
                <p className="text-xs text-muted-foreground">Ninja Chém Chữ • Đấu Boss • Shadowing</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-rose-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Main Section: 12 Units Mimikara Explorer with Category Filters & Search */}
      <div className="space-y-6 pt-2">
        {/* Header & CSV Download */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black mb-1.5">
              <GraduationCap className="w-3.5 h-3.5" /> Lộ Trình Sách Giáo Khoa Chuẩn
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-foreground flex items-center gap-2">
              Khám Phá 12 Unit Mimikara N3 & Ngữ Pháp
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Học từ vựng chuẩn ngữ cảnh, nghe phát âm và làm bài tập trắc nghiệm từng Unit.
            </p>
          </div>

          <a
            href="/mimikara_n3_880.csv"
            download="mimikara_n3_880.csv"
            className="inline-flex items-center gap-2 text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2.5 rounded-2xl transition-all border border-rose-500/25 shadow-sm self-start md:self-auto active:scale-95"
          >
            📥 Tải File CSV 880 Từ (Chuẩn Anki)
          </a>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'ALL'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Tất Cả (13)
            </button>

            <button
              onClick={() => setSelectedCategory('NOUN')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'NOUN'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Danh Từ (4 Unit)
            </button>

            <button
              onClick={() => setSelectedCategory('VERB')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'VERB'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Động Từ (4 Unit)
            </button>

            <button
              onClick={() => setSelectedCategory('ADJ_KATA')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'ADJ_KATA'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Tính Từ & Katakana (3 Unit)
            </button>

            <button
              onClick={() => setSelectedCategory('ADV_CONJ')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'ADV_CONJ'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Phó Từ & Liên Từ (2 Unit)
            </button>

            <button
              onClick={() => setSelectedCategory('GRAMMAR')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'GRAMMAR'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              <Brain className="w-3.5 h-3.5" /> Ngữ Pháp N3
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm Unit hoặc từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-2xl bg-muted/60 border border-border/60 text-xs font-medium text-foreground focus:ring-2 focus:ring-rose-500 focus:bg-card transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Decks Grid */}
        {filteredDecks.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-3xl border border-dashed border-border text-muted-foreground space-y-3">
            <p className="text-sm font-bold">Không tìm thấy Unit nào phù hợp với từ khóa &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
              className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-extrabold shadow-md"
            >
              Xóa Bộ Lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDecks.map((deck: any, idx: number) => {
              const due = deck.dueCardsCount;
              const progressPercent = deck.totalCards > 0
                ? Math.round(((deck.totalCards - due) / deck.totalCards) * 100)
                : 0;

              const isGrammar = deck.category === 'GRAMMAR' || deck.id.includes('grammar');

              return (
                <div
                  key={deck.id}
                  className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm hover:border-rose-500/50 hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border ${
                        isGrammar 
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      }`}>
                        {isGrammar ? 'NGỮ PHÁP' : `UNIT ${idx + 1}`}
                      </span>

                      <span className="text-xs font-extrabold text-foreground bg-muted/80 px-2.5 py-1 rounded-xl">
                        {deck.totalCards} Thẻ
                      </span>
                    </div>

                    <Link href={`/decks/${deck.id}`}>
                      <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-rose-500 transition-colors line-clamp-1">
                        {deck.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {deck.description || 'Chưa có mô tả cho bộ thẻ này.'}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-muted-foreground">Tiến độ ghi nhớ</span>
                        <span className="text-rose-500">{progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-amber-500 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-amber-500" /> {due} thẻ cần học
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/quiz/${deck.id}`}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors border border-amber-500/20 flex items-center gap-1"
                        title="Làm bài kiểm tra trắc nghiệm"
                      >
                        🎯 Test
                      </Link>

                      <Link
                        href={`/decks/${deck.id}`}
                        className="px-2.5 py-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground text-xs font-bold transition-colors border border-border/40"
                        title="Xem danh sách từ vựng"
                      >
                        📖 Từ Vựng
                      </Link>

                      <Link
                        href={`/review/${deck.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-black hover:opacity-95 hover:scale-105 active:scale-95 transition-all shadow-md shadow-rose-500/20"
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> Học
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Analytics & Heatmap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                  <Bot className="w-5 h-5 text-rose-500" /> Trợ Lý AI Studio Thông Minh
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bộ công cụ AI thế hệ mới đồng hành luyện thi N3 24/7
                </p>
              </div>
              <Link href="/ai" className="text-xs font-black text-rose-500 hover:underline flex items-center gap-1">
                Vào Studio <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <Link
                href="/ai"
                className="p-4 rounded-2xl bg-muted/40 hover:bg-rose-500/10 hover:border-rose-500/30 border border-border/50 transition-all flex items-center gap-3 group shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">AI Flashcard</div>
                  <div className="text-xs text-muted-foreground">Tự tạo thẻ chuẩn N3</div>
                </div>
              </Link>

              <Link
                href="/ai"
                className="p-4 rounded-2xl bg-muted/40 hover:bg-amber-500/10 hover:border-amber-500/30 border border-border/50 transition-all flex items-center gap-3 group shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Giải Thích Ngữ Pháp</div>
                  <div className="text-xs text-muted-foreground">Bẫy đề thi N3</div>
                </div>
              </Link>

              <Link
                href="/ai"
                className="p-4 rounded-2xl bg-muted/40 hover:bg-indigo-500/10 hover:border-indigo-500/30 border border-border/50 transition-all flex items-center gap-3 group shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Đề Thi Trắc Nghiệm</div>
                  <div className="text-xs text-muted-foreground">Format đề thi thật</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Heatmap Column */}
        <div className="space-y-6">
          <HeatmapCalendar />
        </div>
      </div>
    </div>
  );
}
