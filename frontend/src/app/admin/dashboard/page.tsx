'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import BarcodeScannerModal from '@/components/BarcodeScannerModal';
import { 
  BookOpen, Plus, ScanLine, ArrowDownLeft, ArrowUpRight, 
  DollarSign, AlertTriangle, Layers, Library, CheckCircle2, 
  X, Barcode, ShieldCheck, RefreshCw, UserCheck, Calendar, Tag, Globe, Bookmark, FileSpreadsheet, Printer, Mail
} from 'lucide-react';

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [activeScanner, setActiveScanner] = useState<'issue' | 'return' | null>(null);

  // Form states (Comprehensive 11 Fields)
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publisher, setPublisher] = useState('');
  const [edition, setEdition] = useState('');
  const [publicationYear, setPublicationYear] = useState<number | ''>(2024);
  const [language, setLanguage] = useState('English');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [initialCopies, setInitialCopies] = useState<number>(1);

  // Category creation states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  // Issue/Return states
  const [issueStudentId, setIssueStudentId] = useState<number>(2);
  const [issueBarcode, setIssueBarcode] = useState('');
  const [borrowDays, setBorrowDays] = useState<number>(14);
  const [returnBarcode, setReturnBarcode] = useState('');

  // Notifications
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Export handlers
  const handleExportCsv = async () => {
    try {
      const res = await api.get('/reports/circulation/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'circulation_history_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage({ text: 'Exported Circulation History to CSV!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to export CSV report', type: 'error' });
    }
  };

  const handlePrintPdfReport = async () => {
    try {
      const res = await api.get('/reports/circulation/html');
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(res.data);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
      }
    } catch {
      setMessage({ text: 'Failed to generate printable report', type: 'error' });
    }
  };

  // Dashboard Stats Query
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard-summary'],
    queryFn: async () => {
      const res = await api.get('/dashboard/summary');
      return res.data;
    },
  });

  // Categories Query
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  // Students Query
  const { data: students = [] } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const res = await api.get('/auth/students');
      return res.data;
    },
  });

  // Borrowings Log Query
  const { data: borrowings = [] } = useQuery({
    queryKey: ['admin-borrowings'],
    queryFn: async () => {
      const res = await api.get('/borrowings');
      return res.data;
    },
  });

  // Add Category Mutation
  const addCategoryMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/categories', {
        name: newCategoryName,
        description: newCategoryDesc,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-summary'] });
      setCategoryId(data.id);
      setIsAddCategoryOpen(false);
      setNewCategoryName('');
      setNewCategoryDesc('');
      setMessage({ text: `Created new category "${data.name}"!`, type: 'success' });
    },
    onError: (err: any) => {
      setMessage({ text: err.response?.data?.message || 'Failed to create category', type: 'error' });
    },
  });

  // Add Book Mutation
  const addBookMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/books?initialCopies=${initialCopies}`, {
        title, author, isbn, publisher, edition, 
        publicationYear: publicationYear ? Number(publicationYear) : undefined, 
        language, description, coverImageUrl, categoryId,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsAddBookOpen(false);
      setMessage({ text: `Added "${data.title}" with ${initialCopies} barcode copies!`, type: 'success' });
      setTitle(''); setAuthor(''); setIsbn(''); setPublisher(''); setEdition(''); setDescription(''); setCoverImageUrl('');
    },
    onError: (err: any) => {
      setMessage({ text: err.response?.data?.message || 'Failed to create book', type: 'error' });
    },
  });

  // Issue Book Mutation
  const issueMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/borrowings', {
        studentId: issueStudentId,
        barcode: issueBarcode,
        borrowDays: borrowDays,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin-borrowings'] });
      setIsIssueModalOpen(false);
      const dueDateStr = data.dueDate ? data.dueDate.split('T')[0] : '';
      setMessage({ text: `Issued barcode "${issueBarcode}" for ${borrowDays} days! Automated Email Notification Sent. 📧`, type: 'success' });
      setIssueBarcode('');
    },
    onError: (err: any) => {
      setMessage({ text: err.response?.data?.message || 'Failed to issue book', type: 'error' });
    },
  });

  // Return Book Mutation
  const returnMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put('/borrowings/return', {
        barcode: returnBarcode,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin-borrowings'] });
      setIsReturnModalOpen(false);
      const fineMsg = data.fineAmount > 0 ? ` (Fine assessed: $${data.fineAmount.toFixed(2)})` : '';
      setMessage({ text: `Returned barcode "${returnBarcode}"!${fineMsg} Automated Return Email Sent. 📧`, type: 'success' });
      setReturnBarcode('');
    },
    onError: (err: any) => {
      setMessage({ text: err.response?.data?.message || 'Failed to return book', type: 'error' });
    },
  });

  const getBookTitle = (b: any) => b.copy?.book?.title || b.bookTitle || 'Book Title';
  const getBarcode = (b: any) => b.copy?.barcode || b.copyBarcode || 'N/A';
  const getStudentName = (b: any) => b.student?.fullName || b.studentName || 'Student';
  const getIssueDate = (b: any) => (b.issueDate || b.borrowDate || '').split('T')[0] || '-';

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Header & Quick Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border transition-colors duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="space-y-1">
            <h1 className="text-xl font-bold flex items-center space-x-2" style={{ color: 'var(--text-main)' }}>
              <ShieldCheck className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
              <span>Librarian Console</span>
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manage catalog inventory, check-outs, check-ins, categories, automated emails, and export reports.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-xl border text-xs font-semibold transition flex items-center space-x-1.5"
              style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
              title="Export Circulation & Fines to CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>CSV Report</span>
            </button>

            <button
              onClick={handlePrintPdfReport}
              className="px-3 py-2 rounded-xl border text-xs font-semibold transition flex items-center space-x-1.5"
              style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
              title="Print Official PDF Report"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Print Report</span>
            </button>

            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Issue Book</span>
            </button>

            <button
              onClick={() => setIsReturnModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-sm"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Return Book</span>
            </button>

            <button
              onClick={() => setIsAddBookOpen(true)}
              className="px-3.5 py-2 rounded-xl border text-xs font-semibold transition"
              style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
            >
              <Plus className="w-4 h-4 inline mr-1" />
              <span>Add Book</span>
            </button>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="p-1 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 6 Metric Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="clean-card p-4 space-y-1">
            <span className="text-[11px] font-medium block" style={{ color: 'var(--text-muted)' }}>Total Titles</span>
            <p className="text-xl font-extrabold" style={{ color: 'var(--text-main)' }}>{stats?.totalBooks || 0}</p>
          </div>

          <div className="clean-card p-4 space-y-1">
            <span className="text-[11px] font-medium block" style={{ color: 'var(--text-muted)' }}>Physical Copies</span>
            <p className="text-xl font-extrabold" style={{ color: 'var(--text-main)' }}>{stats?.totalCopies || 0}</p>
          </div>

          <div className="clean-card p-4 space-y-1">
            <span className="text-[11px] font-medium block" style={{ color: 'var(--text-muted)' }}>Issued</span>
            <p className="text-xl font-extrabold text-emerald-500">{stats?.totalIssued || 0}</p>
          </div>

          <div className="clean-card p-4 space-y-1">
            <span className="text-[11px] font-medium block" style={{ color: 'var(--text-muted)' }}>Overdue</span>
            <p className="text-xl font-extrabold text-amber-500">{stats?.totalOverdue || 0}</p>
          </div>

          <div className="clean-card p-4 space-y-1">
            <span className="text-[11px] font-medium block" style={{ color: 'var(--text-muted)' }}>Unpaid Fines</span>
            <p className="text-xl font-extrabold text-rose-500">${(stats?.totalUnpaidFines || stats?.totalFinesCollected || 0).toFixed(2)}</p>
          </div>

          <div className="clean-card p-4 space-y-1">
            <span className="text-[11px] font-medium block" style={{ color: 'var(--text-muted)' }}>Categories</span>
            <p className="text-xl font-extrabold" style={{ color: 'var(--text-main)' }}>{categories.length}</p>
          </div>
        </div>

        {/* Borrowings Log Table */}
        <div className="clean-card p-6 space-y-4">
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--text-main)' }}>Circulation History Log</span>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                <Mail className="w-3.5 h-3.5" /> Automated Email Service Active
              </span>
              <span>•</span>
              <span>{borrowings.length} Total Records</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" style={{ color: 'var(--text-main)' }}>
              <thead className="uppercase font-semibold text-[10px] border-b" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                <tr>
                  <th className="py-2.5 px-3">Borrow ID</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Book Title</th>
                  <th className="py-2.5 px-3">Barcode</th>
                  <th className="py-2.5 px-3">Issue Date</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
                {borrowings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center" style={{ color: 'var(--text-muted)' }}>
                      No borrowings recorded.
                    </td>
                  </tr>
                ) : (
                  borrowings.map((b: any) => (
                    <tr key={b.id} className="hover:opacity-80 transition">
                      <td className="py-2.5 px-3 font-mono" style={{ color: 'var(--text-muted)' }}>#{b.id}</td>
                      <td className="py-2.5 px-3 font-semibold" style={{ color: 'var(--text-main)' }}>{getStudentName(b)}</td>
                      <td className="py-2.5 px-3">{getBookTitle(b)}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold" style={{ color: 'var(--accent-color)' }}>{getBarcode(b)}</td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--text-muted)' }}>{getIssueDate(b)}</td>
                      <td className="py-2.5 px-3 font-bold" style={{ color: 'var(--accent-color)' }}>{b.dueDate?.split('T')[0]}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'ISSUED'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : b.status === 'OVERDUE'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {b.fineAmount > 0 ? (
                          <span className="text-rose-500 font-bold">${b.fineAmount.toFixed(2)}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>$0.00</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Book Modal (Full 11 Fields) */}
      {isAddBookOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 border space-y-4 relative shadow-xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center justify-between border-b pb-3 sticky top-0 backdrop-blur-md z-10" style={{ borderColor: 'var(--card-border)' }}>
              <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Add New Book to Inventory</span>
              </h3>
              <button onClick={() => { setIsAddBookOpen(false); setIsAddCategoryOpen(false); }} style={{ color: 'var(--text-muted)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addBookMutation.mutate();
              }}
              className="space-y-3.5 text-xs"
            >
              {/* 1. Book Title */}
              <div>
                <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>1. Book Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Clean Code: Refactoring & Testing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border rounded-xl px-3.5 py-2 focus:outline-none"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                />
              </div>

              {/* 2 & 3. Author & ISBN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>2. Author *</label>
                  <input
                    type="text"
                    placeholder="e.g. Robert C. Martin"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="w-full border rounded-xl px-3.5 py-2 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>3. ISBN Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. 9780132350884"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    required
                    className="w-full border rounded-xl px-3.5 py-2 font-mono focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              {/* 4. Category & Custom Category Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold" style={{ color: 'var(--text-muted)' }}>4. Category *</label>
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(!isAddCategoryOpen)}
                    className="text-[10px] font-semibold text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isAddCategoryOpen ? 'Cancel' : 'Create Custom Category'}</span>
                  </button>
                </div>

                {isAddCategoryOpen ? (
                  <div className="p-3 rounded-xl border space-y-2" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                    <span className="font-semibold block text-[11px] text-indigo-400 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Add New Category
                    </span>
                    <input
                      type="text"
                      placeholder="Category Name (e.g. History, Medicine, Art)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={newCategoryDesc}
                      onChange={(e) => setNewCategoryDesc(e.target.value)}
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                    />
                    <button
                      type="button"
                      disabled={!newCategoryName.trim() || addCategoryMutation.isPending}
                      onClick={() => addCategoryMutation.mutate()}
                      className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition disabled:opacity-50"
                    >
                      {addCategoryMutation.isPending ? 'Saving...' : 'Save & Select Category'}
                    </button>
                  </div>
                ) : (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full border rounded-xl px-3.5 py-2 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  >
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* 5 & 6. Publisher & Edition */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>5. Publisher</label>
                  <input
                    type="text"
                    placeholder="e.g. Prentice Hall"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full border rounded-xl px-3.5 py-2 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>6. Edition</label>
                  <input
                    type="text"
                    placeholder="e.g. 1st Edition / Revised"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    className="w-full border rounded-xl px-3.5 py-2 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              {/* 7, 8 & 9. Publication Year, Language & Copies */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>7. Year</label>
                  <input
                    type="number"
                    placeholder="2024"
                    value={publicationYear}
                    onChange={(e) => setPublicationYear(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full border rounded-xl px-3 py-2 font-mono focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>8. Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border rounded-xl px-2.5 py-2 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>9. Copies *</label>
                  <input
                    type="number"
                    min={1}
                    value={initialCopies}
                    onChange={(e) => setInitialCopies(Number(e.target.value))}
                    required
                    className="w-full border rounded-xl px-3 py-2 font-bold focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              {/* 10. Description */}
              <div>
                <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>10. Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary or overview of the book..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2 focus:outline-none"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                />
              </div>

              {/* 11. Cover Image URL */}
              <div>
                <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>11. Cover Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/cover.jpg"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2 focus:outline-none font-mono"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                />
              </div>

              <button
                type="submit"
                disabled={addBookMutation.isPending}
                className="w-full py-3 rounded-xl text-white font-medium transition disabled:opacity-50 mt-2 shadow-md"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                {addBookMutation.isPending ? 'Saving & Generating Barcodes...' : 'Add Book'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl p-6 border space-y-4 relative shadow-xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Issue Book Copy (Check-Out)</h3>
              <button onClick={() => setIsIssueModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                issueMutation.mutate();
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block mb-1" style={{ color: 'var(--text-muted)' }}>Select Registered Student</label>
                <select
                  value={issueStudentId}
                  onChange={(e) => setIssueStudentId(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                >
                  {students.length > 0 ? (
                    students.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.email})
                      </option>
                    ))
                  ) : (
                    <option value={2}>Alex Johnson (student@library.com)</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block mb-1" style={{ color: 'var(--text-muted)' }}>Barcode Tag</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. LIB-5665-001"
                    value={issueBarcode}
                    onChange={(e) => setIssueBarcode(e.target.value)}
                    required
                    className="flex-1 border rounded-lg px-3 py-2 font-mono focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveScanner('issue')}
                    className="px-3 py-2 rounded-lg border text-xs font-semibold flex items-center space-x-1"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--accent-color)' }}
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Scan</span>
                  </button>
                </div>
              </div>

              {/* Flexible Due Days Selector */}
              <div className="p-3.5 rounded-xl border space-y-2" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                    <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
                    <span>Borrow Duration:</span>
                  </span>
                  <span className="font-bold text-sm px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--accent-color)' }}>
                    {borrowDays} {borrowDays === 1 ? 'Day' : 'Days'}
                  </span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={14}
                  value={borrowDays}
                  onChange={(e) => setBorrowDays(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[1, 3, 7, 14].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setBorrowDays(day)}
                      className="py-1 rounded-lg text-[11px] font-semibold border transition text-center"
                      style={{
                        backgroundColor: borrowDays === day ? 'var(--accent-color)' : 'var(--card-bg)',
                        borderColor: 'var(--card-border)',
                        color: borrowDays === day ? '#ffffff' : 'var(--text-main)',
                      }}
                    >
                      {day} {day === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={issueMutation.isPending}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition disabled:opacity-50"
              >
                {issueMutation.isPending ? 'Processing...' : `Confirm Check-Out (${borrowDays} Days)`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Return Book Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl p-6 border space-y-4 relative shadow-xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Return Book Copy (Check-In)</h3>
              <button onClick={() => setIsReturnModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                returnMutation.mutate();
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block mb-1" style={{ color: 'var(--text-muted)' }}>Barcode Tag</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. LIB-5665-001"
                    value={returnBarcode}
                    onChange={(e) => setReturnBarcode(e.target.value)}
                    required
                    className="flex-1 border rounded-lg px-3 py-2 font-mono focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveScanner('return')}
                    className="px-3 py-2 rounded-lg border text-xs font-semibold flex items-center space-x-1"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--accent-color)' }}
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Scan</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={returnMutation.isPending}
                className="w-full py-2.5 rounded-lg text-white font-medium transition disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                {returnMutation.isPending ? 'Processing...' : 'Process Return'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Scanner */}
      <BarcodeScannerModal
        isOpen={activeScanner !== null}
        onClose={() => setActiveScanner(null)}
        onScanSuccess={(scannedCode) => {
          if (activeScanner === 'issue') setIssueBarcode(scannedCode);
          if (activeScanner === 'return') setReturnBarcode(scannedCode);
        }}
      />
    </div>
  );
}
