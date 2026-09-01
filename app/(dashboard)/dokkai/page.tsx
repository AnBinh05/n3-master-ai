'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  Wand2, 
  Zap, 
  Flame, 
  Clock, 
  Layers, 
  Award, 
  ChevronRight, 
  HelpCircle,
  Compass,
  FileText,
  Target
} from 'lucide-react';
import { 
  PRESET_DOKKAI_PASSAGES, 
  DokkaiPassage, 
  DokkaiLevel 
} from '@/lib/dokkai-data';
import { DokkaiReader } from '@/components/dokkai/DokkaiReader';
import { DokkaiStrategyModal } from '@/components/dokkai/DokkaiStrategyModal';
import { DokkaiAiGeneratorModal } from '@/components/dokkai/DokkaiAiGeneratorModal';

export default function DokkaiPage() {
  const [passages, setPassages] = useState<DokkaiPassage[]>(PRESET_DOKKAI_PASSAGES);
  const [selectedPassage, setSelectedPassage] = useState<DokkaiPassage | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Filter passages by level
  const filteredPassages = passages.filter((p) => {
    if (selectedLevel === 'ALL') return true;
    return p.level === selectedLevel;
  });

  const handleSelectPassage = (p: DokkaiPassage) => {
    setSelectedPassage(p);
  };

  const handleNextPassage = () => {
    if (!selectedPassage) return;
    const currentIndex = passages.findIndex((p) => p.id === selectedPassage.id);
    if (currentIndex < passages.length - 1) {
      setSelectedPassage(passages[currentIndex + 1]);
    } else {
      setSelectedPassage(passages[0]);
    }
  };

  const handleAddAiPassage = (newPassage: DokkaiPassage) => {
    setPassages((prev) => [newPassage, ...prev]);
    setSelectedPassage(newPassage);
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* If a passage is currently active, render the Smart Reader */}
      {selectedPassage ? (
        <DokkaiReader
          passage={selectedPassage}
          onBack={() => setSelectedPassage(null)}
          onNextPassage={handleNextPassage}
        />
      ) : (
        <>
          {/* Hero Banner with Rich Aesthetics */}
          <div className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-indigo-500/10 p-6 sm:p-8 backdrop-blur-xl">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                <Compass className="h-3.5 w-3.5 animate-spin text-rose-500" />
                <span>Phương Pháp Scaffolding Đột Phá Cho Người Sợ Đọc</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
                Luyện Đọc Hiểu N3{' '}
                <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Chuyên Sâu (Dokkai Master)
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Tập trung rèn luyện cho người học còn yếu với các trợ lực độc quyền: 
                <strong> Bật Furigana</strong>, <strong>Mổ xẻ Chủ ngữ - Vị ngữ</strong>, 
                <strong> 💡 Soi manh mối câu trả lời</strong> và <strong>Audio phát âm chuẩn</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setShowStrategyModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all transform hover:scale-105 active:scale-95"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>5 Bí Kíp Chiến Thuật Dokkai</span>
                </button>

                <button
                  onClick={() => setShowAiModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold transition-all transform hover:scale-105 active:scale-95"
                >
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span>AI Dokkai Studio (Tạo bài đọc)</span>
                </button>
              </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute right-4 bottom-4 opacity-10 dark:opacity-20 pointer-events-none hidden md:block">
              <BookOpen className="w-64 h-64 text-rose-500" />
            </div>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'Tất cả bài đọc', count: passages.length },
              { id: 'warmup', label: '🌱 Khởi động (Siêu ngắn)', count: passages.filter(p => p.level === 'warmup').length },
              { id: 'short', label: '📄 Đoản văn (Mondai 10)', count: passages.filter(p => p.level === 'short').length },
              { id: 'medium', label: '📑 Trung văn (Mondai 11)', count: passages.filter(p => p.level === 'medium').length },
              { id: 'info_retrieval', label: '📋 Tìm thông tin (Mondai 13)', count: passages.filter(p => p.level === 'info_retrieval').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedLevel(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedLevel === tab.id
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedLevel === tab.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Passage Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredPassages.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-xl hover:border-rose-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header Tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${p.badgeColor}`}>
                      {p.levelLabel}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Clock className="h-3 w-3 text-amber-500" />
                      <span>{p.estimatedMinutes} phút</span>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <h3 className="font-bold text-foreground text-sm sm:text-base group-hover:text-rose-500 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Chủ đề: <span className="font-semibold text-foreground">{p.category}</span>
                    </p>
                  </div>

                  {/* Target Skill */}
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border text-xs flex items-start gap-2">
                    <Target className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground text-[11px] block">Rèn luyện kỹ năng:</span>
                      <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-2">
                        {p.targetSkill}
                      </p>
                    </div>
                  </div>

                  {/* Pre-reading Vocab Peek */}
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <BookOpen className="h-3 w-3 text-indigo-500" />
                    <span>{p.preReadingVocab.length} từ vựng then chốt • {p.questions.length} câu hỏi</span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Hỗ trợ Furigana & Manh mối
                  </span>
                  <button
                    onClick={() => handleSelectPassage(p)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all group-hover:translate-x-0.5"
                  >
                    <span>Luyện ngay</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Strategy Handbook Modal */}
      <DokkaiStrategyModal
        isOpen={showStrategyModal}
        onClose={() => setShowStrategyModal(false)}
      />

      {/* AI Dokkai Generator Modal */}
      <DokkaiAiGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onPassageGenerated={handleAddAiPassage}
      />
    </div>
  );
}
