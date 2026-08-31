import Link from 'next/link';
import { 
  Sparkles, 
  Brain, 
  Layers, 
  CheckCircle2, 
  Zap, 
  Smartphone, 
  ArrowRight, 
  Crown,
  Flame,
  Volume2
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Sakura Glow Ambient BG */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-rose-500/20 to-amber-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-6">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>Trọn Bộ 12 Unit Mimikara N3 (880 từ) & AI Assistant - MIỄN PHÍ 100%</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
          Chinh Phục <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">JLPT N3</span> Cùng 880 Từ Mimikara N3 Chia 12 Unit
        </h1>

        <p className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
          Toàn bộ 880 từ vựng chia theo <strong>12 Unit chuẩn sách Mimikara Oboeru N3</strong>. Học bằng thuật toán <strong>Anki SM-2</strong> kết hợp <strong>AI Studio</strong> giải thích và tạo đề thi thử hoàn toàn miễn phí.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-extrabold text-base shadow-xl shadow-rose-500/30 hover:scale-105 transition-all"
          >
            Bắt Đầu Học Miễn Phí Ngay <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/review"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-base hover:bg-muted transition-colors"
          >
            Học Thử Thẻ Demo N3 <Layers className="w-5 h-5 text-rose-500" />
          </Link>
        </div>

        {/* Hero Preview Card Graphic */}
        <div className="mt-16 relative max-w-3xl mx-auto bg-card/90 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl jp-card-glow text-left">
          <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> AI Generated Flashcard Demo
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-500">
              JLPT N3 Target
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-4xl font-black text-foreground font-japanese flex items-center gap-3">
                遠慮 <span className="text-sm font-normal text-muted-foreground">(えんりょ - enryo)</span>
              </h3>
              <p className="text-lg font-bold text-rose-500 mt-1">Nghĩa: Ngại ngùng, e dè, kiềm chế</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <Volume2 className="w-5 h-5" />
              </span>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-muted/60 text-xs sm:text-sm text-foreground/90 space-y-1">
            <p>• <strong>Ví dụ:</strong> 遠慮しないで、どうぞたくさん食べてください。(Xin đừng ngại, hãy ăn thật nhiều nhé!)</p>
            <p className="text-muted-foreground">• <strong>Hán tự:</strong> 遠 (Viễn) + 慮 (Lự)</p>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 bg-muted/30 border-y border-border/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">
              Tại Sao <span className="text-rose-500">N3 Master AI</span> Là Trợ LýJLPT Hoàn Hảo?
            </h2>
            <p className="text-muted-foreground mt-2">
              Sự kết hợp giữa phương pháp ghi nhớ khoa học Anki và sức mạnh đột phá của AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-3xl border border-border/60 shadow-sm hover:border-rose-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Thuật Toán SRS SM-2</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tự động tính toán chu kỳ lặp lại ngắt quãng (Interval & Ease Factor) chính xác. Giúp bạn nhớ 3000 từ vựng N3 mà không bao giờ lo bị quên.
              </p>
            </div>

            <div className="bg-card p-8 rounded-3xl border border-border/60 shadow-sm hover:border-rose-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">AI Flashcard & Quiz Creator</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nhập bất kỳ từ vựng hay câu văn nào, AI sẽ tự động phân tích Hán tự, Furigana, dịch nghĩa và tạo bộ câu hỏi thi thử JLPT N3 chuẩn format.
              </p>
            </div>

            <div className="bg-card p-8 rounded-3xl border border-border/60 shadow-sm hover:border-rose-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Mobile-First & PWA Offline</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Giao diện tối ưu 100% cho màn hình điện thoại. Cài đặt trực tiếp lên màn hình chính (Add to Home Screen) và ôn tập offline mọi lúc mọi nơi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">Bảng Gói Học Phù Hợp Cho Bạn</h2>
          <p className="text-muted-foreground mt-2">Dùng thử miễn phí mãi mãi hoặc nâng cấp Pro để học không giới hạn.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="bg-card p-8 rounded-3xl border border-border/60 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-sm font-bold uppercase text-muted-foreground">Free Tier</span>
              <h3 className="text-3xl font-black text-foreground mt-2">$0 <span className="text-sm font-medium text-muted-foreground">/ tháng</span></h3>
              <ul className="mt-6 space-y-3 text-sm text-foreground/90">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ôn tập 50 thẻ / ngày</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 10 lượt dùng AI / ngày</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bộ 100+ thẻ JLPT N3 mẫu có sẵn</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Thống kê Heatmap cơ bản</li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 w-full py-3.5 rounded-xl border border-border font-bold text-center text-foreground hover:bg-muted transition-colors block"
            >
              Bắt Đầu Miễn Phí
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-card p-8 rounded-3xl border-2 border-rose-500 shadow-xl shadow-rose-500/10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3 h-3" /> Chuyên Giống Đỗ N3
            </div>

            <div>
              <span className="text-sm font-bold uppercase text-rose-500">Pro Plan</span>
              <h3 className="text-3xl font-black text-foreground mt-2">$9.99 <span className="text-sm font-medium text-muted-foreground">/ tháng (hoặc 199k)</span></h3>
              <ul className="mt-6 space-y-3 text-sm text-foreground/90">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500" /> ⚡ Ôn tập <strong>KHÔNG GIỚI HẠN</strong></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500" /> 🤖 AI Assistant & Quiz Generator <strong>KHÔNG GIỚI HẠN</strong></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500" /> 📱 Offline PWA mode trên điện thoại</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500" /> 🚀 Hỗ trợ ưu tiên 24/7</li>
              </ul>
            </div>

            <Link
              href="/settings"
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-extrabold text-center shadow-lg shadow-rose-500/20 hover:opacity-95 transition-opacity block"
            >
              Nâng Cấp Pro Ngay (Dùng Thử 7 Ngày)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
