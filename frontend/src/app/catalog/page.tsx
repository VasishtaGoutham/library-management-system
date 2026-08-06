'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Search, BookOpen, Layers, QrCode, CheckCircle2, 
  XCircle, Filter, X, ChevronRight, Copy, Check, Tag, 
  Calendar, Globe, Bookmark, Star, MessageSquare, Send, Trash2, UserCheck
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

export default function CatalogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [search, setSearch] = useState('');
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
    : Array.isArray(rawBooks?.content)
    ? rawBooks.content
    : [];

  // Fetch Barcodes for selected modal book
  const { data: rawBookCopies } = useQuery({
    queryKey: ['book-copies', barcodeModalBook?.id],
    queryFn: async () => {
      if (!barcodeModalBook) return [];
      const res = await api.get(`/books/${barcodeModalBook.id}/copies`);
      return res.data;
    },
    enabled: !!barcodeModalBook,
  });
  const bookCopies = Array.isArray(rawBookCopies) ? rawBookCopies : [];

  // Fetch Reviews & Ratings for selected book
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
      if (!selectedBook) return;
      await api.delete(`/books/${selectedBook.id}/reviews/${reviewId}`);
    },
    onSuccess: () => {
      setReviewMessage('Review deleted.');
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
            className={`px-3.5 py-1.5 rounded-xl font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              selectedCategory === null ? 'text-white shadow-sm' : 'border opacity-80 hover:opacity-100'
            }`}
            style={{
              backgroundColor: selectedCategory === null ? 'var(--accent-color)' : 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: selectedCategory === null ? '#fff' : 'var(--text-main)',
            }}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap border ${
                selectedCategory === cat.id ? 'text-white shadow-sm' : 'opacity-80 hover:opacity-100'
              }`}
              style={{
                backgroundColor: selectedCategory === cat.id ? 'var(--accent-color)' : 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: selectedCategory === cat.id ? '#fff' : 'var(--text-main)',
              }}
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
          <div className="py-20 text-center space-y-3 border rounded-2xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <BookOpen className="w-12 h-12 mx-auto text-slate-500 opacity-50" />
            <h3 className="font-bold text-base">No books match your criteria</h3>
            <p className="text-xs text-slate-400">Try adjusting your search keywords or category filters.</p>
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
                        <BookOpen className="w-12 h-12 mx-auto mb-2 text-indigo-400 opacity-50" />
                        <span className="text-xs font-bold text-slate-400">{book.categoryName || 'General'}</span>
                      </div>
                    )}

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3">
                      {book.availableCopies > 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/90 text-white shadow-md backdrop-blur-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {book.availableCopies} Available
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/90 text-white shadow-md backdrop-blur-md flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Checked Out
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      <span className="font-semibold text-emerald-400">{book.categoryName || 'General'}</span>
                      <span className="font-mono">ISBN: {book.isbn}</span>
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
              onClick={() => {
                setSelectedBook(null);
                setReviewMessage(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5 border-b pb-4" style={{ borderColor: 'var(--card-border)' }}>
              <div className="w-24 h-32 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 border" style={{ borderColor: 'var(--card-border)' }}>
                {selectedBook.coverImageUrl ? (
                  <img src={selectedBook.coverImageUrl} alt={selectedBook.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-8 h-8 text-slate-500" /></div>
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {selectedBook.categoryName || 'General'}
                </span>
                <h2 className="text-lg font-extrabold">{selectedBook.title}</h2>
                <p className="text-xs text-slate-400">by <strong className="text-white">{selectedBook.author}</strong></p>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1 font-mono">
                  <span>ISBN: {selectedBook.isbn}</span>
                  <span>Year: {selectedBook.publicationYear || '2026'}</span>
                  <span>Lang: {selectedBook.language || 'English'}</span>
                </div>
              </div>
            </div>

            {/* Ratings & Reviews Section */}
            <div className="space-y-4">
              
              {/* Rating Header */}
              <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border" style={{ borderColor: 'var(--card-border)' }}>
                <div>
                  <h3 className="font-bold text-xs flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Student Ratings & Community Reviews</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {ratingSummary?.totalReviews || 0} Total Reviews
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400">{ratingSummary?.averageRating || 0.0}</span>
                  <span className="text-xs text-slate-400 font-bold"> / 5.0</span>
                </div>
              </div>

              {/* Notification Banner */}
              {reviewMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                  <span>{reviewMessage}</span>
                  <button onClick={() => setReviewMessage(null)} className="font-bold">×</button>
                </div>
              )}

              {/* Write Review Form */}
              {user && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitReviewMutation.mutate();
                  }}
                  className="p-4 rounded-xl border space-y-3"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Rate this book:</span>
                    
                    {/* Star Rating Input */}
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setUserRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition hover:scale-125"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= (hoverRating || userRating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Write your review or feedback for fellow students..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border text-xs focus:outline-none"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />

                  <button
                    type="submit"
                    disabled={submitReviewMutation.isPending}
                    className="w-full py-2 rounded-xl text-xs font-bold text-white transition flex items-center justify-center space-x-2 shadow-md bg-amber-500 hover:bg-amber-400"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Student Review</span>
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {(!ratingSummary?.reviews || !Array.isArray(ratingSummary.reviews) || ratingSummary.reviews.length === 0) ? (
                  <p className="text-center py-6 text-xs text-slate-500">No student reviews yet. Be the first to leave a review!</p>
                ) : (
                  ratingSummary.reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-xl border space-y-1.5 text-xs" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                            {rev.studentName ? rev.studentName[0].toUpperCase() : 'S'}
                          </div>
                          <span className="font-bold text-slate-200">{rev.studentName}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                              />
                            ))}
                          </div>

                          {(user?.id === rev.studentId || user?.role === 'ROLE_ADMIN') && (
                            <button
                              onClick={() => deleteReviewMutation.mutate(rev.id)}
                              className="text-slate-500 hover:text-rose-500 p-0.5"
                              title="Delete Review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-300 leading-relaxed text-[11px]">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Barcode Modal */}
      {barcodeModalBook && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <button onClick={() => setBarcodeModalBook(null)} className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <QrCode className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
              <span>Physical Barcodes for "{barcodeModalBook.title}"</span>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {bookCopies.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No copies registered.</p>
              ) : (
                bookCopies.map((copy: any) => (
                  <div key={copy.id} className="p-3 rounded-xl border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                    <div>
                      <span className="font-mono font-bold text-emerald-400">{copy.barcode}</span>
                      <span className="block text-[10px] text-slate-400">Rack: {copy.rackLocation || 'Shelf A1'}</span>
                    </div>

                    <button
                      onClick={() => handleCopyBarcode(copy.barcode)}
                      className="px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 hover:opacity-80"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                    >
                      {copiedBarcode === copy.barcode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
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
