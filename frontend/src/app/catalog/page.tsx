'use client';

import { useState, useEffect, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Search, BookOpen, Layers, QrCode, CheckCircle2, 
  XCircle, Filter, X, ChevronRight, Copy, Check, Tag, 
  Calendar, Globe, Bookmark, Star, MessageSquare, Send, Trash2, UserCheck, Lightbulb
} from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  edition?: string;
  publicationYear?: number;
  language?: string;
  description?: string;
  coverImageUrl?: string;
  categoryId?: number;
  categoryName?: string;
  totalCopies: number;
  availableCopies: number;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Review {
  id: number;
  bookId: number;
  studentId: number;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface BookRatingSummary {
  bookId: number;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const initialSearch = searchParams?.get('search') || '';
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    const q = searchParams?.get('search');
    if (q !== null && q !== undefined) {
      setSearch(q);
    }
  }, [searchParams]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [barcodeModalBook, setBarcodeModalBook] = useState<Book | null>(null);
  const [copiedBarcode, setCopiedBarcode] = useState<string | null>(null);

  // Review Form State
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  // Fetch Categories
  const { data: rawCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });
  const categories: Category[] = Array.isArray(rawCategories) ? rawCategories : [];

  // Fetch Books
  const { data: rawBooks, isLoading: isLoadingBooks } = useQuery({
    queryKey: ['books', selectedCategory, search],
    queryFn: async () => {
      let url = '/books?size=500';
      if (selectedCategory) url += `&categoryId=${selectedCategory}`;
      if (search) url += `&query=${encodeURIComponent(search)}`;

      const res = await api.get(url);
      return res.data;
    },
  });
  const books: Book[] = Array.isArray(rawBooks)
    ? rawBooks
    : (rawBooks?.content || []);

  // Fetch Physical Book Copies
  const { data: bookCopies = [], isLoading: isLoadingCopies } = useQuery({
    queryKey: ['book-copies', barcodeModalBook?.id],
    queryFn: async () => {
      if (!barcodeModalBook) return [];
      const res = await api.get(`/books/${barcodeModalBook.id}/copies`);
      return res.data;
    },
    enabled: !!barcodeModalBook,
  });

  // Fetch Book Rating & Reviews
  const { data: ratingSummary, refetch: refetchReviews } = useQuery<BookRatingSummary>({
    queryKey: ['book-reviews', selectedBook?.id],
    queryFn: async () => {
      if (!selectedBook) return { bookId: 0, averageRating: 0, totalReviews: 0, reviews: [] };
      const res = await api.get(`/books/${selectedBook.id}/reviews`);
      return res.data;
    },
    enabled: !!selectedBook,
  });

  // Submit Review Mutation
  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      if (!selectedBook) return;
      if (!userComment.trim()) throw new Error('Please write a short review comment');
      const res = await api.post(`/books/${selectedBook.id}/reviews`, {
        rating: userRating,
        comment: userComment,
      });
      return res.data;
    },
    onSuccess: () => {
      setUserComment('');
      setReviewMessage('Thank you! Your review has been published.');
      refetchReviews();
      queryClient.invalidateQueries({ queryKey: ['book-reviews'] });
    },
    onError: (err: any) => {
      setReviewMessage(err.message || err.response?.data?.message || 'Failed to submit review');
    },
  });

  // Request Hold Reservation Mutation
  const requestHoldMutation = useMutation({
    mutationFn: async (bookId: number) => {
      const res = await api.post(`/holds/${bookId}`);
      return res.data;
    },
    onSuccess: (data) => {
      alert(`🎉 Hold request confirmed! You are #${data.queuePosition} in line for "${data.bookTitle}". You will receive an automated email when ready for pickup.`);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to place hold request');
    },
  });

  // Delete Review Mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      await api.delete(`/reviews/${reviewId}`);
    },
    onSuccess: () => {
      refetchReviews();
      queryClient.invalidateQueries({ queryKey: ['book-reviews'] });
    },
  });

  const handleCopyBarcode = (barcode: string) => {
    navigator.clipboard.writeText(barcode);
    setCopiedBarcode(barcode);
    setTimeout(() => setCopiedBarcode(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: 'var(--card-border)' }}>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6" style={{ color: 'var(--accent-color)' }} />
              <span>Library Catalog</span>
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Explore over {books.length} books across 10 categories with real-time physical barcode availability & student ratings.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none shadow-sm transition"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 shrink-0 ${
              selectedCategory === null ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'hover:opacity-80'
            }`}
            style={selectedCategory !== null ? { backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--card-border)' } : {}}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-medium transition shrink-0 ${
                selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'hover:opacity-80'
              }`}
              style={selectedCategory !== cat.id ? { backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' } : {}}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {isLoadingBooks ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 rounded-2xl border animate-pulse" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}></div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="py-16 text-center space-y-4 border rounded-2xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <BookOpen className="w-12 h-12 mx-auto text-indigo-400 opacity-80" />
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-main)' }}>No books match your search criteria</h3>
              <p className="text-xs text-slate-400 mt-1">Can't find the book you are looking for in the library?</p>
            </div>

            <a
              href="/student/dashboard"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20"
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>Request Book for Library Purchase</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="border rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              >
                <div>
                  {/* Book Cover Image */}
                  <div className="h-52 w-full relative bg-slate-950 overflow-hidden flex items-center justify-center">
                    {book.coverImageUrl ? (
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                        <span className="text-[10px] text-slate-500 font-mono">No Image Available</span>
                      </div>
                    )}

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3">
                      {book.availableCopies > 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/90 text-white shadow-md backdrop-blur-md flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{book.availableCopies} AVAILABLE</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/90 text-white shadow-md backdrop-blur-md flex items-center space-x-1">
                          <XCircle className="w-3 h-3" />
                          <span>OUT OF STOCK</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Book Info Header */}
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      <span className="font-semibold text-emerald-400">{book.categoryName || 'General'}</span>
                      <span className="font-mono text-[10px]">ISBN: {book.isbn}</span>
                    </div>

                    <h2 className="font-bold text-sm line-clamp-1 group-hover:text-indigo-400 transition" style={{ color: 'var(--text-main)' }}>
                      {book.title}
                    </h2>

                    <p className="text-xs line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                      by <strong className="font-semibold">{book.author}</strong>
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--card-border)' }}>
                  <div className="flex items-center justify-between text-xs">
                    {/* View Details / Reviews Button */}
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="text-xs font-bold transition flex items-center space-x-1 hover:underline"
                      style={{ color: 'var(--accent-color)' }}
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Details & Reviews</span>
                    </button>

                    {book.availableCopies === 0 ? (
                      <button
                        onClick={() => requestHoldMutation.mutate(book.id)}
                        disabled={requestHoldMutation.isPending}
                        className="px-2.5 py-1 rounded-lg border text-[11px] font-bold text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 transition flex items-center space-x-1"
                        title="Request a hold reservation for this book"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Request Hold</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setBarcodeModalBook(book)}
                        className="p-1.5 rounded-lg border text-slate-400 hover:text-white transition flex items-center space-x-1 text-[11px]"
                        style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}
                        title="View Barcodes"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Barcodes</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Book Details & Student Reviews Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8 relative" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white transition"
              style={{ backgroundColor: 'var(--bg-color)' }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Details */}
            <div className="flex items-start space-x-4 border-b pb-4" style={{ borderColor: 'var(--card-border)' }}>
              {selectedBook.coverImageUrl && (
                <img src={selectedBook.coverImageUrl} alt={selectedBook.title} className="w-20 h-28 object-cover rounded-xl shadow-md shrink-0" />
              )}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {selectedBook.categoryName}
                </span>
                <h3 className="font-extrabold text-lg" style={{ color: 'var(--text-main)' }}>{selectedBook.title}</h3>
                <p className="text-xs text-slate-400">by <strong>{selectedBook.author}</strong></p>
                <div className="flex items-center space-x-2 text-xs pt-1">
                  <div className="flex items-center text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 mr-1" />
                    <span>{ratingSummary?.averageRating ? ratingSummary.averageRating.toFixed(1) : 'No Ratings'}</span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{ratingSummary?.totalReviews || 0} Student Reviews</span>
                </div>
              </div>
            </div>

            {/* Submit Review Box */}
            {user ? (
              <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                <h4 className="font-bold text-xs flex items-center space-x-1.5" style={{ color: 'var(--text-main)' }}>
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Write a Student Review & Rating</span>
                </h4>

                {reviewMessage && (
                  <p className={`text-xs font-bold ${reviewMessage.includes('Thank') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {reviewMessage}
                  </p>
                )}

                {/* Interactive Star Selector */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          (hoverRating || userRating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-400 ml-2">{userRating} / 5 Stars</span>
                </div>

                <div className="flex items-center space-x-2">
                  <textarea
                    rows={2}
                    placeholder="Share your thoughts about this book..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                  <button
                    onClick={() => submitReviewMutation.mutate()}
                    disabled={submitReviewMutation.isPending}
                    className="px-4 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center space-x-1 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Please log in to write a review.</p>
            )}

            {/* Community Reviews List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Student Reviews</h4>
              {ratingSummary?.reviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No reviews yet. Be the first student to review this book!</p>
              ) : (
                ratingSummary?.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl border text-xs space-y-1 relative" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: 'var(--text-main)' }}>{rev.studentName}</span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{rev.comment}</p>

                    {user && (user.id === rev.studentId || user.role === 'ROLE_ADMIN') && (
                      <button
                        onClick={() => deleteReviewMutation.mutate(rev.id)}
                        className="text-[10px] text-rose-400 hover:underline flex items-center space-x-0.5 pt-1 font-semibold"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {barcodeModalBook && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{barcodeModalBook.title}</h3>
                <span className="text-xs text-slate-400">Physical Shelf Copies & Barcodes</span>
              </div>
              <button onClick={() => setBarcodeModalBook(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {isLoadingCopies ? (
                <p className="text-xs text-slate-400 py-4 text-center">Loading barcodes...</p>
              ) : bookCopies.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No physical copy barcodes generated yet.</p>
              ) : (
                bookCopies.map((copy: any) => (
                  <div
                    key={copy.id}
                    className="p-3 rounded-xl border flex items-center justify-between text-xs"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-4 h-4 text-indigo-400" />
                        <span className="font-mono font-bold tracking-wide" style={{ color: 'var(--accent-color)' }}>
                          {copy.barcode}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold mt-1 inline-block ${
                        copy.status === 'AVAILABLE' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        Status: {copy.status}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyBarcode(copy.barcode)}
                      className="p-2 rounded-lg border text-slate-300 hover:text-white transition flex items-center space-x-1 text-[11px]"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                    >
                      {copiedBarcode === copy.barcode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedBarcode === copy.barcode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: 'var(--bg-color)' }}>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
          <div className="h-20 rounded-xl bg-slate-800/50"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-xl bg-slate-800/50"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
