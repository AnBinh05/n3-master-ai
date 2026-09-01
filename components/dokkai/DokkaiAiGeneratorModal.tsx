'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Wand2, Loader2, BookOpen, Layers, Flame } from 'lucide-react';
import { DokkaiPassage, DokkaiLevel } from '@/lib/dokkai-data';

interface DokkaiAiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPassageGenerated: (passage: DokkaiPassage) => void;
}

const TOPIC_PRESETS = [
  'Đời sống thường nhật & Văn hóa Nhật Bản',
  'Kinh nghiệm làm việc bán thời gian (Baito)',
  'Thói quen sinh hoạt & Sức khỏe tinh thần',
  'Anime, Manga và Văn hóa trẻ Nhật Bản',
  'Du lịch & Trải nghiệm ẩm thực Tokyo / Kyoto',
  'Công nghệ AI & Tương lai việc làm',
  'Thông báo chung cư & Quy định đổ rác',
];

export function DokkaiAiGeneratorModal({
  isOpen,
  onClose,
  onPassageGenerated,
}: DokkaiAiGeneratorModalProps) {
  const [topic, setTopic] = useState(TOPIC_PRESETS[0]);
  const [level, setLevel] = useState<DokkaiLevel>('short');
  const [customTopic, setCustomTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    const selectedTopic = customTopic.trim() || topic;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/ai/dokkai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selectedTopic, level }),
      });

      const data = await res.json();
      if (data.passage) {
        onPassageGenerated(data.passage);
        onClose();
      } else {
        setErrorMsg('Không thể tạo bài đọc. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Lỗi kết nối máy chủ khi tạo bài đọc.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-purple-500/10 via-rose-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">
                AI Dokkai Studio
              </h2>
              <p className="text-xs text-muted-foreground">
                Tạo bài đọc hiểu JLPT N3 theo chủ đề yêu thích
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Level Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Chọn Cấp Độ Phù Hợp:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLevel('warmup')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  level === 'warmup'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-border bg-card hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">🌱 Khởi động (Siêu ngắn)</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">50-100 chữ • Dễ cho người yếu</p>
              </button>

              <button
                type="button"
                onClick={() => setLevel('short')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  level === 'short'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold'
                    : 'border-border bg-card hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">📄 Đoản văn (Mondai 10)</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">150-250 chữ • Chuẩn đề thi N3</p>
              </button>

              <button
                type="button"
                onClick={() => setLevel('medium')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  level === 'medium'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold'
                    : 'border-border bg-card hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">📑 Trung văn (Mondai 11)</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">350-450 chữ • Luyện đọc sâu</p>
              </button>

              <button
                type="button"
                onClick={() => setLevel('info_retrieval')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  level === 'info_retrieval'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-border bg-card hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">📋 Tìm thông tin (Mondai 13)</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Bảng biểu • Bẫy thời gian & phí</p>
              </button>
            </div>
          </div>

          {/* Topic Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Gợi ý Chủ Đề N3:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TOPIC_PRESETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTopic(t);
                    setCustomTopic('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    topic === t && !customTopic
                      ? 'bg-rose-500 text-white font-bold shadow-sm'
                      : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Topic Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Hoặc Nhập Chủ Đề Tự Do Của Bạn:
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="VD: Lễ hội pháo hoa Nhật Bản, Văn hóa đúng giờ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-500 font-semibold">{errorMsg}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI đang biên soạn bài đọc...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>Tạo bài đọc ngay</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
