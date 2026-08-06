'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import Navbar from '@/components/Navbar';
import { 
  User, Mail, IdCard, ShieldCheck, Lock, KeyRound, 
  Save, CheckCircle2, AlertCircle, BookOpen, Layers, 
  UserCheck, Eye, EyeOff, Sparkles, RefreshCw
} from 'lucide-react';

export default function StudentProfilePage() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  // Personal Info Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState('');

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Notification Banner
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Profile Query
  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const res = await api.get('/users/me');
      return res.data;
    },
  });

  // Student Borrowings Stats Query
  const { data: myBorrowings = [] } = useQuery({
    queryKey: ['my-borrowings-profile'],
    queryFn: async () => {
      const res = await api.get('/borrowings/my');
      return res.data;
    },
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || user?.fullName || '');
      setEmail(profile.email || user?.email || '');
      setStudentIdNumber(profile.studentIdNumber || user?.studentIdNumber || '');
    } else if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setStudentIdNumber(user.studentIdNumber || '');
    }
  }, [profile, user]);

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put('/users/me', {
        fullName,
        email,
        studentIdNumber,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      setMessage({ text: 'Your profile details have been updated successfully!', type: 'success' });
    },
    onError: (err: any) => {
      setMessage({ text: err.response?.data?.message || 'Failed to update profile', type: 'error' });
    },
  });

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long!');
      }
      if (newPassword !== confirmPassword) {
        throw new Error('New password and confirm password do not match!');
      }
      const res = await api.put('/users/me/password', {
        currentPassword,
        newPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ text: 'Your password was changed successfully!', type: 'success' });
    },
    onError: (err: any) => {
      setMessage({ text: err.message || err.response?.data?.message || 'Failed to change password', type: 'error' });
    },
  });

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

  const strength = getPasswordStrength(newPassword);

  const activeLoans = myBorrowings.filter((b: any) => b.status === 'ISSUED' || b.status === 'OVERDUE').length;

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        
        {/* Banner Notification */}
        {message && (
          <div
            className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between shadow-sm transition ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="hover:opacity-75 font-bold text-sm">×</button>
          </div>
        )}

        {/* Top Profile Header Card */}
        <div className="border rounded-2xl p-6 shadow-lg transition-colors duration-300 relative overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            
            {/* User Avatar Circle */}
            <div className="w-20 h-20 rounded-2xl border-2 flex items-center justify-center font-extrabold text-2xl shadow-inner relative" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
              {fullName ? fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST'}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Account Active"></span>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold tracking-tight">{fullName || 'Student User'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  {profile?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_ADMIN' ? 'Librarian Admin' : 'Student Member'}
                </span>
              </div>

              <p className="text-xs flex items-center justify-center sm:justify-start gap-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                <Mail className="w-3.5 h-3.5 inline" /> {email || 'student@library.com'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs">
                <span className="font-mono px-3 py-1 rounded-lg border text-[11px]" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--accent-color)' }}>
                  <IdCard className="w-3.5 h-3.5 inline mr-1" />
                  ID: {studentIdNumber || 'STU-2026-001'}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Max Borrow Limit: <strong className="text-emerald-500 font-bold">3 Books</strong>
                </span>
              </div>
            </div>

            {/* Quick Stat Pills */}
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <div className="p-3 rounded-xl border text-center space-y-0.5" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Borrowed</span>
                <span className="text-lg font-extrabold" style={{ color: 'var(--accent-color)' }}>{myBorrowings.length}</span>
              </div>

              <div className="p-3 rounded-xl border text-center space-y-0.5" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Loans</span>
                <span className="text-lg font-extrabold text-emerald-500">{activeLoans}</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2 Form Cards Grid: Personal Info & Security Password */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Card 1: Edit Profile Form */}
          <div className="border rounded-2xl p-6 shadow-lg space-y-5" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
              <h2 className="font-bold text-sm flex items-center gap-2">
                <User className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
                <span>Edit Personal Details</span>
              </h2>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Account Details</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfileMutation.mutate();
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full border rounded-xl px-3.5 py-2.5 focus:outline-none"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Email Address *</label>
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
                <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Student ID Number</label>
                <input
                  type="text"
                  placeholder="STU-2026-001"
                  value={studentIdNumber}
                  onChange={(e) => setStudentIdNumber(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 font-mono focus:outline-none"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                />
              </div>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full py-2.5 rounded-xl font-medium text-white transition flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 mt-2"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card 2: Security & Change Password Form */}
          <div className="border rounded-2xl p-6 shadow-lg space-y-5" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
              <h2 className="font-bold text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Security & Change Password</span>
              </h2>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">BCrypt Encrypted</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                changePasswordMutation.mutate();
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full border rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>New Password *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Minimum 6+ characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full border rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <span>Password Strength:</span>
                      <span className="font-bold">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${strength.color}`} style={{ width: `${(strength.score / 3) * 100}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Confirm New Password *</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full border rounded-xl px-3.5 py-2.5 focus:outline-none"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                />
              </div>

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full py-2.5 rounded-xl font-medium text-white transition flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 mt-2 bg-emerald-600 hover:bg-emerald-500"
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </main>
    </div>
  );
}
