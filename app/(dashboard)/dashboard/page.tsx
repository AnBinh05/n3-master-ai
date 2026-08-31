import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Sparkles, 
  Layers, 
  Flame, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Brain, 
  BookOpen,
  Zap,
  Bot,
  GraduationCap,
  PlayCircle,
  Gamepad2,
  Swords,
  Trophy
} from 'lucide-react';
import { HeatmapCalendar } from '@/components/stats/HeatmapCalendar';

export const revalidate = 0;

export default async function DashboardPage() {
  // Fetch all 12 units in chronological order
  let decks: any[] = [];
  try {
    decks = await prisma.deck.findMany({
      include: {
        _count: { select: { cards: true } },
        cards: { select: { id: true, dueDate: true, status: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  } catch (e) {
    decks = [];
  }

  let totalCards = 0;
  let totalDue = 0;

  decks.forEach((deck: any) => {
    totalCards += deck._count.cards;
    const now = new Date();
    totalDue += deck.cards.filter((c: any) => new Date(c.dueDate) <= now || c.status === 'NEW').length;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 text-white shadow-xl shadow-rose-500/20">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Giáo Trình Chuẩn Mimikara Oboeru N3 (880 Từ)
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">
              Chinh Phục 12 Unit JLPT N3 🎌
            </h1>
            <p className="mt-2 text-white/90 text-sm sm:text-base max-w-xl font-medium">
              Bạn có <strong className="underline decoration-amber-300">{totalDue} thẻ đang chờ học</strong>. Hãy chọn từng Unit bên dưới để bắt đầu học ngay!
            </p>
          </div>

          <Link
            href="/review"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-rose-600 font-extrabold text-sm sm:text-base shadow-lg hover:bg-rose-50 transition-colors shrink-0"
          >
            <Zap className="w-5 h-5 fill-rose-600" /> Ôn Toàn Bộ Thẻ ({totalDue})
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-card p-5 rounded-3xl border border-border/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">7 Ngày</div>
            <div className="text-xs font-semibold text-muted-foreground">Chuỗi Học (Streak)</div>
          </div>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-border/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-rose-500">{totalDue}</div>
            <div className="text-xs font-semibold text-muted-foreground">Thẻ Cần Ôn Tập</div>
          </div>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-border/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{totalCards} Từ</div>
            <div className="text-xs font-semibold text-muted-foreground">12 Unit Mimikara N3</div>
          </div>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-border/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-500">100% Free</div>
            <div className="text-xs font-semibold text-muted-foreground">Không Giới Hạn</div>
          </div>
        </div>
      </div>

      {/* Feature Spotlights: Arcade & Mock Exam */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spotlight 1: Arcade Hub */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border-2 border-rose-500/30 flex flex-col justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> N3 Arcade Universe
              </div>
              <h3 className="text-base sm:text-lg font-black text-foreground">
                Võ Đài Trò Chơi & Nuôi Pet 🎮
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                8 Chế độ chơi: <strong>Samurai Slasher</strong>, <strong>Luyện nói AI</strong>, <strong>Đấu Boss</strong> & <strong>Visual Novel Irodori</strong>!
              </p>
            </div>
          </div>

          <Link
            href="/games"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all self-start"
          >
            <Swords className="w-4 h-4" /> Vào Khu Trò Chơi
          </Link>
        </div>

        {/* Spotlight 2: Mock Exam Room */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-rose-500/15 border-2 border-indigo-500/30 flex flex-col justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> Chuẩn Đề Thi Thật 180đ
              </div>
              <h3 className="text-base sm:text-lg font-black text-foreground">
                Giả Lập Phòng Thi JLPT N3 📝
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bấm giờ 105 phút, phiếu tô đáp án OMR, tải đề <strong>PDF / Word / CSV</strong> và tính điểm đỗ/trượt chuẩn!
              </p>
            </div>
          </div>

          <Link
            href="/mock-test"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all self-start"
          >
            <Clock className="w-4 h-4" /> Vào Phòng Thi Thử
          </Link>
        </div>
      </div>



      {/* Main Section: 12 Units of Mimikara N3 */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-rose-500" /> Chọn Unit Để Học (Mimikara N3 880 Từ)
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Học lần lượt từng Unit theo đúng lộ trình sách giáo khoa Mimikara Oboeru N3 (Từ số 1 đến 880).
            </p>
          </div>

          <Link
            href="/public/mimikara_n3_880.csv"
            download="mimikara_n3_880.csv"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-2 rounded-xl transition-colors border border-rose-500/20 w-fit"
          >
            📥 Tải File CSV 880 Từ (Chuẩn Anki)
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {decks.map((deck: any, idx: number) => {
            const due = deck.cards.filter(
              (c: any) => new Date(c.dueDate) <= new Date() || c.status === 'NEW'
            ).length;

            return (
              <div
                key={deck.id}
                className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm hover:border-rose-500/50 hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      {deck.category === 'GRAMMAR' ? 'NGỮ PHÁP' : `UNIT ${idx + 1}`}
                    </span>
                    <span className="text-xs font-extrabold text-foreground bg-muted px-2.5 py-1 rounded-lg">
                      {deck._count.cards} Thẻ
                    </span>
                  </div>

                  <Link href={`/decks/${deck.id}`}>
                    <h3 className="text-lg font-black text-foreground group-hover:text-rose-500 transition-colors line-clamp-1">
                      {deck.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {deck.description || 'Chưa có mô tả cho bộ thẻ này.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-500">
                    ⚡ {due} thẻ cần học
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/quiz/${deck.id}`}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors border border-amber-500/20 flex items-center gap-1"
                      title="Làm bài kiểm tra trắc nghiệm"
                    >
                      🎯 Test
                    </Link>
                    <Link
                      href={`/review/${deck.id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-black hover:opacity-95 transition-all shadow-md shadow-rose-500/20"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Học
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Tools & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                <Bot className="w-5 h-5 text-rose-500" /> Trợ Lý N3 AI Studio
              </h2>
              <Link href="/ai" className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1">
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/ai"
                className="p-4 rounded-2xl bg-muted/50 hover:bg-rose-500/10 hover:border-rose-500/30 border border-border/40 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">AI Flashcard</div>
                  <div className="text-xs text-muted-foreground">Tự tạo thẻ chuẩn N3</div>
                </div>
              </Link>

              <Link
                href="/ai"
                className="p-4 rounded-2xl bg-muted/50 hover:bg-amber-500/10 hover:border-amber-500/30 border border-border/40 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Giải Thích Ngữ Pháp</div>
                  <div className="text-xs text-muted-foreground">Bẫy đề thi N3</div>
                </div>
              </Link>

              <Link
                href="/ai"
                className="p-4 rounded-2xl bg-muted/50 hover:bg-indigo-500/10 hover:border-indigo-500/30 border border-border/40 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Trắc Nghiệm N3</div>
                  <div className="text-xs text-muted-foreground">Format đề thi thật</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Heatmap Column */}
        <div className="space-y-6">
          <HeatmapCalendar />
        </div>
      </div>
    </div>
  );
}
