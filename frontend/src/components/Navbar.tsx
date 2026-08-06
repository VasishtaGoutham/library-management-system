'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore, ThemeMode } from '@/store/useThemeStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  BookOpen, User, LogOut, LayoutDashboard, ShieldCheck, 
  Palette, Check, Bell, Clock, AlertTriangle, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

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

  // Fetch student active borrowing notifications
  const { data: rawBorrowings } = useQuery({
    queryKey: ['nav-notifications', user?.id],
    queryFn: async () => {
      if (!user || user.role === 'ROLE_ADMIN') return [];
      const res = await api.get('/borrowings/my');
      return res.data;
    },
    enabled: !!user && user.role !== 'ROLE_ADMIN',
  });

  const myBorrowings = Array.isArray(rawBorrowings) ? rawBorrowings : [];
  const activeLoans = myBorrowings.filter((b: any) => b.status === 'ISSUED' || b.status === 'OVERDUE');
  const overdueLoans = myBorrowings.filter((b: any) => b.status === 'OVERDUE');

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
    { id: 'emerald', label: '🌲 Emerald (Cyber Matrix)', color: '#10b981' },
    { id: 'violet', label: '🔮 Violet (Neon Cyberpunk)', color: '#a855f7' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-300" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--card-border)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 rounded-xl border transition" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-main)' }}>
            Library<span style={{ color: 'var(--accent-color)' }}>Universe</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-xs font-medium">
          {!user && (
            <Link
              href="/"
              className={`transition ${pathname === '/' ? 'font-bold' : 'hover:opacity-80'}`}
              style={{ color: pathname === '/' ? 'var(--accent-color)' : 'var(--text-main)' }}
            >
              Home
            </Link>
          )}

          <Link
            href="/catalog"
            className={`transition ${pathname === '/catalog' ? 'font-bold' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/catalog' ? 'var(--accent-color)' : 'var(--text-main)' }}
          >
            Browse Books
          </Link>

          <Link
            href="/study-spaces"
            className={`transition ${pathname === '/study-spaces' ? 'font-bold' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/study-spaces' ? 'var(--accent-color)' : 'var(--text-main)' }}
          >
            Study Rooms
          </Link>

          <Link
            href="/course-reserves"
            className={`transition ${pathname === '/course-reserves' ? 'font-bold' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/course-reserves' ? 'var(--accent-color)' : 'var(--text-main)' }}
          >
            Course Reserves
          </Link>

          {!user && (
            <>
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
            </>
          )}

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

        {/* Right Side: Notifications, Theme Switcher & Auth */}
        <div className="flex items-center space-x-3">
          
          {/* Notification Bell (Logged-in Student or Admin) */}
          {user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl border relative transition hover:opacity-80"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                title="Notifications & Due Date Warnings"
              >
                <Bell className="w-4 h-4" style={{ color: activeLoans.length > 0 ? 'var(--accent-color)' : 'var(--text-muted)' }} />
                {activeLoans.length > 0 && (
                  <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-extrabold text-white flex items-center justify-center shadow-md animate-pulse ${
                    overdueLoans.length > 0 ? 'bg-rose-500' : 'bg-amber-500'
                  }`}>
                    {activeLoans.length}
                  </span>
                )}
              </button>

              {/* Notifications Popup Drawer */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                  <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--card-border)' }}>
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-emerald-500" />
                      <h4 className="font-bold text-xs">Live Notifications</h4>
                    </div>
                    <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-white text-xs p-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {user.role === 'ROLE_ADMIN' ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Automated Email Service Active
                      </p>
                      <p className="text-[11px] text-slate-300">Daily due-date reminder emails run automatically via Resend API.</p>
                    </div>
                  ) : activeLoans.length === 0 ? (
                    <div className="text-center py-6 space-y-1">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-75" />
                      <p className="font-bold text-xs">No Pending Due Warnings</p>
                      <p className="text-[10px] text-slate-400">All your borrowed books are returned and up to date!</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {activeLoans.map((loan: any) => (
                        <div
                          key={loan.id}
                          className={`p-3 rounded-xl border text-xs space-y-1 transition ${
                            loan.status === 'OVERDUE'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold line-clamp-1">{loan.copy?.book?.title || 'Borrowed Book'}</span>
                            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-md border font-extrabold" style={{ backgroundColor: 'var(--bg-color)' }}>
                              {loan.status}
                            </span>
                          </div>
                          <p className="text-[11px] opacity-90 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Due Date: <strong className="font-mono">{loan.dueDate ? loan.dueDate.split('T')[0] : '2026-08-15'}</strong>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {user.role === 'ROLE_STUDENT' && (
                    <Link
                      href="/student/dashboard"
                      onClick={() => setIsNotifOpen(false)}
                      className="w-full py-2 rounded-xl text-xs font-bold text-center block text-white transition shadow-sm hover:opacity-90 mt-2"
                      style={{ backgroundColor: 'var(--accent-color)' }}
                    >
                      View All My Loans & Portal →
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

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
    </header>
  );
}
