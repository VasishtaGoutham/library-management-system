'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Search, BookOpen, Layers, QrCode, CheckCircle2, 
  XCircle, Filter, X, ChevronRight, Copy, Check, Tag, Calendar, Globe, Bookmark
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

export default function CatalogPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [barcodeModalBook, setBarcodeModalBook] = useState<Book | null>(null);
  const [copiedBarcode, setCopiedBarcode] = useState<string | null>(null);

  // Authentication Guard: Redirect to /login if guest
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token && !user) {
      router.push('/login');
    }
  }, [user, router]);

  // Fetch Categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  // Fetch Books
  const { data: booksData, isLoading, error } = useQuery({
    queryKey: ['books', search, selectedCategory],
    queryFn: async () => {
      const params: any = { page: 0, size: 20 };
      if (search) params.query = search;
      if (selectedCategory !== null) params.categoryId = selectedCategory;

      const res = await api.get('/books', { params });
      return res.data;
    },
  });

  // Fetch Barcode Copies for Modal
  const { data: bookCopies = [], isLoading: isLoadingCopies } = useQuery({
    queryKey: ['book-copies', barcodeModalBook?.id],
    queryFn: async () => {
      if (!barcodeModalBook) return [];
      const res = await api.get(`/books/${barcodeModalBook.id}/copies`);
      return res.data;
    },
    enabled: !!barcodeModalBook,
  });

  const books: Book[] = booksData?.content || [];

  const handleCopyBarcode = (barcode: string) => {
    navigator.clipboard.writeText(barcode);
    setCopiedBarcode(barcode);
    setTimeout(() => setCopiedBarcode(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Header & Search Bar */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-main)' }}>
            Explore Library Catalog
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            Browse physical book titles, filter by categories, check real-time availability, and view copy barcodes.
          </p>

          <div className="relative mt-4">
            <Search className="absolute left-4 top-3.5 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by Title, Author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border transition-all duration-200 focus:outline-none shadow-sm"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedCategory === null ? 'shadow-sm' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: selectedCategory === null ? 'var(--accent-color)' : 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: selectedCategory === null ? '#ffffff' : 'var(--text-main)',
            }}
          >
            All Categories ({books.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat.id ? 'shadow-sm' : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: selectedCategory === cat.id ? 'var(--accent-color)' : 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-main)',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="text-center py-16 space-y-3">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--accent-color)', borderTopColor: 'transparent' }}></div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fetching books from inventory...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs p-4 rounded-xl text-center">
            Failed to load books. Please check backend connection.
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.length === 0 ? (
              <div className="col-span-full py-16 text-center space-y-2">
                <BookOpen className="w-10 h-10 mx-auto" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>No books found</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Try adjusting your search query or category filter.</p>
              </div>
            ) : (
              books.map((book) => (
                <div
                  key={book.id}
                  className="clean-card p-5 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition duration-300"
                >
                  <div className="space-y-3">
                    {/* Cover or Placeholder */}
                    <div className="h-44 rounded-xl overflow-hidden bg-slate-900/5 border relative flex items-center justify-center" style={{ borderColor: 'var(--card-border)' }}>
                      {book.coverImageUrl ? (
                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center space-y-1 p-4">
                          <BookOpen className="w-8 h-8 mx-auto opacity-40" style={{ color: 'var(--accent-color)' }} />
                          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-60">{book.categoryName || 'General'}</span>
                        </div>
                      )}

                      <span
                        className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          book.availableCopies > 0
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                        }`}
                      >
                        {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Out of Stock'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--accent-color)' }}>
                        {book.categoryName || 'Uncategorized'}
                      </span>
                      <h3 className="font-bold text-sm line-clamp-1" style={{ color: 'var(--text-main)' }}>{book.title}</h3>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>By {book.author}</p>
                    </div>

                    {/* Metadata Pill Tags */}
                    <div className="flex flex-wrap gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {book.edition && (
                        <span className="px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                          {book.edition}
                        </span>
                      )}
                      {book.publicationYear && (
                        <span className="px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                          Yr: {book.publicationYear}
                        </span>
                      )}
                      {book.language && (
                        <span className="px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                          {book.language}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--card-border)' }}>
                    <button
                      onClick={() => setBarcodeModalBook(book)}
                      className="flex items-center space-x-1 font-semibold transition hover:opacity-80"
                      style={{ color: 'var(--accent-color)' }}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Barcodes</span>
                    </button>

                    <button
                      onClick={() => setSelectedBook(book)}
                      className="px-3 py-1.5 rounded-lg border font-medium transition hover:opacity-80"
                      style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Book Detail Modal (Displays all 11 fields) */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-2xl p-6 border space-y-5 relative shadow-2xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:opacity-80"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-4">
              <div className="w-24 h-32 rounded-xl overflow-hidden border flex-shrink-0 bg-slate-900/10 flex items-center justify-center" style={{ borderColor: 'var(--card-border)' }}>
                {selectedBook.coverImageUrl ? (
                  <img src={selectedBook.coverImageUrl} alt={selectedBook.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-8 h-8 opacity-40" style={{ color: 'var(--accent-color)' }} />
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
                  {selectedBook.categoryName || 'General'}
                </span>
                <h3 className="font-bold text-lg leading-tight" style={{ color: 'var(--text-main)' }}>{selectedBook.title}</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Author: <span className="font-semibold" style={{ color: 'var(--text-main)' }}>{selectedBook.author}</span></p>
                <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>ISBN: {selectedBook.isbn}</p>
              </div>
            </div>

            {/* 11 Fields Detailed Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs p-3.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
              <div>
                <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Publisher:</span>
                <span className="font-medium" style={{ color: 'var(--text-main)' }}>{selectedBook.publisher || 'N/A'}</span>
              </div>

              <div>
                <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Edition:</span>
                <span className="font-medium" style={{ color: 'var(--text-main)' }}>{selectedBook.edition || '1st Edition'}</span>
              </div>

              <div>
                <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Publication Year:</span>
                <span className="font-medium" style={{ color: 'var(--text-main)' }}>{selectedBook.publicationYear || 'N/A'}</span>
              </div>

              <div>
                <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Language:</span>
                <span className="font-medium" style={{ color: 'var(--text-main)' }}>{selectedBook.language || 'English'}</span>
              </div>

              <div>
                <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Total Physical Copies:</span>
                <span className="font-bold" style={{ color: 'var(--text-main)' }}>{selectedBook.totalCopies} Copies</span>
              </div>

              <div>
                <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Available Copies:</span>
                <span className="font-bold text-emerald-500">{selectedBook.availableCopies} Available</span>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Description</span>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-main)' }}>
                {selectedBook.description || 'No description available for this book title.'}
              </p>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setBarcodeModalBook(selectedBook);
                  setSelectedBook(null);
                }}
                className="px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm transition hover:opacity-90 flex items-center space-x-1.5"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                <QrCode className="w-4 h-4" />
                <span>View Barcodes for Borrowing</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barcodes Modal with 1-Click Copy */}
      {barcodeModalBook && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl p-6 border space-y-4 relative shadow-2xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Physical Copy Barcodes</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{barcodeModalBook.title}</p>
              </div>
              <button onClick={() => setBarcodeModalBook(null)} style={{ color: 'var(--text-muted)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingCopies ? (
              <div className="py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>Loading physical copy barcodes...</div>
            ) : bookCopies.length === 0 ? (
              <div className="py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No copies found.</div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {bookCopies.map((copy: any) => (
                  <div
                    key={copy.id}
                    className="p-3 rounded-xl border flex items-center justify-between text-xs"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}
                  >
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold block" style={{ color: 'var(--accent-color)' }}>{copy.barcode}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{copy.rackLocation || 'Rack A-1'}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          copy.status === 'AVAILABLE'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}
                      >
                        {copy.status}
                      </span>

                      <button
                        onClick={() => handleCopyBarcode(copy.barcode)}
                        className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center space-x-1 transition"
                        style={{
                          backgroundColor: copiedBarcode === copy.barcode ? '#10b981' : 'var(--card-bg)',
                          borderColor: 'var(--card-border)',
                          color: copiedBarcode === copy.barcode ? '#ffffff' : 'var(--text-main)',
                        }}
                      >
                        {copiedBarcode === copy.barcode ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span className="text-white">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" style={{ color: 'var(--accent-color)' }} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
