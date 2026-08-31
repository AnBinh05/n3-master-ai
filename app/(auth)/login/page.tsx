'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@n3master.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage(res.error);
      } else if (res?.ok) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage('Đã xảy ra sự cố khi đăng nhập. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-card p-8 rounded-3xl border border-rose-500/20 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white font-black text-2xl mx-auto shadow-lg shadow-rose-500/30">
            N3
          </div>
          <h1 className="text-2xl font-black text-foreground">Đăng Nhập N3 Master AI</h1>
          <p className="text-xs text-muted-foreground">Chinh phục JLPT N3 cùng trí tuệ nhân tạo & SRS Anki</p>
        </div>

        {/* Security / Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-rose-500" /> Email đăng nhập
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-2xl bg-muted/60 border border-border text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-rose-500" /> Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 rounded-2xl bg-muted/60 border border-border text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập Ngay'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 text-center border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-bold text-rose-500 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
