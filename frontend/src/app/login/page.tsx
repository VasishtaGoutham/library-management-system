'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import Navbar from '@/components/Navbar';
import { BookOpen, ShieldCheck, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode');

  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (initialMode === 'register') {
      setIsRegister(true);
    } else if (initialMode === 'login') {
      setIsRegister(false);
    }
  }, [initialMode]);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: loginEmail, password: loginPass });
      setUser(res.data);
      if (res.data.role === 'ROLE_ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister && password.length < 6) {
      setError('Password security rule: Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await api.post('/auth/register', {
          fullName,
          email,
          password,
          studentIdNumber: studentIdNumber.trim() || undefined,
        });
        await performLogin(email, password);
      } else {
        await performLogin(email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Check your credentials.');
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    performLogin(quickEmail, quickPass);
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[!@#$%^&*]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="border max-w-md w-full p-8 rounded-2xl shadow-lg space-y-6 transition-colors duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        
        {/* Toggle Header Tabs */}
        <div className="flex border-b pb-3 items-center justify-around text-sm font-bold" style={{ borderColor: 'var(--card-border)' }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
            className={`pb-2 border-b-2 transition ${
              !isRegister ? 'border-indigo-500 text-indigo-400 font-extrabold' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
            className={`pb-2 border-b-2 transition ${
              isRegister ? 'border-indigo-500 text-indigo-400 font-extrabold' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Register Student
          </button>
        </div>

        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-color)' }}>
            <BookOpen className="w-6 h-6" style={{ color: 'var(--accent-color)' }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {isRegister ? 'Register as a student to borrow books' : 'Sign in to access your library account'}
          </p>
        </div>

        {!isRegister && (
          <div className="border rounded-xl p-3.5 space-y-2 text-xs" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
            <span className="font-semibold block" style={{ color: 'var(--text-main)' }}>1-Click Demo Login:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@library.com', 'admin123')}
                className="p-2 border rounded-lg text-left transition hover:opacity-80"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              >
                <span className="font-semibold block" style={{ color: 'var(--accent-color)' }}>Admin</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>admin@library.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('student@library.com', 'student123')}
                className="p-2 border rounded-lg text-left transition hover:opacity-80"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              >
                <span className="font-semibold block text-emerald-500">Student</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>student@library.com</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isRegister && (
            <>
              <div>
                <label className="block font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full border rounded-xl px-3.5 py-2.5 focus:outline-none"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label className="block font-medium mb-1 flex items-center justify-between" style={{ color: 'var(--text-muted)' }}>
                  <span>Student ID Number</span>
                  <span className="text-[10px] opacity-75 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="STU-2026-001 (or leave blank)"
                  value={studentIdNumber}
                  onChange={(e) => setStudentIdNumber(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 focus:outline-none font-mono"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Email Address</label>
            <input
              type="email"
              placeholder="name@library.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-xl px-3.5 py-2.5 focus:outline-none"
              style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label className="block font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none"
                style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isRegister && password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  <span>Password Security Strength:</span>
                  <span className="font-bold">{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${strength.color}`} style={{ width: `${(strength.score / 3) * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>

          {isRegister && (
            <div className="p-3 rounded-xl border text-[11px] space-y-1" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
              <span className="font-semibold block text-indigo-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Security Rules Enforced:
              </span>
              <p>• Minimum 6+ characters</p>
              <p>• Salted BCrypt password encryption</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-medium transition text-white shadow-sm disabled:opacity-50 mt-2"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="pt-3 border-t flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="hover:underline"
            style={{ color: 'var(--accent-color)' }}
          >
            {isRegister ? 'Already have an account? Sign In' : "Need an account? Register as Student"}
          </button>
          <span>v1.0.0</span>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-xs">Loading authentication form...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
