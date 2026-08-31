'use client';

import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/60 bg-card/50 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Ownership */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white font-black text-xs shadow-md shadow-rose-500/20">
            N3
          </div>
          <span className="text-sm font-black tracking-tight text-foreground">
            N3 Master AI
          </span>
          <span className="text-muted-foreground text-xs hidden sm:inline">•</span>
          <span className="text-xs font-semibold text-muted-foreground">
            Nền Tảng Flashcard JLPT N3 Đột Phá Hỗ Trợ AI
          </span>
        </div>

        {/* Legal & Ownership Mark */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-black">
            <ShieldCheck className="w-3.5 h-3.5" /> Bản quyền & Quyền sở hữu thuộc về LÊ AN BÌNH
          </div>
          <p className="text-[11px] text-muted-foreground">
            © 2026 N3 Master AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
