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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn('credentials', {
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
