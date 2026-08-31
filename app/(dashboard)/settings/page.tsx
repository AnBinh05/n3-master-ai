'use client';

import { useState } from 'react';
import { Settings, Crown, CheckCircle2, Zap, Download, Shield } from 'lucide-react';
import { exportCardsToCSV } from '@/lib/anki-parser';

export default function SettingsPage() {
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [userPlan, setUserPlan] = useState<'FREE' | 'PRO'>('PRO'); // Default demo PRO badge

  const handleUpgradeStripe = async () => {
    setLoadingStripe(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStripe(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const res = await fetch('/api/decks');
      const data = await res.json();
      const decks = data.decks || [];

      let allCards: any[] = [];
      for (const deck of decks) {
        const cRes = await fetch(`/api/cards?deckId=${deck.id}`);
        if (cRes.ok) {
          const cData = await cRes.json();
          allCards.push(...(cData.cards || []));
        }
      }

      const csvContent = exportCardsToCSV(allCards);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `n3_master_cards_backup_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-black text-foreground flex items-center gap-2">
          <Settings className="w-8 h-8 text-rose-500" /> Cài Đặt & Gói Học
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý tài khoản, gói Pro Subscription Stripe và sao lưu dữ liệu bộ thẻ.
        </p>
      </div>

      {/* Subscription Card */}
      <div className="bg-card p-6 sm:p-8 rounded-3xl border-2 border-rose-500/50 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-emerald-500">Trạng thái gói</span>
              <h2 className="text-xl font-black text-foreground">100% Free Plan (Toàn Bộ 12 Unit Mimikara N3)</h2>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Miễn Phí Vĩnh Viễn
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-foreground/90 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Trọn bộ 880 từ vựng Mimikara N3 chia theo 12 Unit
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ôn tập SRS không giới hạn mỗi ngày
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI Assistant, AI Quiz & Sửa lỗi không giới hạn
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cài đặt ứng dụng PWA Offline trực tiếp điện thoại
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleUpgradeStripe}
            disabled={loadingStripe}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 hover:opacity-95 disabled:opacity-50"
          >
            {loadingStripe ? 'Đang Kết Nối Stripe...' : 'Nâng Cấp / Quản Lý Gói Stripe ($9.99/mo)'}
          </button>
        </div>
      </div>

      {/* Data Backup & Export Section */}
      <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-500" /> Sao Lưu & Export Dữ Liệu
        </h2>
        <p className="text-xs text-muted-foreground">
          Xuất toàn bộ bộ thẻ và dữ liệu SRS ra định dạng CSV chuẩn để import vào Anki Desktop hoặc sao lưu an toàn.
        </p>

        <button
          onClick={handleExportBackup}
          className="px-5 py-2.5 rounded-2xl bg-muted border border-border/60 text-foreground font-bold text-xs hover:bg-muted/80 inline-flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-indigo-500" /> Xuất File Backup CSV (.csv)
        </button>
      </div>
    </div>
  );
}
