'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Gamepad2, 
  Sparkles, 
  Swords, 
  Zap, 
  Layers, 
  Trophy, 
  Award, 
  Flame, 
  Coins, 
  Volume2, 
  VolumeX, 
  Crown,
  Play,
  Puzzle,
  BookOpen,
  ShoppingBag,
  Mic,
  Brush,
  Users
} from 'lucide-react';
import { 
  getGamificationProfile, 
  calculateLevel, 
  INITIAL_ACHIEVEMENTS, 
  GamificationProfile 
} from '@/lib/gamification';
import { isSoundEnabled, setSoundEnabled, playClick } from '@/lib/game-audio';
import { MascotWidget } from '@/components/games/MascotWidget';
import { OmikujiModal } from '@/components/games/OmikujiModal';
import { GameGuideModal } from '@/components/games/GameGuideModal';
import { PetShopModal } from '@/components/games/PetShopModal';
import { SpeedMatchGame } from '@/components/games/SpeedMatchGame';
import { SamuraiSlashGame } from '@/components/games/SamuraiSlashGame';
import { BossBattleGame } from '@/components/games/BossBattleGame';
import { SentenceScrambleGame } from '@/components/games/SentenceScrambleGame';
import { ShadowingStudio } from '@/components/games/ShadowingStudio';
import { PvpArenaGame } from '@/components/games/PvpArenaGame';
import { KanjiCanvasGame } from '@/components/games/KanjiCanvasGame';
import { StoryModeGame } from '@/components/games/StoryModeGame';

type ActiveGameMode = 
  | 'NONE' 
  | 'SPEED_MATCH' 
  | 'SAMURAI_SLASH' 
  | 'BOSS_BATTLE' 
  | 'SENTENCE_SCRAMBLE'
  | 'SHADOWING'
  | 'PVP_ARENA'
  | 'KANJI_CANVAS'
  | 'STORY_MODE';

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<ActiveGameMode>('NONE');
  const [showOmikuji, setShowOmikuji] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    loadProfile();
    setSoundOn(isSoundEnabled());

    const handleUpdate = () => {
      loadProfile();
    };

    window.addEventListener('gamification_update', handleUpdate);
    return () => window.removeEventListener('gamification_update', handleUpdate);
  }, []);

  const loadProfile = () => {
    const p = getGamificationProfile();
    setProfile(p);
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClick();
  };

  const levelInfo = profile ? calculateLevel(profile.exp) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Omikuji Modal */}
      <OmikujiModal isOpen={showOmikuji} onClose={() => setShowOmikuji(false)} />

      {/* Game & Pet Guide Modal */}
      <GameGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />

      {/* Pet Fashion & Buff Shop Modal */}
      <PetShopModal isOpen={showShop} onClose={() => setShowShop(false)} />

      {/* Main Game Screen or Hub */}
      {activeGame !== 'NONE' ? (
        <div>
          {activeGame === 'SPEED_MATCH' && <SpeedMatchGame onBack={() => setActiveGame('NONE')} />}
          {activeGame === 'SAMURAI_SLASH' && <SamuraiSlashGame onBack={() => setActiveGame('NONE')} />}
          {activeGame === 'BOSS_BATTLE' && <BossBattleGame onBack={() => setActiveGame('NONE')} />}
          {activeGame === 'SENTENCE_SCRAMBLE' && <SentenceScrambleGame onBack={() => setActiveGame('NONE')} />}
          {activeGame === 'SHADOWING' && <ShadowingStudio onBack={() => setActiveGame('NONE')} />}
          {activeGame === 'PVP_ARENA' && <PvpArenaGame onBack={() => setActiveGame('NONE')} />}
          {activeGame === 'KANJI_CANVAS' && <KanjiCanvasGame onBack={() => setActiveGame('NONE')} />}
          {activeGame === 'STORY_MODE' && <StoryModeGame onBack={() => setActiveGame('NONE')} />}
        </div>
      ) : (
        /* Arcade Hub Home */
        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-white shadow-xl shadow-rose-500/20">
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-md">
                  <Gamepad2 className="w-3.5 h-3.5" /> N3 Arcade & Gamification Universe
                </div>
                <h1 className="text-2xl sm:text-4xl font-black">
                  Võ Đài Luyện N3 & Minigames 🎮
                </h1>
                <p className="mt-2 text-white/90 text-sm sm:text-base max-w-xl font-medium">
                  Vừa chơi vừa ghi nhớ sâu từ vựng, kanji, ngữ pháp và phát âm N3. Tích lũy EXP, săn vàng và thăng hạng kiếm sĩ!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <button
                  onClick={() => setShowShop(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 fill-slate-950" /> Pet Shop 🏪
                </button>

                <button
                  onClick={() => setShowOmikuji(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-500/30 hover:bg-rose-400 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 fill-white" /> Rút Quẻ 🥠
                </button>

                <button
                  onClick={() => setShowGuide(true)}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all active:scale-95 border border-white/20"
                  title="Cẩm nang hướng dẫn"
                >
                  <BookOpen className="w-4 h-4" /> Hướng Dẫn
                </button>

                <button
                  onClick={handleToggleSound}
                  className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                  title={soundOn ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
                >
                  {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-rose-200" />}
                </button>
              </div>
            </div>
          </div>

          {/* Player Level & Companion Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Player Level & EXP Card */}
            {levelInfo && profile && (
              <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border/60 shadow-lg space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-rose-500/20">
                      Lv.{levelInfo.level}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-foreground">{levelInfo.title}</h3>
                      <div className="text-xs text-muted-foreground font-medium">
                        Tổng điểm kinh nghiệm: <strong>{profile.exp} EXP</strong>
                      </div>
                    </div>
                  </div>

                  {/* Coin & Streak pill */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black">
                      <Coins className="w-4 h-4 fill-amber-500" />
                      <span>{profile.coins} Vàng</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black">
                      <Flame className="w-4 h-4 fill-rose-500" />
                      <span>{profile.streak} Ngày</span>
                    </div>
                  </div>
                </div>

                {/* EXP Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground">
                    <span>Tiến độ thăng cấp</span>
                    <span>{levelInfo.progressPercent}% ({profile.exp} / {levelInfo.nextExp} EXP)</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${levelInfo.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mascot Widget */}
            <MascotWidget />
          </div>

          {/* Games Selection Grid: All 8 Modes */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-rose-500" /> Trọn Bộ 8 Chế Độ Trò Chơi N3
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Các chế độ học tập đa giác quan: Phản xạ kiếm thuật, Đấu boss RPG, Luyện nói AI, Thư pháp & Cốt truyện.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Samurai Slasher */}
              <motion.div
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-lg p-5 flex flex-col justify-between group cursor-pointer hover:border-amber-500/50 transition-all"
                onClick={() => setActiveGame('SAMURAI_SLASH')}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                      <Swords className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                      ⚔️ Phản Xạ
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground group-hover:text-amber-500 transition-colors">
                      Samurai Slasher
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Chém từ vựng rơi thần tốc, tạo chuỗi combo x5 x10 với hiệu ứng vệt kiếm và rung chấn!
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-border/40 mt-3">
                  <span className="text-[11px] font-semibold text-amber-500">+120 EXP</span>
                  <button className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">Chơi</button>
                </div>
              </motion.div>

              {/* 2. Speed Match */}
              <motion.div
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-lg p-5 flex flex-col justify-between group cursor-pointer hover:border-rose-500/50 transition-all"
                onClick={() => setActiveGame('SPEED_MATCH')}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-bold">
                      ⚡ Trí Nhớ 3D
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground group-hover:text-rose-500 transition-colors">
                      Ghép Thẻ Thần Tốc
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Lật bài tìm cặp trùng khớp giữa Kanji và Nghĩa tiếng Việt dưới 45 giây để đạt 3 sao.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-border/40 mt-3">
                  <span className="text-[11px] font-semibold text-rose-500">+80 EXP</span>
                  <button className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs">Chơi</button>
                </div>
              </motion.div>

              {/* 3. Boss Battle */}
              <motion.div
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-lg p-5 flex flex-col justify-between group cursor-pointer hover:border-purple-500/50 transition-all"
                onClick={() => setActiveGame('BOSS_BATTLE')}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                      <Crown className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-bold">
                      🐉 Đấu Trùm RPG
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground group-hover:text-purple-500 transition-colors">
                      JLPT Boss Dungeon
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Đấu theo lượt với Quái vật Ngữ pháp & Hắc Long Kanji, dùng kỹ năng Hồi Máu & Khiên Chắn.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-border/40 mt-3">
                  <span className="text-[11px] font-semibold text-purple-500">+200 EXP</span>
                  <button className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs">Khiêu Chiến</button>
                </div>
              </motion.div>

              {/* 4. Sentence Scramble */}
              <motion.div
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-lg p-5 flex flex-col justify-between group cursor-pointer hover:border-indigo-500/50 transition-all"
                onClick={() => setActiveGame('SENTENCE_SCRAMBLE')}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                      <Puzzle className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 text-[10px] font-bold">
                      🧩 Ngữ Pháp
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground group-hover:text-indigo-500 transition-colors">
                      Xếp Câu N3 Thần Tốc
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Lắp ghép các mảnh từ vựng thành câu hoàn chỉnh chuẩn văn phong Nhật Bản.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-border/40 mt-3">
                  <span className="text-[11px] font-semibold text-indigo-500">+100 EXP</span>
                  <button className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">Xếp Câu</button>
                </div>
              </motion.div>

              {/* 5. AI Voice Shadowing */}
              <motion.div
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-lg p-5 flex flex-col justify-between group cursor-pointer hover:border-rose-500/50 transition-all"
                onClick={() => setActiveGame('SHADOWING')}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                      <Mic className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-bold">
                      🎤 AI Voice
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground group-hover:text-rose-500 transition-colors">
                      AI Voice Shadowing Studio
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Luyện đọc đuổi theo giọng bản xứ Tokyo và nhận chấm điểm phát âm thời gian thực.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-border/40 mt-3">
                  <span className="text-[11px] font-semibold text-rose-500">+90 EXP</span>
                  <button className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs">Luyện Nói</button>
                </div>
              </motion.div>

              {/* 6. 1v1 PvP Duel */}
              <motion.div
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-lg p-5 flex flex-col justify-between group cursor-pointer hover:border-amber-500/50 transition-all"
                onClick={() => setActiveGame('PVP_ARENA')}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                      ⚔️ Đấu Trường 1v1
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground group-hover:text-amber-500 transition-colors">
                      PvP / AI Duel Arena
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Chạy đua giải 5 câu N3 siêu tốc với đối thủ AI Yuki Sensei & Master Ryu.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-border/40 mt-3">
                  <span className="text-[11px] font-semibold text-amber-500">+150 EXP</span>
                  <button className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">So Tài</button>
                </div>
              </motion.div>

              {/* 7. Kanji Shodo Canvas */}
              <motion.div
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-lg p-5 flex flex-col justify-between group cursor-pointer hover:border-emerald-500/50 transition-all"
                onClick={() => setActiveGame('KANJI_CANVAS')}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                      <Brush className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                      ✍️ Thư Pháp Shodo
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground group-hover:text-emerald-500 transition-colors">
                      Bảng Tập Viết Kanji
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Tập viết nét chữ Hán bằng chuột/cảm ứng với hiệu ứng mực thư pháp và hướng dẫn nét.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-border/40 mt-3">
                  <span className="text-[11px] font-semibold text-emerald-500">+50 EXP</span>
                  <button className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">Tập Viết</button>
                </div>
              </motion.div>

              {/* 8. Visual Novel Story Mode */}
              <motion.div
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-lg p-5 flex flex-col justify-between group cursor-pointer hover:border-purple-500/50 transition-all"
                onClick={() => setActiveGame('STORY_MODE')}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-bold">
                      📖 Cốt Truyện
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground group-hover:text-purple-500 transition-colors">
                      Visual Novel N3 Story
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Nhập vai du học sinh khám phá Shibuya & phỏng vấn xin việc baito, sưu tầm bưu thiếp!
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-border/40 mt-3">
                  <span className="text-[11px] font-semibold text-purple-500">+100 EXP</span>
                  <button className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs">Khám Phá</button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Badges & Achievements Showcase */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Bảng Huy Hiệu & Danh Hiệu
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mở khóa các cột mốc vinh quang trong quá trình rèn luyện N3.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {INITIAL_ACHIEVEMENTS.map((badge) => {
                const isUnlocked = profile?.unlockedBadges.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-2xl border text-center space-y-2 transition-all ${
                      isUnlocked
                        ? 'bg-amber-500/10 border-amber-500/30 text-foreground shadow-sm'
                        : 'bg-muted/30 border-border/40 opacity-50 grayscale'
                    }`}
                  >
                    <div className="text-3xl select-none">{badge.icon}</div>
                    <div>
                      <div className="font-black text-xs truncate">{badge.title}</div>
                      <div className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-tight">
                        {badge.description}
                      </div>
                    </div>
                    {isUnlocked && (
                      <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300">
                        Đã Nhận
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
