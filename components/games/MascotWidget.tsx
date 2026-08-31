'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Utensils, Sparkles, Smile, RefreshCw, Trophy, HelpCircle, ShoppingBag } from 'lucide-react';
import { 
  getGamificationProfile, 
  saveGamificationProfile, 
  feedPet, 
  PetState 
} from '@/lib/gamification';
import { playClick, playCoin, playLevelUp } from '@/lib/game-audio';
import { GameGuideModal } from '@/components/games/GameGuideModal';
import { PetShopModal } from '@/components/games/PetShopModal';

interface MascotWidgetProps {
  compact?: boolean;
}

const MOTIVATIONAL_MESSAGES = [
  'Ganbatte kudasai! (Cố lên nhé!) 🌸',
  'Tuyệt vời! Bạn đang tiến bộ từng ngày! ✨',
  'Mỗi ngày 20 từ vựng, N3 trong tầm tay! 🎌',
  'Đừng quên ôn lại các thẻ SRS khó nhé! 💡',
  'Hôm nay bạn trông tràn đầy năng lượng! 🔥',
  'Nhai xong một Unit Mimikara thật là ngầu! 🍣',
];

export function MascotWidget({ compact = false }: MascotWidgetProps) {
  const [pet, setPet] = useState<PetState | null>(null);
  const [coins, setCoins] = useState(0);
  const [speech, setSpeech] = useState(MOTIVATIONAL_MESSAGES[0]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showShop, setShowShop] = useState(false);


  useEffect(() => {
    loadProfile();

    const handleUpdate = () => {
      loadProfile();
    };

    window.addEventListener('gamification_update', handleUpdate);
    return () => window.removeEventListener('gamification_update', handleUpdate);
  }, []);

  const loadProfile = () => {
    const profile = getGamificationProfile();
    setPet(profile.pet);
    setCoins(profile.coins);
  };


  const handleFeed = () => {
    playClick();
    const result = feedPet();
    setFeedback(result.message);
    setIsBouncing(true);

    if (result.success) {
      playCoin();
      if (result.profile.pet.level > (pet?.level || 1)) {
        playLevelUp();
      }
    }

    setTimeout(() => {
      setIsBouncing(false);
    }, 1000);

    setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  const handleTogglePetType = () => {
    playClick();
    const profile = getGamificationProfile();
    const newType = profile.pet.type === 'neko' ? 'shiba' : 'neko';
    const newName = newType === 'neko' ? 'Neko-chan' : 'Shiba-kun';
    const updated = {
      ...profile,
      pet: {
        ...profile.pet,
        type: newType as 'neko' | 'shiba',
        name: newName,
      },
    };
    saveGamificationProfile(updated);
    setSpeech(`Xin chào! Mình là ${newName}! 🐾`);
  };

  const handlePetClick = () => {
    setIsBouncing(true);
    playClick();
    const randomMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    setSpeech(randomMsg);
    setTimeout(() => setIsBouncing(false), 800);
  };

  if (!pet) return null;

  if (compact) {
    return (
      <div 
        onClick={handlePetClick}
        className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/60 shadow-md cursor-pointer hover:border-rose-500/50 transition-all group"
      >
        <motion.div
          animate={isBouncing ? { y: [-6, 2, -4, 0], scale: [1, 1.15, 1] } : { y: [0, -3, 0] }}
          transition={{ repeat: isBouncing ? 0 : Infinity, duration: 2 }}
          className="text-3xl select-none"
        >
          {pet.type === 'neko' ? '🐱' : '🐕'}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-foreground truncate">{pet.name} (Lv.{pet.level})</span>
            <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
              <Smile className="w-3 h-3" /> {pet.happiness}%
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">{speech}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-rose-500/5 border border-border/60 shadow-xl p-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground">Linh Thú Đồng Hành</h3>
            <p className="text-xs text-muted-foreground">Người bạn hỗ trợ tinh thần học N3</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowShop(true)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-xs font-bold text-amber-600 hover:bg-amber-500/20 flex items-center gap-1 transition-colors"
            title="Cửa hàng phụ kiện thú cưng"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Pet Shop
          </button>

          <button
            onClick={() => setShowGuide(true)}
            className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 text-xs font-bold text-rose-600 hover:bg-rose-500/20 flex items-center gap-1 transition-colors"
            title="Xem cách nuôi thú cưng"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Cách Nuôi
          </button>

          <button
            onClick={handleTogglePetType}
            className="px-2.5 py-1.5 rounded-xl bg-muted text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            title="Đổi linh thú khác"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Đổi
          </button>
        </div>
      </div>

      <GameGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        defaultTab="PET"
      />

      <PetShopModal
        isOpen={showShop}
        onClose={() => setShowShop(false)}
      />

      {/* Mascot Visual & Speech Bubble */}
      <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
        {/* Mascot Avatar with Accessory */}
        <div className="relative flex flex-col items-center">
          <motion.div
            onClick={handlePetClick}
            animate={
              isBouncing
                ? { y: [-12, 4, -8, 0], scale: [1, 1.25, 1], rotate: [-10, 10, 0] }
                : { y: [0, -6, 0] }
            }
            transition={{ repeat: isBouncing ? 0 : Infinity, duration: 2.2 }}
            className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-400 to-pink-500 p-1 shadow-lg shadow-rose-500/20 cursor-pointer flex items-center justify-center select-none"
          >
            {/* Equipped Outfit Badge */}
            {pet.outfit && pet.outfit !== 'classic' && (
              <span className="absolute -top-3 -right-2 text-2xl filter drop-shadow-md z-10 animate-bounce">
                {pet.outfit === 'samurai' ? '🎩' : pet.outfit === 'kimono' ? '👘' : '🕶️'}
              </span>
            )}

            <div className="w-full h-full rounded-[22px] bg-background flex items-center justify-center text-5xl">
              {pet.type === 'neko' ? '🐱' : '🐕'}
            </div>
          </motion.div>

          <span className="mt-2 text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
            {pet.name} • Cấp {pet.level}
          </span>
        </div>

        {/* Speech Bubble & Stats */}
        <div className="flex-1 w-full space-y-4">
          {/* Speech bubble */}
          <div className="relative p-3.5 rounded-2xl bg-muted/60 border border-border/50 text-sm font-semibold text-foreground">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 hidden sm:block w-3 h-3 bg-muted/60 border-l border-b border-border/50 rotate-45" />
            "{speech}"
          </div>

          {/* Meters */}
          <div className="grid grid-cols-2 gap-3">
            {/* Hunger Bar */}
            <div className="p-2.5 rounded-xl bg-card border border-border/40 space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Utensils className="w-3 h-3 text-orange-500" /> Độ No
                </span>
                <span className="text-orange-500">{pet.hunger}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500"
                  style={{ width: `${pet.hunger}%` }}
                />
              </div>
            </div>

            {/* Happiness Bar */}
            <div className="p-2.5 rounded-xl bg-card border border-border/40 space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" /> Hạnh Phúc
                </span>
                <span className="text-rose-500">{pet.happiness}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                  style={{ width: `${pet.happiness}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-bold text-center text-rose-600 dark:text-rose-400 py-1.5"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action: Feed Pet Button */}
      <div className="pt-2 flex items-center justify-between border-t border-border/40 gap-4">
        <div className="text-xs text-muted-foreground">
          Giá: <strong className="text-amber-500">10 Vàng</strong> / đĩa Sushi 🍣
        </div>

        <button
          onClick={handleFeed}
          disabled={coins < 10}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-xs shadow-md transition-all ${
            coins >= 10
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-90 active:scale-95'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" /> Cho Ăn Sushi (+EXP & No)
        </button>
      </div>
    </div>
  );
}
