'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { 
  BookOpen, 
  Layers, 
  Sparkles, 
  BarChart3, 
  Settings, 
  Sun, 
  Moon, 
  Crown, 
  Flame, 
  Gamepad2, 
  Coins, 
  FileText,
  User,
  LogOut,
  LogIn,
  Compass
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { 
  getGamificationProfile, 
  calculateLevel, 
  GamificationProfile,
  setActiveUserEmail 
} from '@/lib/gamification';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Sync profile per user session
  useEffect(() => {
    setMounted(true);
    const userEmail = session?.user?.email || null;
    setActiveUserEmail(userEmail);
    setProfile(getGamificationProfile(userEmail));

    const handleUpdate = () => {
      setProfile(getGamificationProfile(session?.user?.email));
    };

    window.addEventListener('gamification_update', handleUpdate);
    return () => window.removeEventListener('gamification_update', handleUpdate);
  }, [session]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const levelInfo = profile ? calculateLevel(profile.exp) : null;

  const navLinks = [
    { href: '/dashboard', label: 'Tổng quan', icon: BookOpen },
    { href: '/decks', label: 'Bộ thẻ', icon: Layers },
    { href: '/review', label: 'Ôn tập', icon: Sparkles },
    { href: '/dokkai', label: 'Đọc hiểu', icon: Compass },
    { href: '/mock-test', label: 'Thi Thử', icon: FileText },
    { href: '/games', label: 'Trò chơi', icon: Gamepad2 },
    { href: '/ai', label: 'AI Studio', icon: Sparkles },
    { href: '/stats', label: 'Thống kê', icon: BarChart3 },
    { href: '/settings', label: 'Cài đặt', icon: Settings },
  ];

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : session?.user?.email
      ? session.user.email.charAt(0).toUpperCase()
      : 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 transition-transform hover:scale-105 shrink-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white shadow-lg shadow-rose-500/30">
            <span className="font-black text-lg sm:text-xl tracking-tighter">N3</span>
          </div>
          <div className="hidden sm:block">
            <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-base sm:text-lg font-extrabold text-transparent">
              N3 Master AI
            </span>
            <span className="block text-[9px] font-semibold text-rose-500/80 tracking-widest uppercase">
              JLPT Anki SRS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-rose-500' : ''}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Level, Coins, Streak, Profile & Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Level & Coins Pill */}
          {levelInfo && profile && (
            <Link
              href="/games"
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold shadow-sm hover:scale-105 transition-transform"
              title={`Cấp ${levelInfo.level}: ${levelInfo.title} (${profile.exp} EXP)`}
            >
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                Lv.{levelInfo.level}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-black">
                <Coins className="w-3.5 h-3.5 fill-amber-500" />
                <span>{profile.coins}</span>
              </div>
            </Link>
          )}

          {/* Daily Streak Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-sm">
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{profile?.streak || 7} Ngày</span>
          </div>

          {/* User Account State / Sign In Button */}
          {status === 'authenticated' && session?.user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-muted border border-border/80 hover:border-rose-500/50 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                  {userInitial}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-foreground max-w-[90px] truncate">
                  {session.user.name || session.user.email?.split('@')[0]}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-card border border-border/80 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="border-b border-border/50 pb-3">
                    <div className="font-black text-sm text-foreground truncate">
                      {session.user.name || 'Học viên N3'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black">
                      ✨ Tiến trình cá nhân đã đồng bộ
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" /> Cài đặt tài khoản
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut({ callbackUrl: '/login' });
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/25 hover:bg-rose-600 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
          )}

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Đổi giao diện Sáng/Tối"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
