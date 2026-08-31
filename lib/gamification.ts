// Quản lý hệ thống Gamification: EXP, Level, Coins, Thú Cưng (Pet Mascot), Omikuji & Thành Tựu

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rewardCoins: number;
  rewardExp: number;
}

export type PetOutfitId = 'classic' | 'samurai' | 'kimono' | 'ninja';

export interface ShopItem {
  id: PetOutfitId | 'bento';
  name: string;
  icon: string;
  cost: number;
  description: string;
  buffText: string;
  type: 'OUTFIT' | 'CONSUMABLE';
}

export const PET_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'samurai',
    name: 'Nón Samurai Huyền Thoại',
    icon: '🎩',
    cost: 100,
    description: 'Nón giáp Samurai truyền thống của các võ sĩ vùng Edo.',
    buffText: '⚡ Tăng +5% EXP nhận được vĩnh viễn',
    type: 'OUTFIT',
  },
  {
    id: 'kimono',
    name: 'Áo Kimono Hoa Anh Đào',
    icon: '👘',
    cost: 150,
    description: 'Trang phục Kimono dệt từ lụa hoa anh đào Kyoto.',
    buffText: '💰 Tăng +10% Vàng thưởng từ mọi minigame',
    type: 'OUTFIT',
  },
  {
    id: 'ninja',
    name: 'Kính Mát Thám Tử Ninja',
    icon: '🕶️',
    cost: 120,
    description: 'Cặp kính nhìn thấu bẫy ngữ pháp của thám tử Nhật.',
    buffText: '⏱️ Tặng thêm +5 giây thời gian trong minigame',
    type: 'OUTFIT',
  },
  {
    id: 'bento',
    name: 'Hộp Cơm Bento Thượng Hạng',
    icon: '🍱',
    cost: 30,
    description: 'Cơm cuộn trứng tamagoyaki, cá hồi và thịt nướng teriyaki.',
    buffText: '💖 Hồi phục 100% Độ No & Hạnh Phúc ngay lập tức',
    type: 'CONSUMABLE',
  },
];

export interface PetState {
  type: 'neko' | 'shiba';
  name: string;
  level: number;
  exp: number;
  hunger: number; // 0 - 100
  happiness: number; // 0 - 100
  lastFed: number;
  outfit: PetOutfitId;
  unlockedOutfits: string[];
}

export interface OmikujiResult {
  date: string;
  grade: 'DAI_KICHI' | 'CHU_KICHI' | 'SHO_KICHI' | 'KICHI';
  japaneseName: string;
  vietnameseTitle: string;
  message: string;
  studyAdvice: string;
  luckyWord: {
    word: string;
    reading: string;
    meaning: string;
    hanViet?: string;
    example: string;
  };
  rewardCoins: number;
  rewardExp: number;
}

export interface GamificationProfile {
  exp: number;
  level: number;
  coins: number;
  streak: number;
  lastStudyDate: string;
  pet: PetState;
  omikujiHistory: { [dateStr: string]: OmikujiResult };
  unlockedBadges: string[];
  stats: {
    cardsReviewed: number;
    gamesPlayed: number;
    bossesDefeated: number;
    perfectMatches: number;
    maxCombo: number;
  };
}

export const RANKS = [
  { level: 1, minExp: 0, title: '🥋 Nhập Môn N3', color: 'from-slate-500 to-gray-600' },
  { level: 2, minExp: 100, title: '🗡️ Samurai Tập Sự', color: 'from-blue-500 to-cyan-600' },
  { level: 3, minExp: 250, title: '⚔️ Kiếm Sĩ N3', color: 'from-emerald-500 to-teal-600' },
  { level: 4, minExp: 500, title: '⚡ Bậc Thầy Từ Vựng', color: 'from-amber-500 to-yellow-600' },
  { level: 5, minExp: 900, title: '🔥 Võ Thần Mimikara', color: 'from-orange-500 to-rose-600' },
  { level: 6, minExp: 1400, title: '👑 Đại Sư JLPT N3', color: 'from-purple-500 to-pink-600' },
  { level: 7, minExp: 2000, title: '🌟 Huyền Thoại N3', color: 'from-rose-500 via-purple-600 to-amber-400' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_card',
    title: 'Bước Chân Đầu Tiên',
    description: 'Ôn tập thẻ từ vựng đầu tiên trong chế độ SRS',
    icon: '🎴',
    rewardCoins: 20,
    rewardExp: 30,
  },
  {
    id: 'streak_3',
    title: 'Ngọn Lửa Kiên Trì',
    description: 'Duy trì chuỗi học tập 3 ngày liên tiếp',
    icon: '🔥',
    rewardCoins: 50,
    rewardExp: 100,
  },
  {
    id: 'match_master',
    title: 'Mắt Thần Siêu Tốc',
    description: 'Hoàn thành Ghép Thẻ Thần Tốc với 3 Sao',
    icon: '⚡',
    rewardCoins: 60,
    rewardExp: 80,
  },
  {
    id: 'samurai_combo',
    title: 'Kiếm Thuật Thần Sầu',
    description: 'Đạt chuỗi Combo x10 trong Samurai Slasher',
    icon: '⚔️',
    rewardCoins: 80,
    rewardExp: 120,
  },
  {
    id: 'boss_slayer',
    title: 'Dũng Sĩ Diệt Trùm',
    description: 'Hạ gục Hắc Long Kanji trong JLPT Dungeon',
    icon: '🐉',
    rewardCoins: 100,
    rewardExp: 200,
  },
  {
    id: 'omikuji_fortune',
    title: 'Được Thần Linh Phù Hộ',
    description: 'Rút trúng quẻ Đại Cát (大吉) trong đền Omikuji',
    icon: '🥠',
    rewardCoins: 50,
    rewardExp: 50,
  },
  {
    id: 'pet_bestie',
    title: 'Bạn Thân Của Pet',
    description: 'Nuôi Thú Cưng đạt cấp 3',
    icon: '🐾',
    rewardCoins: 40,
    rewardExp: 60,
  },
];

const DEFAULT_PROFILE: GamificationProfile = {
  exp: 60,
  level: 1,
  coins: 150,
  streak: 7,
  lastStudyDate: new Date().toISOString().split('T')[0],
  pet: {
    type: 'neko',
    name: 'Neko-chan',
    level: 1,
    exp: 20,
    hunger: 80,
    happiness: 85,
    lastFed: Date.now(),
    outfit: 'classic',
    unlockedOutfits: ['classic'],
  },
  omikujiHistory: {},
  unlockedBadges: ['first_card'],
  stats: {
    cardsReviewed: 15,
    gamesPlayed: 0,
    bossesDefeated: 0,
    perfectMatches: 0,
    maxCombo: 0,
  },
};

export function getActiveUserStorageKey(customEmail?: string | null): string {
  if (typeof window === 'undefined') return 'n3_master_gamification_profile';
  
  const email = customEmail || localStorage.getItem('n3_active_auth_email');
  if (email && email.trim().length > 0) {
    const clean = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `n3_user_profile_${clean}`;
  }
  return 'n3_master_gamification_profile_guest';
}

export function setActiveUserEmail(email: string | null) {
  if (typeof window === 'undefined') return;
  if (email) {
    localStorage.setItem('n3_active_auth_email', email);
  } else {
    localStorage.removeItem('n3_active_auth_email');
  }
  window.dispatchEvent(new CustomEvent('gamification_update'));
}

export function getGamificationProfile(userEmail?: string | null): GamificationProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const key = getActiveUserStorageKey(userEmail);
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed, pet: { ...DEFAULT_PROFILE.pet, ...(parsed.pet || {}) } };
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

export function saveGamificationProfile(profile: GamificationProfile, userEmail?: string | null) {
  if (typeof window === 'undefined') return;
  try {
    const key = getActiveUserStorageKey(userEmail);
    localStorage.setItem(key, JSON.stringify(profile));
    // Dispatch custom event for cross-component reactivity
    window.dispatchEvent(new CustomEvent('gamification_update', { detail: profile }));
  } catch (e) {
    console.error('Error saving gamification profile:', e);
  }
}


export function calculateLevel(exp: number): { level: number; title: string; minExp: number; nextExp: number; progressPercent: number; color: string } {
  let currentRank = RANKS[0];
  let nextRank = RANKS[1];

  for (let i = 0; i < RANKS.length; i++) {
    if (exp >= RANKS[i].minExp) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || { level: RANKS[i].level + 1, minExp: RANKS[i].minExp + 1000, title: '👑 Siêu Cấp N3', color: 'from-amber-400 to-rose-600' };
    }
  }

  const range = nextRank.minExp - currentRank.minExp;
  const currentInRank = exp - currentRank.minExp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInRank / range) * 100)));

  return {
    level: currentRank.level,
    title: currentRank.title,
    minExp: currentRank.minExp,
    nextExp: nextRank.minExp,
    progressPercent,
    color: currentRank.color,
  };
}

export function addExpAndCoins(expGain: number, coinGain: number): { newProfile: GamificationProfile; leveledUp: boolean; newLevel: number } {
  const profile = getGamificationProfile();
  const oldLevelInfo = calculateLevel(profile.exp);
  const newExp = profile.exp + expGain;
  const newCoins = profile.coins + coinGain;
  const newLevelInfo = calculateLevel(newExp);

  const leveledUp = newLevelInfo.level > oldLevelInfo.level;

  const updated: GamificationProfile = {
    ...profile,
    exp: newExp,
    coins: newCoins,
    level: newLevelInfo.level,
  };

  saveGamificationProfile(updated);
  return { newProfile: updated, leveledUp, newLevel: newLevelInfo.level };
}

export function unlockAchievement(achievementId: string): boolean {
  const profile = getGamificationProfile();
  if (profile.unlockedBadges.includes(achievementId)) return false;

  const achievement = INITIAL_ACHIEVEMENTS.find((a) => a.id === achievementId);
  if (!achievement) return false;

  const updatedBadges = [...profile.unlockedBadges, achievementId];
  const newExp = profile.exp + achievement.rewardExp;
  const newCoins = profile.coins + achievement.rewardCoins;
  const newLevelInfo = calculateLevel(newExp);

  const updated: GamificationProfile = {
    ...profile,
    unlockedBadges: updatedBadges,
    exp: newExp,
    coins: newCoins,
    level: newLevelInfo.level,
  };

  saveGamificationProfile(updated);
  return true;
}

export function feedPet(): { success: boolean; message: string; profile: GamificationProfile } {
  const profile = getGamificationProfile();
  const COST = 10;
  if (profile.coins < COST) {
    return { success: false, message: 'Bạn không đủ Vàng (Cần 10 Vàng để mua đồ ăn Sushi)!', profile };
  }

  const hunger = Math.min(100, profile.pet.hunger + 25);
  const happiness = Math.min(100, profile.pet.happiness + 20);
  const petExp = profile.pet.exp + 20;
  let petLevel = profile.pet.level;
  if (petExp >= petLevel * 50) {
    petLevel += 1;
  }

  const updatedPet: PetState = {
    ...profile.pet,
    hunger,
    happiness,
    exp: petExp,
    level: petLevel,
    lastFed: Date.now(),
  };

  const updatedProfile: GamificationProfile = {
    ...profile,
    coins: profile.coins - COST,
    exp: profile.exp + 10,
    pet: updatedPet,
  };

  if (petLevel >= 3) {
    unlockAchievement('pet_bestie');
  }

  saveGamificationProfile(updatedProfile);
  return { success: true, message: `🍣 ${updatedPet.name} đã được ăn no nê! +25 No, +20 Hạnh Phúc!`, profile: updatedProfile };
}

export function purchaseShopItem(item: ShopItem): { success: boolean; message: string; profile: GamificationProfile } {
  const profile = getGamificationProfile();

  if (profile.coins < item.cost) {
    return { success: false, message: `Bạn cần ${item.cost} Vàng để mua vật phẩm này!`, profile };
  }

  if (item.type === 'CONSUMABLE') {
    // Bento: Max out hunger & happiness
    const updatedPet: PetState = {
      ...profile.pet,
      hunger: 100,
      happiness: 100,
      exp: profile.pet.exp + 50,
      lastFed: Date.now(),
    };
    const updatedProfile: GamificationProfile = {
      ...profile,
      coins: profile.coins - item.cost,
      exp: profile.exp + 30,
      pet: updatedPet,
    };
    saveGamificationProfile(updatedProfile);
    return { success: true, message: `🍱 Đã thưởng thức Bento thượng hạng! Chỉ số No & Hạnh phúc đạt 100%!`, profile: updatedProfile };
  } else {
    // Outfit purchase
    if (profile.pet.unlockedOutfits.includes(item.id)) {
      return { success: false, message: 'Bạn đã sở hữu trang phục này rồi!', profile };
    }

    const updatedOutfits = [...profile.pet.unlockedOutfits, item.id];
    const updatedPet: PetState = {
      ...profile.pet,
      unlockedOutfits: updatedOutfits,
      outfit: item.id as PetOutfitId,
    };

    const updatedProfile: GamificationProfile = {
      ...profile,
      coins: profile.coins - item.cost,
      exp: profile.exp + 50,
      pet: updatedPet,
    };

    saveGamificationProfile(updatedProfile);
    return { success: true, message: `✨ Đã mua thành công ${item.name} và tự động trang bị cho ${updatedPet.name}!`, profile: updatedProfile };
  }
}

export function equipPetOutfit(outfitId: PetOutfitId): { success: boolean; message: string; profile: GamificationProfile } {
  const profile = getGamificationProfile();
  if (!profile.pet.unlockedOutfits.includes(outfitId) && outfitId !== 'classic') {
    return { success: false, message: 'Bạn chưa mở khóa trang phục này!', profile };
  }

  const updatedPet: PetState = {
    ...profile.pet,
    outfit: outfitId,
  };

  const updatedProfile: GamificationProfile = {
    ...profile,
    pet: updatedPet,
  };

  saveGamificationProfile(updatedProfile);
  return { success: true, message: `Đã thay trang phục mới cho ${updatedPet.name}!`, profile: updatedProfile };
}

