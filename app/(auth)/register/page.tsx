'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignUp = () => {
    setGoogleLoading(true);
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        name,
        email,
        password,
        redirect: false,
      });
      if (res?.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-card p-8 rounded-3xl border border-rose-500/20 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white font-black text-2xl mx-auto shadow-lg shadow-rose-500/30">
            N3
          </div>
          <h1 className="text-2xl font-black text-foreground">Tạo Tài Khoản Mới</h1>
          <p className="text-xs text-muted-foreground">Bắt đầu học 3000+ từ vựng & ngữ pháp JLPT N3 ngay hôm nay</p>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="w-full py-3.5 px-4 rounded-2xl border border-border bg-background hover:bg-muted/80 text-foreground font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-3 hover:shadow-md disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {googleLoading ? 'Đang chuyển hướng tới Google...' : 'Đăng ký với Google'}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full"></div>
          <span className="bg-card px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            hoặc đăng ký bằng email
          </span>
          <div className="border-t border-border w-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-rose-500" /> Họ & Tên
            </label>
            <input
              type="text"
              required
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 rounded-2xl bg-muted/60 border border-border text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-rose-500" /> Email
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
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
              placeholder="••••••••"
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
            {loading ? 'Đang Tạo Tài Khoản...' : 'Đăng Ký Tài Khoản'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 text-center border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-bold text-rose-500 hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
