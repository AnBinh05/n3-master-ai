'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  X, 
  Sparkles, 
  Heart, 
  Utensils, 
  Coins, 
  Zap, 
  Swords, 
  Trophy, 
  HelpCircle,
  Gamepad2,
  Smile,
  Shield,
  Volume2
} from 'lucide-react';
import { playClick } from '@/lib/game-audio';

interface GameGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'PET' | 'GAMES' | 'OMIKUJI' | 'RANKS';
}

export function GameGuideModal({ isOpen, onClose, defaultTab = 'PET' }: GameGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'PET' | 'GAMES' | 'OMIKUJI' | 'RANKS'>(defaultTab);

  if (!isOpen) return null;

  const handleTabChange = (tab: 'PET' | 'GAMES' | 'OMIKUJI' | 'RANKS') => {
    playClick();
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-card border border-border/60 shadow-2xl p-6 sm:p-8 overflow-hidden flex flex-col">
        {/* Background Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground">
                Cẩm Nang Chơi Game & Nuôi Pet N3 🐾
              </h2>
              <p className="text-xs text-muted-foreground">
                Hướng dẫn chi tiết từng bước để đạt điểm cao và chăm sóc linh thú
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-2xl my-4 shrink-0 overflow-x-auto">
          <button
            onClick={() => handleTabChange('PET')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'PET'
                ? 'bg-card text-rose-500 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🐱 Nuôi Thú Cưng
          </button>

          <button
            onClick={() => handleTabChange('GAMES')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'GAMES'
                ? 'bg-card text-amber-500 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🎮 4 Chế Độ Chơi
          </button>

          <button
            onClick={() => handleTabChange('OMIKUJI')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'OMIKUJI'
                ? 'bg-card text-purple-500 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🥠 Quẻ May Mắn
          </button>

          <button
            onClick={() => handleTabChange('RANKS')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'RANKS'
                ? 'bg-card text-indigo-500 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            👑 Cấp Bậc & Vàng
          </button>
        </div>

        {/* Tab Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm">
          <AnimatePresence mode="wait">
            {/* 1. PET GUIDE */}
            {activeTab === 'PET' && (
              <motion.div
                key="pet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <div className="font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <Heart className="w-4 h-4" /> Linh Thú Đồng Hành là gì?
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Linh thú là người bạn ảo đồng hành suốt hành trình chinh phục JLPT N3. Bạn có thể chọn nuôi <strong>Mèo Thần Tài (Neko-chan)</strong> mang lại may mắn hoặc <strong>Cún Dũng Sĩ (Shiba-kun)</strong> kiên cường!
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-border/50">
                    <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 font-bold shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">1. Cách Cho Thú Cưng Ăn Sushi</div>
                      <p className="text-muted-foreground mt-0.5">
                        Mỗi đĩa Sushi có giá <strong>10 Vàng</strong>. Khi cho ăn, thú cưng sẽ được <strong>+25% Độ No</strong>, <strong>+20% Hạnh Phúc</strong> và tích lũy EXP để lên cấp.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-border/50">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold shrink-0">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">2. Cách Kiếm Vàng Mua Đồ Ăn</div>
                      <p className="text-muted-foreground mt-0.5">
                        • Ôn tập thẻ flashcard SRS: +2 đến +8 Vàng/thẻ.<br />
                        • Thắng minigame: +30 đến +150 Vàng/trận.<br />
                        • Rút quẻ Omikuji hằng ngày: +50 đến +150 Vàng miễn phí!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-border/50">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 font-bold shrink-0">
                      <Smile className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">3. Tương Tác Chạm (Touch Interaction)</div>
                      <p className="text-muted-foreground mt-0.5">
                        Bấm trực tiếp vào bé cưng trên màn hình để nghe những lời cổ vũ tiếng Nhật siêu dễ thương (*"Ganbatte kudasai!", "Bạn hôm nay học giỏi lắm!"*).
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. GAMES GUIDE */}
            {activeTab === 'GAMES' && (
              <motion.div
                key="games"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {/* Samurai Slasher */}
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-rose-500 flex items-center gap-1.5">
                      <Swords className="w-4 h-4" /> 1. Kanji Samurai Slasher
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600">Phản xạ nhanh</span>
                  </div>
                  <p className="text-muted-foreground">
                    <strong>Luật chơi:</strong> Đọc kỹ yêu cầu ở thanh trên cùng (ví dụ: *Chém từ có nghĩa "Ngại ngùng"*). Bấm/chém đúng quả cầu chứa từ vựng tương ứng trước khi quả cầu chạm vạch đỏ dưới đáy.
                  </p>
                  <p className="text-amber-500 font-medium">
                    💡 <strong>Mẹo hay:</strong> Giữ chuỗi chém liên tiếp (Combo x5, x10) để điểm số và EXP nhân đôi theo cấp số nhân!
                  </p>
                </div>

                {/* Speed Match */}
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-500 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> 2. Ghép Thẻ Thần Tốc (Speed Match)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">Trí nhớ 3D</span>
                  </div>
                  <p className="text-muted-foreground">
                    <strong>Luật chơi:</strong> Lật bài tìm cặp bài trùng giữa thẻ <strong>Kanji</strong> và thẻ <strong>Ý Nghĩa Tiếng Việt / Furigana</strong>.
                  </p>
                  <p className="text-amber-500 font-medium">
                    💡 <strong>Mẹo hay:</strong> Hoàn thành trong dưới 45 giây để nhận đánh giá 3 Sao ⭐⭐⭐ và mở khóa huy hiệu <em>Mắt Thần Siêu Tốc</em>!
                  </p>
                </div>

                {/* Boss Battle */}
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-500 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4" /> 3. JLPT Boss Dungeon (Đấu Boss RPG)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600">Đấu trí chiến thuật</span>
                  </div>
                  <p className="text-muted-foreground">
                    <strong>Luật chơi:</strong> Đấu theo lượt với Quái Vật Ngữ Pháp & Hắc Long Kanji. Trả lời đúng để tung đòn sét chí mạng 120 HP. Trả lời sai sẽ bị Boss phản công trừ máu dũng sĩ.
                  </p>
                  <p className="text-amber-500 font-medium">
                    💡 <strong>Chiêu thức hỗ trợ:</strong> Dùng <strong>💖 Hồi Máu</strong> khi máu dưới 40, dùng <strong>🎯 Loại 2 Sai</strong> khi gặp câu hiểm hóc, và dùng <strong>🛡️ Khiên Chắn</strong> để chặn đòn nguy hiểm của Boss!
                  </p>
                </div>

                {/* Sentence Scramble */}
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-indigo-500 flex items-center gap-1.5">
                      <Gamepad2 className="w-4 h-4" /> 4. Sentence Scramble (Xếp Câu N3)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600">Ngữ pháp thực tế</span>
                  </div>
                  <p className="text-muted-foreground">
                    <strong>Luật chơi:</strong> Bấm vào các mảnh từ vựng để xếp theo đúng thứ tự ngữ pháp tiếng Nhật.
                  </p>
                  <p className="text-amber-500 font-medium">
                    💡 <strong>Mẹo hay:</strong> Bấm nút <Volume2 className="w-3.5 h-3.5 inline" /> <em>Nghe Âm Thanh Gợi Ý</em> để nghe người bản xứ đọc trước khi xếp bài.
                  </p>
                </div>

                {/* Visual Novel Story Irodori */}
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-500 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> 5. Visual Novel Cốt Truyện Irodori (10 Tập)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600">Chuẩn Japan Foundation</span>
                  </div>
                  <p className="text-muted-foreground">
                    <strong>Cốt truyện chuẩn giáo trình Irodori JF:</strong> Nhập vai trải nghiệm 10 tình huống thực tế tại Nhật Bản: <em>Hỏi đường Shibuya, Phỏng vấn Baito, Chuyển nhà chào hỏi hàng xóm, Khám bệnh tại phòng khám, Phân loại rác, Nhận bưu kiện Yamato, Ứng phó động đất, Tiệc rượu Nomikai, Tắm Onsen, và Báo cáo công sở Horenso</em>.
                  </p>
                  <p className="text-amber-500 font-medium">
                    💡 <strong>Mẹo hay:</strong> Chọn câu thoại đúng văn hóa để mở khóa trọn bộ 10 Bưu Thiếp Kỷ Niệm và nhận hàng ngàn EXP & Vàng!
                  </p>
                </div>
              </motion.div>
            )}


            {/* 3. OMIKUJI GUIDE */}
            {activeTab === 'OMIKUJI' && (
              <motion.div
                key="omikuji"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <div className="font-black text-purple-600 dark:text-purple-400">
                    🥠 Văn Hóa Rút Quẻ Omikuji Nhật Bản
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Omikuji (おみくじ) là phong tục rút quẻ may mắn truyền thống tại các đền thờ Thần đạo (Shinto) và chùa Phật giáo ở Nhật Bản để dự đoán vận may và nhận lời khuyên quý báu.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-card border border-border/50 flex items-center justify-between">
                    <div>
                      <strong className="text-amber-500">🌟 Đại Cát (大吉 - Dai-kichi)</strong>
                      <p className="text-[11px] text-muted-foreground">Vận may đỉnh cao, học đâu nhớ đó</p>
                    </div>
                    <span className="text-xs font-black text-amber-500">+150 Vàng • +100 EXP</span>
                  </div>

                  <div className="p-3 rounded-xl bg-card border border-border/50 flex items-center justify-between">
                    <div>
                      <strong className="text-purple-500">✨ Trung Cát (中吉 - Chu-kichi)</strong>
                      <p className="text-[11px] text-muted-foreground">Tấn tới thành công, kiên trì đơm hoa</p>
                    </div>
                    <span className="text-xs font-black text-purple-500">+100 Vàng • +70 EXP</span>
                  </div>

                  <div className="p-3 rounded-xl bg-card border border-border/50 flex items-center justify-between">
                    <div>
                      <strong className="text-emerald-500">🌸 Tiểu Cát (小吉 - Sho-kichi)</strong>
                      <p className="text-[11px] text-muted-foreground">Bình an tiến bộ vững chắc từng ngày</p>
                    </div>
                    <span className="text-xs font-black text-emerald-500">+70 Vàng • +50 EXP</span>
                  </div>

                  <div className="p-3 rounded-xl bg-card border border-border/50 flex items-center justify-between">
                    <div>
                      <strong className="text-blue-500">🍀 Cát (吉 - Kichi)</strong>
                      <p className="text-[11px] text-muted-foreground">Vạn sự hanh thông, tập trung bứt phá</p>
                    </div>
                    <span className="text-xs font-black text-blue-500">+50 Vàng • +40 EXP</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground italic text-center">
                  Mỗi ngày bạn được rung ống quẻ 1 lần miễn phí kèm 1 Từ Vựng May Mắn của ngày!
                </p>
              </motion.div>
            )}

            {/* 4. RANKS GUIDE */}
            {activeTab === 'RANKS' && (
              <motion.div
                key="ranks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <p className="text-muted-foreground">
                  Mọi hoạt động học tập (ôn thẻ flashcard SRS, trả lời quiz, chiến thắng minigame) đều được tự động quy đổi thành <strong>Điểm Kinh Nghiệm (EXP)</strong> để thăng hạng danh hiệu võ sĩ:
                </p>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 flex justify-between items-center">
                    <span className="font-bold text-foreground">🥋 Cấp 1: Nhập Môn N3</span>
                    <span className="text-xs font-semibold text-muted-foreground">0 EXP</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex justify-between items-center">
                    <span className="font-bold text-blue-500">🗡️ Cấp 2: Samurai Tập Sự</span>
                    <span className="text-xs font-semibold text-muted-foreground">100 EXP</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center">
                    <span className="font-bold text-emerald-500">⚔️ Cấp 3: Kiếm Sĩ N3</span>
                    <span className="text-xs font-semibold text-muted-foreground">250 EXP</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex justify-between items-center">
                    <span className="font-bold text-amber-500">⚡ Cấp 4: Bậc Thầy Từ Vựng</span>
                    <span className="text-xs font-semibold text-muted-foreground">500 EXP</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 flex justify-between items-center">
                    <span className="font-bold text-orange-500">🔥 Cấp 5: Võ Thần Mimikara</span>
                    <span className="text-xs font-semibold text-muted-foreground">900 EXP</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex justify-between items-center">
                    <span className="font-bold text-purple-500">👑 Cấp 6: Đại Sư JLPT N3</span>
                    <span className="text-xs font-semibold text-muted-foreground">1400 EXP</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex justify-between items-center">
                    <span className="font-black text-rose-500">🌟 Cấp 7: Huyền Thoại N3</span>
                    <span className="text-xs font-semibold text-rose-500 font-bold">2000+ EXP</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Button */}
        <div className="pt-4 border-t border-border/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Đã Hiểu & Đóng Cẩm Nang
          </button>
        </div>
      </div>
    </div>
  );
}
