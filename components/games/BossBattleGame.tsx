'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Shield, 
  Heart, 
  Zap, 
  Coins, 
  ArrowLeft, 
  Swords, 
  Trophy, 
  HelpCircle,
  Flame
} from 'lucide-react';
import { ALL_880_WORDS, MimikaraWord } from '@/prisma/data/mimikara_n3_880';
import { addExpAndCoins, unlockAchievement } from '@/lib/gamification';
import { 
  playClick, 
  playSlash, 
  playWrong, 
  playVictory, 
  playLevelUp 
} from '@/lib/game-audio';

interface BossBattleGameProps {
  onBack: () => void;
}

interface Boss {
  id: string;
  name: string;
  avatar: string;
  maxHp: number;
  attackPower: number;
  description: string;
  bgGradient: string;
}

const BOSSES: Boss[] = [
  {
    id: 'slime',
    name: 'Slime Ngữ Pháp N3',
    avatar: '👾',
    maxHp: 300,
    attackPower: 20,
    description: 'Quái vật nhớt chuyên tạo ra các bẫy liên từ và trợ từ gây nhầm lẫn.',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
  },
  {
    id: 'dragon',
    name: 'Hắc Long Kanji N3',
    avatar: '🐉',
    maxHp: 500,
    attackPower: 30,
    description: 'Rồng bóng đêm nắm giữ hàng trăm Hán tự hiểm hóc và âm On-Kun phức tạp.',
    bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
  },
  {
    id: 'titan',
    name: 'Chúa Tể Mimikara',
    avatar: '👹',
    maxHp: 750,
    attackPower: 40,
    description: 'Bá chủ tối thượng của 880 từ vựng và câu ví dụ tốc độ cao.',
    bgGradient: 'from-rose-950 via-slate-900 to-amber-950',
  },
];

export function BossBattleGame({ onBack }: BossBattleGameProps) {
  const [selectedBoss, setSelectedBoss] = useState<Boss>(BOSSES[0]);
  const [bossHp, setBossHp] = useState<number>(BOSSES[0].maxHp);
  const [heroHp, setHeroHp] = useState<number>(100);
  const [heroShield, setHeroShield] = useState<boolean>(false);

  // Skill cooldowns
  const [healCd, setHealCd] = useState<number>(0);
  const [eliminateCd, setEliminateCd] = useState<number>(0);
  const [shieldCd, setShieldCd] = useState<number>(0);

  // Current Question
  const [currentWord, setCurrentWord] = useState<MimikaraWord | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [correctOption, setCorrectOption] = useState<string>('');
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  // Combat status
  const [battleLog, setBattleLog] = useState<string>('Trận chiến bắt đầu! Hãy tung đòn chính xác!');
  const [bossAttacking, setBossAttacking] = useState<boolean>(false);
  const [heroAttacking, setHeroAttacking] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<'VICTORY' | 'DEFEAT' | null>(null);

  useEffect(() => {
    startBattle(selectedBoss);
  }, [selectedBoss]);

  const startBattle = (boss: Boss) => {
    setBossHp(boss.maxHp);
    setHeroHp(100);
    setHeroShield(false);
    setHealCd(0);
    setEliminateCd(0);
    setShieldCd(0);
    setGameResult(null);
    setBattleLog(`Đối đầu với ${boss.name}! Hãy đánh bại hắn để nhận kho báu JLPT!`);
    generateQuestion();
  };

  const generateQuestion = () => {
    setIsAnswered(false);
    setHiddenOptions([]);

    const pool = [...ALL_880_WORDS].sort(() => Math.random() - 0.5);
    const target = pool[0];
    const distractors = pool.slice(1, 4).map((w) => w.meaning);

    setCurrentWord(target);
    setCorrectOption(target.meaning);

    const allOpts = [target.meaning, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(allOpts);
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered || gameResult || !currentWord) return;

    setIsAnswered(true);

    if (opt === correctOption) {
      // HERO CRITICAL STRIKE!
      playSlash();
      setHeroAttacking(true);
      const damage = Math.floor(Math.random() * 30) + 110;
      const nextBossHp = Math.max(0, bossHp - damage);
      setBossHp(nextBossHp);
      setBattleLog(`⚡ CHÍ MẠNG! Bạn ra đòn trúng yếu điểm, gây ${damage} sát thương lên ${selectedBoss.name}!`);

      setTimeout(() => setHeroAttacking(false), 500);

      // Reduce cooldowns
      if (healCd > 0) setHealCd(healCd - 1);
      if (eliminateCd > 0) setEliminateCd(eliminateCd - 1);
      if (shieldCd > 0) setShieldCd(shieldCd - 1);

      if (nextBossHp <= 0) {
        setTimeout(() => handleVictory(), 600);
      } else {
        setTimeout(() => generateQuestion(), 1400);
      }
    } else {
      // HERO MISSES, BOSS COUNTERATTACKS!
      playWrong();
      setBossAttacking(true);
      setBattleLog(`❌ Sai rồi! Đáp án đúng là: "${correctOption}". ${selectedBoss.name} nổi cơn thịnh nộ phản công!`);

      setTimeout(() => {
        setBossAttacking(false);

        if (heroShield) {
          setHeroShield(false);
          setBattleLog(`🛡️ Khiên Thần đã đỡ toàn bộ sát thương từ ${selectedBoss.name}!`);
        } else {
          const damage = selectedBoss.attackPower;
          const nextHeroHp = Math.max(0, heroHp - damage);
          setHeroHp(nextHeroHp);

          if (nextHeroHp <= 0) {
            handleDefeat();
            return;
          }
        }

        setTimeout(() => generateQuestion(), 1200);
      }, 700);
    }
  };

  // Skill 1: Heal
  const handleUseHeal = () => {
    if (healCd > 0 || isAnswered || gameResult) return;
    playClick();
    const healed = Math.min(100, heroHp + 35);
    setHeroHp(healed);
    setHealCd(3);
    setBattleLog('💖 Bạn vừa hồi phục 35 HP!');
  };

  // Skill 2: 50/50 Eliminate
  const handleUse5050 = () => {
    if (eliminateCd > 0 || isAnswered || gameResult) return;
    playClick();
    const wrongOpts = options.filter((o) => o !== correctOption);
    const toHide = wrongOpts.slice(0, 2);
    setHiddenOptions(toHide);
    setEliminateCd(4);
    setBattleLog('🎯 Kính Thần 50/50 đã loại bỏ 2 đáp án sai!');
  };

  // Skill 3: Shield
  const handleUseShield = () => {
    if (shieldCd > 0 || isAnswered || gameResult) return;
    playClick();
    setHeroShield(true);
    setShieldCd(3);
    setBattleLog('🛡️ Khiên Thần kích hoạt! Bạn sẽ miễn nhiễm đòn đánh kế tiếp!');
  };

  const handleVictory = () => {
    setGameResult('VICTORY');
    playVictory();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    const expReward = selectedBoss.id === 'slime' ? 100 : selectedBoss.id === 'dragon' ? 180 : 260;
    const coinReward = selectedBoss.id === 'slime' ? 70 : selectedBoss.id === 'dragon' ? 120 : 180;

    const { leveledUp } = addExpAndCoins(expReward, coinReward);
    if (leveledUp) {
      setTimeout(() => playLevelUp(), 1000);
    }

    if (selectedBoss.id === 'dragon' || selectedBoss.id === 'titan') {
      unlockAchievement('boss_slayer');
    }
  };

  const handleDefeat = () => {
    setGameResult('DEFEAT');
    playWrong();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border/50 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Arcade Hub
        </button>

        {/* Boss Switcher */}
        <div className="flex items-center gap-2">
          {BOSSES.map((boss) => (
            <button
              key={boss.id}
              onClick={() => setSelectedBoss(boss)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedBoss.id === boss.id
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {boss.avatar} {boss.name.split(' ')[0]}
            </button>
          ))}
        </div>

        <button
          onClick={() => startBattle(selectedBoss)}
          className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Đấu lại từ đầu"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Battle Arena Stage */}
      <div className={`relative rounded-3xl bg-gradient-to-b ${selectedBoss.bgGradient} border-2 border-border/80 p-6 sm:p-8 overflow-hidden shadow-2xl space-y-6`}>
        {/* Arena Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        {/* Top: Boss Bar & Hero HP Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          {/* Hero Stats */}
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-border/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-white flex items-center gap-1.5">
                🥋 Dũng Sĩ N3 {heroShield && <Shield className="w-3.5 h-3.5 text-cyan-400 inline animate-pulse" />}
              </span>
              <span className="text-emerald-400 font-bold">{heroHp}/100 HP</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${heroHp}%` }}
              />
            </div>
          </div>

          {/* Boss Stats */}
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-border/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-rose-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> {selectedBoss.name}
              </span>
              <span className="text-rose-400 font-bold">{bossHp}/{selectedBoss.maxHp} HP</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 transition-all duration-300"
                style={{ width: `${(bossHp / selectedBoss.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Middle: Boss Animated Avatar */}
        <div className="flex flex-col items-center justify-center py-4 relative z-10">
          <motion.div
            animate={
              bossAttacking
                ? { x: [-30, 30, -20, 20, 0], scale: [1, 1.3, 1] }
                : heroAttacking
                  ? { y: [-15, 10, -10, 0], opacity: [1, 0.4, 1] }
                  : { y: [0, -8, 0] }
            }
            transition={{ repeat: bossAttacking || heroAttacking ? 0 : Infinity, duration: 2.5 }}
            className="text-7xl sm:text-8xl select-none filter drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]"
          >
            {selectedBoss.avatar}
          </motion.div>

          <p className="mt-2 text-xs text-slate-300 max-w-sm text-center font-medium">
            {selectedBoss.description}
          </p>
        </div>

        {/* Battle Log Bar */}
        <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-center text-xs sm:text-sm font-semibold text-amber-300">
          {battleLog}
        </div>

        {/* Question & Combat Options */}
        {currentWord && !gameResult && (
          <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-3xl border border-white/15 space-y-4 relative z-10">
            <div className="text-center space-y-1">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                Đòn Tấn Công • Chọn Nghĩa Đúng Của Từ:
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {currentWord.word}{' '}
                <span className="text-base text-rose-300 font-semibold">[{currentWord.reading}]</span>
              </div>
              {currentWord.hanViet && (
                <div className="text-xs text-amber-300 font-bold">Hán Việt: {currentWord.hanViet}</div>
              )}
            </div>

            {/* Multiple Choice Attack Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt, idx) => {
                const isHidden = hiddenOptions.includes(opt);
                return (
                  <button
                    key={idx}
                    disabled={isAnswered || isHidden}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-3.5 rounded-2xl text-left font-bold text-xs sm:text-sm transition-all border ${
                      isHidden
                        ? 'opacity-20 pointer-events-none'
                        : isAnswered && opt === correctOption
                          ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-rose-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="inline-block w-5 h-5 rounded-full bg-slate-700 text-center leading-5 text-[10px] text-slate-300 font-black mr-2">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Hero Battle Skills */}
            <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/10 flex-wrap">
              <button
                onClick={handleUseHeal}
                disabled={healCd > 0 || isAnswered}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  healCd === 0
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Heart className="w-3.5 h-3.5" /> Hồi Máu {healCd > 0 ? `(${healCd})` : ''}
              </button>

              <button
                onClick={handleUse5050}
                disabled={eliminateCd > 0 || isAnswered}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  eliminateCd === 0
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> Loại 2 Sai {eliminateCd > 0 ? `(${eliminateCd})` : ''}
              </button>

              <button
                onClick={handleUseShield}
                disabled={shieldCd > 0 || isAnswered}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  shieldCd === 0
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Khiên Chắn {shieldCd > 0 ? `(${shieldCd})` : ''}
              </button>
            </div>
          </div>
        )}

        {/* Victory / Defeat Modal Overlays */}
        <AnimatePresence>
          {gameResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-amber-500/60 text-center space-y-4 relative z-20"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg">
                {gameResult === 'VICTORY' ? <Trophy className="w-9 h-9" /> : <Swords className="w-9 h-9" />}
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">
                  {gameResult === 'VICTORY' ? '🎉 Chiếm Lĩnh Hầm Ngục Thành Công!' : '⚔️ Bạn Đã Bị Đánh Bại!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {gameResult === 'VICTORY'
                    ? `Bạn đã tiêu diệt hoàn toàn ${selectedBoss.name} và bảo vệ bình yên cho Đấu Trường N3!`
                    : `Hãy nâng cao vốn từ vựng và quay lại phục thù ${selectedBoss.name}!`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onBack}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors"
                >
                  Arcade Hub
                </button>
                <button
                  onClick={() => startBattle(selectedBoss)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-500/30 hover:opacity-90 transition-opacity"
                >
                  Chiến Tiếp Lần Nữa ⚔️
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
