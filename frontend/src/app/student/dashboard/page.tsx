'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  BookOpen, Clock, AlertTriangle, DollarSign, CheckCircle2, 
  Calendar, Barcode, BookMarked, Bookmark, X, RefreshCw, Plus, Sparkles, Lightbulb
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Book Suggestion Modal State
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [sugTitle, setSugTitle] = useState('');
  const [sugAuthor, setSugAuthor] = useState('');
  const [sugIsbn, setSugIsbn] = useState('');
  const [sugReason, setSugReason] = useState('');
  const [sugMessage, setSugMessage] = useState('');

  // Fetch Student Borrowings
  const { data: borrowings = [], isLoading } = useQuery({
    queryKey: ['student-my-borrowings'],
    queryFn: async () => {
      const res = await api.get('/borrowings/my');
      return res.data;
    },
  });

  // Fetch Student Holds
  const { data: rawHolds = [], refetch: refetchHolds } = useQuery({
    queryKey: ['student-my-holds'],
    queryFn: async () => {
      const res = await api.get('/holds/my');
      return res.data;
    },
  });
  const myHolds = Array.isArray(rawHolds) ? rawHolds : [];

  // Fetch Student Book Suggestions
  const { data: rawSuggestions = [], refetch: refetchSuggestions } = useQuery({
    queryKey: ['student-my-suggestions'],
    queryFn: async () => {
      const res = await api.get('/book-suggestions/my');
      return res.data;
    },
  });
  const mySuggestions = Array.isArray(rawSuggestions) ? rawSuggestions : [];

  const cancelHoldMutation = useMutation({
    mutationFn: async (holdId: number) => {
      await api.delete(`/holds/${holdId}`);
    },
    onSuccess: () => {
      refetchHolds();
      queryClient.invalidateQueries({ queryKey: ['student-my-holds'] });
    },
  });

  // Submit Book Suggestion Mutation
  const createSuggestionMutation = useMutation({
    mutationFn: async () => {
      if (!sugTitle.trim() || !sugAuthor.trim()) {
        throw new Error('Title and Author are required');
      }
      const res = await api.post('/book-suggestions', {
        title: sugTitle,
        author: sugAuthor,
        isbn: sugIsbn,
        reason: sugReason,
      });
      return res.data;
    },
    onSuccess: () => {
      setSugTitle('');
      setSugAuthor('');
      setSugIsbn('');
      setSugReason('');
      setSugMessage('🎉 Book purchase suggestion submitted to the Library Acquisition team!');
      refetchSuggestions();
      queryClient.invalidateQueries({ queryKey: ['student-my-suggestions'] });
      setTimeout(() => {
        setIsSuggestModalOpen(false);
        setSugMessage('');
      }, 2000);
    },
    onError: (err: any) => {
      setSugMessage(err.message || err.response?.data?.message || 'Failed to submit request');
    },
  });

  const activeLoans = borrowings.filter((b: any) => b.status === 'ISSUED' || b.status === 'OVERDUE');
  const pastLoans = borrowings.filter((b: any) => b.status === 'RETURNED');
  const totalFine = borrowings.reduce((sum: number, b: any) => sum + (b.fineAmount || 0), 0);
  const overdueCount = borrowings.filter((b: any) => b.status === 'OVERDUE').length;

  const getBookTitle = (b: any) => b.copy?.book?.title || b.bookTitle || 'Book Title';
  const getBarcode = (b: any) => b.copy?.barcode || b.copyBarcode || 'N/A';
  const getIssueDate = (b: any) => (b.issueDate || b.borrowDate || '').split('T')[0] || '-';
  const getReturnDate = (b: any) => (b.returnDate || '').split('T')[0] || '-';

  // Flexible Urgent Due Date Calculation (<= 2 days remaining)
  const getDueInfo = (dueDateStr: string) => {
    if (!dueDateStr) return { isUrgent: false, dateOnly: '-', diffDays: 999 };
    const dateOnly = dueDateStr.split('T')[0];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dateOnly);
    due.setHours(0, 0, 0, 0);

    const diffMs = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
      dateOnly,
      diffDays,
      isUrgent: diffDays <= 2,
    };
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Student Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--card-border)' }}>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold px-2.5 py-1 rounded-md border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
              Student Member Portal
            </span>
            <h1 className="text-2xl font-black tracking-tight mt-2" style={{ color: 'var(--text-main)' }}>
              Welcome back, {user?.fullName || 'Student'}! 👋
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Track active check-outs, book holds, return history, and request new books for acquisition.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="px-4 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20"
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>Suggest New Book</span>
            </button>

            <div className="px-4 py-2 rounded-xl border text-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Active Loans</span>
              <span className="text-sm font-extrabold" style={{ color: 'var(--accent-color)' }}>{activeLoans.length} / 3</span>
            </div>
          </div>
        </div>

        {/* Stats Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl border flex items-center space-x-3" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Borrowings</span>
              <span className="text-base font-extrabold block" style={{ color: 'var(--text-main)' }}>{activeLoans.length}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border flex items-center space-x-3" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Book Holds</span>
              <span className="text-base font-extrabold block" style={{ color: 'var(--text-main)' }}>{myHolds.filter((h: any) => h.status === 'PENDING').length} Active</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border flex items-center space-x-3" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">My Book Requests</span>
              <span className="text-base font-extrabold block text-emerald-400">{mySuggestions.length} Total</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border flex items-center space-x-3" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Overdue Books</span>
              <span className="text-base font-extrabold block text-rose-500">{overdueCount}</span>
            </div>
          </div>
        </div>

        {/* Active Borrowings Cards */}
        <div className="clean-card p-6 space-y-4">
          <div className="flex items-center justify-between text-xs border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
            <span className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
              <Clock className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
              <span>Active Checked-Out Books ({activeLoans.length})</span>
            </span>
          </div>

          {activeLoans.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
              <p className="font-bold text-xs">No active checked-out books</p>
              <p className="text-[11px] text-slate-400">Browse the catalog to borrow books!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeLoans.map((b: any) => {
                const dueInfo = getDueInfo(b.dueDate);
                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl border space-y-3 relative text-xs"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm line-clamp-1" style={{ color: 'var(--text-main)' }}>{getBookTitle(b)}</h4>
                        <span className="font-mono text-[10px] text-emerald-400">Barcode: {getBarcode(b)}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                        b.status === 'OVERDUE' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="border-t pt-2 space-y-1 text-[11px]" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                      <div className="flex items-center justify-between">
                        <span>Issued Date:</span>
                        <span className="font-mono font-semibold">{getIssueDate(b)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Due Date:</span>
                        <span 
                          className={`font-extrabold ${dueInfo.isUrgent ? 'text-rose-500' : ''}`} 
                          style={!dueInfo.isUrgent ? { color: 'var(--accent-color)' } : {}}
                        >
                          {dueInfo.dateOnly}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* My Requested Books for Library Purchase */}
        <div className="clean-card p-6 space-y-4">
          <div className="flex items-center justify-between text-xs border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
            <span className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>My Requested Books for Library Acquisition ({mySuggestions.length})</span>
            </span>
            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Request a New Book
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" style={{ color: 'var(--text-main)' }}>
              <thead className="uppercase font-semibold text-[10px] border-b" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                <tr>
                  <th className="py-2.5 px-3">Requested Book</th>
                  <th className="py-2.5 px-3">Author</th>
                  <th className="py-2.5 px-3">Reason / Notes</th>
                  <th className="py-2.5 px-3">Submitted</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Librarian Note</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
                {mySuggestions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center" style={{ color: 'var(--text-muted)' }}>
                      You haven't requested any new books for library purchase yet.
                    </td>
                  </tr>
                ) : (
                  mySuggestions.map((sug: any) => (
                    <tr key={sug.id} className="hover:opacity-80 transition">
                      <td className="py-2.5 px-3 font-bold" style={{ color: 'var(--text-main)' }}>{sug.title}</td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--text-muted)' }}>{sug.author}</td>
                      <td className="py-2.5 px-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>{sug.reason || '-'}</td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--text-muted)' }}>
                        {sug.createdAt ? sug.createdAt.split('T')[0] : '-'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                          sug.status === 'ACQUIRED'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : sug.status === 'APPROVED'
                            ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                            : sug.status === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}>
                          {sug.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] font-mono text-slate-400">
                        {sug.adminComment || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Reserved Book Holds Queue */}
        <div className="clean-card p-6 space-y-4">
          <div className="flex items-center justify-between text-xs border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
            <span className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>My Reserved Book Holds ({myHolds.length})</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" style={{ color: 'var(--text-main)' }}>
              <thead className="uppercase font-semibold text-[10px] border-b" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                <tr>
                  <th className="py-2.5 px-3">Book Title</th>
                  <th className="py-2.5 px-3">Author</th>
                  <th className="py-2.5 px-3">Queue Position</th>
                  <th className="py-2.5 px-3">Request Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
                {myHolds.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center" style={{ color: 'var(--text-muted)' }}>
                      No active book hold reservations.
                    </td>
                  </tr>
                ) : (
                  myHolds.map((hold: any) => (
                    <tr key={hold.id} className="hover:opacity-80 transition">
                      <td className="py-2.5 px-3 font-semibold" style={{ color: 'var(--text-main)' }}>{hold.bookTitle}</td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--text-muted)' }}>{hold.bookAuthor}</td>
                      <td className="py-2.5 px-3 font-mono font-extrabold text-amber-400">
                        {hold.status === 'PENDING' ? `#${hold.queuePosition || 1} in line` : '-'}
                      </td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--text-muted)' }}>
                        {hold.requestDate ? hold.requestDate.split('T')[0] : '-'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                          hold.status === 'FULFILLED'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : hold.status === 'CANCELLED'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}>
                          {hold.status === 'FULFILLED' ? 'Ready for Pickup' : hold.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {hold.status === 'PENDING' && (
                          <button
                            onClick={() => cancelHoldMutation.mutate(hold.id)}
                            className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-bold"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Past Loans */}
        <div className="clean-card p-6 space-y-4">
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--text-main)' }}>Past Borrowing History ({pastLoans.length})</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" style={{ color: 'var(--text-main)' }}>
              <thead className="uppercase font-semibold text-[10px] border-b" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                <tr>
                  <th className="py-2.5 px-3">Book Title</th>
                  <th className="py-2.5 px-3">Barcode</th>
                  <th className="py-2.5 px-3">Borrowed Date</th>
                  <th className="py-2.5 px-3">Returned Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
                {pastLoans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center" style={{ color: 'var(--text-muted)' }}>
                      No returned borrowing history.
                    </td>
                  </tr>
                ) : (
                  pastLoans.map((b: any) => (
                    <tr key={b.id} className="hover:opacity-80 transition">
                      <td className="py-2.5 px-3 font-semibold" style={{ color: 'var(--text-main)' }}>{getBookTitle(b)}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold" style={{ color: 'var(--accent-color)' }}>{getBarcode(b)}</td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--text-muted)' }}>{getIssueDate(b)}</td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--text-muted)' }}>{getReturnDate(b)}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold border" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Suggest New Book Modal */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl relative"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Suggest a New Book for Library Acquisition</h3>
              </div>
              <button onClick={() => setIsSuggestModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {sugMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                sugMessage.includes('submitted') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {sugMessage}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Book Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Designing Data-Intensive Applications"
                  value={sugTitle}
                  onChange={(e) => setSugTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  style={{ borderColor: 'var(--card-border)' }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Author Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Martin Kleppmann"
                  value={sugAuthor}
                  onChange={(e) => setSugAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  style={{ borderColor: 'var(--card-border)' }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>ISBN (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 9781449373320"
                  value={sugIsbn}
                  onChange={(e) => setSugIsbn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  style={{ borderColor: 'var(--card-border)' }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Why should the library purchase this book? (Reason / Notes)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Recommended reading for CS401 Distributed Systems course"
                  value={sugReason}
                  onChange={(e) => setSugReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  style={{ borderColor: 'var(--card-border)' }}
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setIsSuggestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                  style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => createSuggestionMutation.mutate()}
                  disabled={createSuggestionMutation.isPending}
                  className="px-5 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20"
                >
                  {createSuggestionMutation.isPending ? 'Submitting...' : 'Submit Suggestion'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
