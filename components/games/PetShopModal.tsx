'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  X, 
  Sparkles, 
  Coins, 
  Check, 
  Shirt, 
  Zap, 
  Heart,
  Crown
} from 'lucide-react';
import { 
  getGamificationProfile, 
  PET_SHOP_ITEMS, 
  ShopItem, 
  purchaseShopItem, 
  equipPetOutfit, 
  PetOutfitId,
  GamificationProfile
} from '@/lib/gamification';
import { playClick, playCoin, playVictory } from '@/lib/game-audio';

interface PetShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PetShopModal({ isOpen, onClose }: PetShopModalProps) {
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setProfile(getGamificationProfile());
    }
  }, [isOpen]);

  if (!isOpen || !profile) return null;

  const handleBuy = (item: ShopItem) => {
    playClick();
    const res = purchaseShopItem(item);
    setFeedback(res.message);
    setProfile(res.profile);

    if (res.success) {
      playCoin();
      if (item.type === 'OUTFIT') {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      }
    }

    setTimeout(() => setFeedback(null), 3500);
  };

  const handleEquip = (outfitId: PetOutfitId) => {
    playClick();
    const res = equipPetOutfit(outfitId);
    setFeedback(res.message);
    setProfile(res.profile);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-card border border-border/60 shadow-2xl p-6 sm:p-8 overflow-hidden flex flex-col">
        {/* Decorative Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground">
                Cửa Hàng Thời Trang & Buff Linh Thú 🏪
              </h2>
              <p className="text-xs text-muted-foreground">
                Sắm phụ kiện độc quyền tăng vĩnh viễn EXP, Vàng và chỉ số chiến đấu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Coins indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black">
              <Coins className="w-4 h-4 fill-amber-500" />
              <span>{profile.coins} Vàng</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-bold text-center"
            >
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {PET_SHOP_ITEMS.map((item) => {
            const isOwned = item.type === 'OUTFIT' && profile.pet.unlockedOutfits.includes(item.id);
            const isEquipped = item.type === 'OUTFIT' && profile.pet.outfit === item.id;
            const canAfford = profile.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isEquipped
                    ? 'bg-rose-500/10 border-rose-500 shadow-md'
                    : isOwned
                      ? 'bg-muted/30 border-border/60'
                      : 'bg-card border-border/60 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    {item.icon}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-foreground">{item.name}</h4>
                      {isEquipped && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                          Đang Mặc
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      {item.buffText}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {item.type === 'CONSUMABLE' ? (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 active:scale-95 shadow-md shadow-amber-500/20'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5 fill-current" /> {item.cost} Vàng
                    </button>
                  ) : isOwned ? (
                    isEquipped ? (
                      <button
                        onClick={() => handleEquip('classic')}
                        className="px-3.5 py-1.5 rounded-xl bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Tháo Đồ
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEquip(item.id as PetOutfitId)}
                        className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-black shadow-md hover:bg-rose-600 transition-colors"
                      >
                        Mặc Đồ ✨
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-90 active:scale-95 shadow-md shadow-rose-500/20'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5 fill-current" /> Mua ({item.cost} Vàng)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/50 flex justify-between items-center shrink-0 text-xs text-muted-foreground">
          <span>💡 Trang phục mua một lần, dùng vĩnh viễn cho cả Mèo & Cún!</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
