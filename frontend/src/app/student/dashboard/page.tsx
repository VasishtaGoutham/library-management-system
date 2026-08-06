'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  BookOpen, Clock, AlertTriangle, DollarSign, CheckCircle2, 
  Calendar, Barcode, BookMarked
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user } = useAuthStore();

  // Fetch Student Borrowings
  const { data: borrowings = [], isLoading } = useQuery({
    queryKey: ['student-my-borrowings'],
    queryFn: async () => {
      const res = await api.get('/borrowings/my');
      return res.data;
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
        <div className="p-8 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-color)' }}>Student Portal</span>
            <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>
              Welcome, {user?.fullName || 'Student'} 👋
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Track your active book loans, return due dates, and fine summary.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="clean-card px-4 py-2.5 text-center min-w-[100px]">
              <span className="text-[10px] font-medium uppercase block" style={{ color: 'var(--text-muted)' }}>Active Loans</span>
              <span className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>{activeLoans.length}</span>
            </div>

            <div className="clean-card px-4 py-2.5 text-center min-w-[100px]">
              <span className="text-[10px] font-medium uppercase block" style={{ color: 'var(--text-muted)' }}>Overdue</span>
              <span className="text-lg font-bold text-amber-500">{overdueCount}</span>
            </div>

            <div className="clean-card px-4 py-2.5 text-center min-w-[100px]">
              <span className="text-[10px] font-medium uppercase block" style={{ color: 'var(--text-muted)' }}>Total Fine</span>
              <span className="text-lg font-bold text-rose-500">${totalFine.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Active Loans */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--text-main)' }}>Currently Borrowed Books ({activeLoans.length})</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-36 rounded-2xl animate-pulse border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}></div>
              <div className="h-36 rounded-2xl animate-pulse border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}></div>
            </div>
          ) : activeLoans.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border space-y-2" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <BookMarked className="w-8 h-8 mx-auto opacity-50" style={{ color: 'var(--text-muted)' }} />
              <h3 className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>No Active Loans</h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Visit the catalog to browse and borrow books.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLoans.map((loan: any) => {
                const isOverdue = loan.status === 'OVERDUE';
                const dueInfo = getDueInfo(loan.dueDate);

                return (
                  <div 
                    key={loan.id} 
                    className={`clean-card p-5 space-y-3 transition ${
                      dueInfo.isUrgent ? 'border-rose-500/50 shadow-rose-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isOverdue || dueInfo.diffDays < 0
                                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            }`}
                          >
                            {loan.status}
                          </span>

                          {dueInfo.isUrgent && dueInfo.diffDays >= 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30 animate-pulse">
                              ⚠️ Due in {dueInfo.diffDays} {dueInfo.diffDays === 1 ? 'Day' : 'Days'}!
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold pt-1" style={{ color: 'var(--text-main)' }}>{getBookTitle(loan)}</h3>
                        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Barcode: {getBarcode(loan)}</p>
                      </div>

                      {loan.fineAmount > 0 && (
                        <div className="text-right">
                          <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Fine</span>
                          <span className="text-base font-bold text-rose-500">${loan.fineAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs" style={{ borderColor: 'var(--card-border)' }}>
                      <div>
                        <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Borrowed Date</span>
                        <span className="font-medium" style={{ color: 'var(--text-main)' }}>{getIssueDate(loan)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Return Due Date</span>
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
    </div>
  );
}
