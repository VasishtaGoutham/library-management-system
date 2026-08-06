'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore, ThemeMode } from '@/store/useThemeStore';
import api from '@/lib/api';
import { BookOpen, User, LogOut, LayoutDashboard, ShieldCheck, Palette, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          if (res.data && res.data.email) {
            setUser(res.data);
          }
        })
        .catch(() => {
          // preserve local state if network glitch
        });
    }
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      logout();
      router.push('/login');
    }
  };

  const themes: { id: ThemeMode; label: string; color: string }[] = [
    { id: 'obsidian', label: '🌑 Obsidian (Vercel Dark)', color: '#6366f1' },
    { id: 'porcelain', label: '☀️ Porcelain (Stripe Light)', color: '#2563eb' },
    { id: 'emerald', label: '🌲 Emerald (Executive Green)', color: '#10b981' },
    { id: 'violet', label: '🔮 Violet (Deep Tech)', color: '#8b5cf6' },
  ];

  return (
    <nav className="sticky top-0 z-50 px-6 py-3.5 border-b transition-colors duration-300 backdrop-blur-md" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--card-border)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 rounded-xl border transition" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-main)' }}>
            Library<span style={{ color: 'var(--accent-color)' }}>Universe</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className={`transition ${pathname === '/' ? 'font-bold' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/' ? 'var(--accent-color)' : 'var(--text-main)' }}
          >
            Home
          </Link>

          <Link
            href="/catalog"
            className={`transition ${pathname === '/catalog' ? 'font-bold' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/catalog' ? 'var(--accent-color)' : 'var(--text-main)' }}
          >
            Browse Books
          </Link>

          <a
            href="/#about"
            className="transition hover:opacity-80"
            style={{ color: 'var(--text-main)' }}
          >
            About
          </a>

          <a
            href="/#contact"
            className="transition hover:opacity-80"
            style={{ color: 'var(--text-main)' }}
          >
            Contact
          </a>

          {user?.role === 'ROLE_ADMIN' && (
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-1 font-semibold transition text-emerald-500"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          )}

          {user?.role === 'ROLE_STUDENT' && (
            <Link
              href="/student/dashboard"
              className="flex items-center space-x-1 font-semibold transition"
              style={{ color: 'var(--accent-color)' }}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>My Portal</span>
            </Link>
          )}
        </div>

        {/* Right Side: Theme Switcher & Auth */}
        <div className="flex items-center space-x-3">
          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="p-2 rounded-xl border flex items-center space-x-1.5 text-xs font-medium transition"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
              title="Change Color Theme"
            >
              <Palette className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
              <span className="hidden sm:inline capitalize">{theme}</span>
            </button>

            {isThemeOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl p-2 space-y-1 z-50" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <p className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 text-slate-400">Select Theme Aesthetic</p>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsThemeOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition text-left hover:opacity-80"
                    style={{
                      backgroundColor: theme === t.id ? 'var(--accent-light)' : 'transparent',
                      color: theme === t.id ? 'var(--accent-color)' : 'var(--text-main)'
                    }}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: t.color }}></span>
                      <span>{t.label}</span>
                    </span>
                    {theme === t.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                href={user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/student/profile'}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border hover:opacity-80 transition cursor-pointer group"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                title="View & Edit My Profile"
              >
                <User className="w-4 h-4 transition group-hover:scale-110" style={{ color: 'var(--accent-color)' }} />
                <div className="text-left hidden sm:block">
                  <p className="font-semibold text-xs leading-tight transition group-hover:text-indigo-400" style={{ color: 'var(--text-main)' }}>{user.fullName}</p>
                  <p className="text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>{user.role === 'ROLE_ADMIN' ? 'Admin' : 'Student'}</p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl border text-slate-400 hover:text-rose-500 transition"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs">
              <Link
                href="/login?mode=login"
                className="px-3.5 py-2 rounded-xl font-medium transition hover:opacity-80"
                style={{ color: 'var(--text-main)' }}
              >
                Login
              </Link>
              <Link
                href="/login?mode=register"
                className="px-4 py-2 rounded-xl text-white font-medium transition shadow-sm hover:opacity-90"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
