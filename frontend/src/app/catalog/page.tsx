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
  Calendar, Globe, Bookmark, Star, MessageSquare, Send, Trash2, UserCheck, Lightbulb, SlidersHorizontal
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

const UNIQUE_BOOK_COVERS = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526243741027-444d633d7342?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
];

const getFallbackBookCover = (categoryName?: string, bookId?: number) => {
  const index = Math.abs((bookId || 1) * 17) % UNIQUE_BOOK_COVERS.length;
  return UNIQUE_BOOK_COVERS[index];
};

const getAmazonIsbn10Cover = (isbn13: string) => {
  const clean = isbn13.replace(/[^0-9X]/gi, '');
  if (clean.length === 10) {
    return `https://images-na.ssl-images-amazon.com/images/P/${clean}.01._SX350_SY475_SCLZZZZZZZ_.jpg`;
  }
  if (clean.length === 13 && clean.startsWith('978')) {
    const nine = clean.substring(3, 12);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(nine[i], 10) * (10 - i);
    }
    const rem = (11 - (sum % 11)) % 11;
    const check = rem === 10 ? 'X' : rem.toString();
    const isbn10 = nine + check;
    return `https://images-na.ssl-images-amazon.com/images/P/${isbn10}.01._SX350_SY475_SCLZZZZZZZ_.jpg`;
  }
  return null;
};

const KNOWN_TITLE_COVERS: Record<string, string> = {
  'the ramayana of valmiki': 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&auto=format&fit=crop&q=80',
  'the mahabharata': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'the bhagavad gita': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
  'panchatantra: ancient fables of india': 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=600&auto=format&fit=crop&q=80',
  'ponniyin selvan (the son of ponni)': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
  'maha prasthanam': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  'vemana satakam': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80',
  'kanyasulkam': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
  'amrutham kurisina ratri': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80',
  'srimad ramayanamu (kalpavrukshamu)': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
  'godan (the gift of a cow)': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  'gitanjali (song offerings)': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
  'madhushala (house of wine)': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  'malgudi days': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
  'shiva trilogy: the immortals of meluha': 'https://images-na.ssl-images-amazon.com/images/P/9380658745.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  'chanakya neeti: ancient indian strategy': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80',
  'clean code: refactoring & testing': 'https://images-na.ssl-images-amazon.com/images/P/0132350882.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  'introduction to algorithms (clrs)': 'https://images-na.ssl-images-amazon.com/images/P/0262033844.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  'design patterns: reusable object-oriented software': 'https://images-na.ssl-images-amazon.com/images/P/0201633612.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  'artificial intelligence: a modern approach': 'https://images-na.ssl-images-amazon.com/images/P/0134610997.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  'the intelligent investor': 'https://images-na.ssl-images-amazon.com/images/P/0060555661.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  'to kill a mockingbird': 'https://images-na.ssl-images-amazon.com/images/P/0060935464.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  '1984': 'https://images-na.ssl-images-amazon.com/images/P/0451524934.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  'the alchemist': 'https://images-na.ssl-images-amazon.com/images/P/0062315005.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  'sapiens: a brief history of humankind': 'https://images-na.ssl-images-amazon.com/images/P/0062316095.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  'atomic habits': 'https://images-na.ssl-images-amazon.com/images/P/0735211299.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  'building materials': 'https://images-na.ssl-images-amazon.com/images/P/9386070405.01._SX350_SY475_SCLZZZZZZZ_.jpg',
  'town planning': 'https://images-na.ssl-images-amazon.com/images/P/9380358687.01._SX350_SY475_SCLZZZZZZZ_.jpg',
};

const KEYWORD_COVERS: Array<{ keyword: string; url: string }> = [
  { keyword: 'ramayana', url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'mahabharata', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'gita', url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'panchatantra', url: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'ponniyin', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'gitanjali', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'godan', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'clean code', url: 'https://images-na.ssl-images-amazon.com/images/P/0132350882.01._SX350_SY475_SCLZZZZZZZ_.jpg' },
  { keyword: 'algorithm', url: 'https://images-na.ssl-images-amazon.com/images/P/0262033844.01._SX350_SY475_SCLZZZZZZZ_.jpg' },
  { keyword: 'design pattern', url: 'https://images-na.ssl-images-amazon.com/images/P/0201633612.01._SX350_SY475_SCLZZZZZZZ_.jpg' },
  { keyword: 'artificial intelligence', url: 'https://images-na.ssl-images-amazon.com/images/P/0134610997.01._SX350_SY475_SCLZZZZZZZ_.jpg' },
  { keyword: 'python', url: 'https://images-na.ssl-images-amazon.com/images/P/1593279280.01._SX350_SY475_SCLZZZZZZZ_.jpg' },
  { keyword: 'robot', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'constitution', url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'law', url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'astronomy', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'history', url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'environmental', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'psychology', url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'physics', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'chemistry', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'calculus', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'circuit', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80' },
  { keyword: 'mechanics', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
];

const getRealBookCover = (book: Book) => {
  if (book.title) {
    const titleKey = book.title.toLowerCase().trim();
    if (KNOWN_TITLE_COVERS[titleKey]) {
      return KNOWN_TITLE_COVERS[titleKey];
    }
    const kwMatch = KEYWORD_COVERS.find(k => titleKey.includes(k.keyword));
    if (kwMatch) {
      return kwMatch.url;
    }
  }

  if (book.coverImageUrl && !book.coverImageUrl.includes('openlibrary.org') && !book.coverImageUrl.includes('books.google.com') && !book.coverImageUrl.includes('images-na.ssl-images-amazon.com')) {
    return book.coverImageUrl;
  }

  const cleanIsbn = (book.isbn || '').replace(/[^0-9A-Za-z]/g, '');
  if (cleanIsbn.length >= 10) {
    const amazonUrl = getAmazonIsbn10Cover(cleanIsbn);
    if (amazonUrl) return amazonUrl;
  }

  return getFallbackBookCover(book.categoryName, book.id);
};

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
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
      let url = '/books?size=2000';
      if (selectedCategory) url += `&categoryId=${selectedCategory}`;
      if (search) url += `&query=${encodeURIComponent(search)}`;

      const res = await api.get(url);
      return res.data;
    },
  });
  const books: Book[] = Array.isArray(rawBooks)
    ? rawBooks
    : (rawBooks?.content || []);

  const LANGUAGES = ['All Languages', 'Sanskrit', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Marathi', 'Punjabi', 'French', 'German', 'Spanish', 'Russian', 'English'];

  const filteredBooks = books.filter((b) => {
    if (!selectedLanguage || selectedLanguage === 'All Languages') return true;
    return b.language?.toLowerCase() === selectedLanguage.toLowerCase();
  });

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
              Explore over {filteredBooks.length} books across {categories.length} categories with real-time physical barcode availability & student ratings.
            </p>
          </div>

          {/* Search Box & Filter Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                isFilterOpen || selectedCategory !== null || selectedLanguage !== null
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'hover:opacity-80'
              }`}
              style={
                !isFilterOpen && selectedCategory === null && selectedLanguage === null
                  ? { backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }
                  : {}
              }
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-200" />
              <span>Filters</span>
              {(selectedCategory !== null || selectedLanguage !== null) && (
                <span className="w-5 h-5 rounded-full bg-white text-indigo-600 text-[10px] font-black flex items-center justify-center">
                  {(selectedCategory !== null ? 1 : 0) + (selectedLanguage !== null ? 1 : 0)}
                </span>
              )}
            </button>

            <div className="relative flex-1 md:w-80">
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
        </div>

        {/* Collapsible Filter Panel (Shows ONLY when Filter Button clicked or filters active) */}
        {isFilterOpen && (
          <div className="p-4 rounded-2xl border space-y-4 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-2" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-400">
                <Filter className="w-4 h-4" />
                <span>Filter Library Collection</span>
              </div>

              {(selectedCategory !== null || selectedLanguage !== null) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedLanguage(null);
                  }}
                  className="text-xs font-semibold text-rose-400 hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

            {/* Category Filter Bar */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Category:</span>
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
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition shrink-0 ${
                      selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'hover:opacity-80'
                    }`}
                    style={selectedCategory !== cat.id ? { backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' } : {}}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Filter Bar */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Language:
              </span>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage((lang === 'All Languages' || selectedLanguage === lang) ? null : lang)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                      (selectedLanguage === null && lang === 'All Languages') || selectedLanguage === lang
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'hover:opacity-80 text-slate-400 border border-slate-700/50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {isLoadingBooks ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 rounded-2xl border animate-pulse" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}></div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="py-16 text-center space-y-4 border rounded-2xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <BookOpen className="w-12 h-12 mx-auto text-indigo-400 opacity-80" />
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-main)' }}>No books match your search criteria</h3>
              <p className="text-xs text-slate-400 mt-1">Can't find the book you are looking for in the library?</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedLanguage(null);
                  setSearch('');
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700 shadow-md"
              >
                <X className="w-4 h-4 text-rose-400" />
                <span>Reset Filters & Show All Books</span>
              </button>

              <a
                href="/student/dashboard"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20"
              >
                <Lightbulb className="w-4 h-4 text-amber-300" />
                <span>Request Book for Library Purchase</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="border rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              >
                <div>
                  {/* Book Cover Image */}
                  <div className="h-52 w-full relative bg-slate-950 overflow-hidden flex items-center justify-center group/cover">
                    <img
                      src={getRealBookCover(book)}
                      alt={book.title}
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (img.naturalWidth <= 1 || img.naturalHeight <= 1) {
                          img.src = getFallbackBookCover(book.categoryName, book.id);
                        }
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getFallbackBookCover(book.categoryName, book.id);
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-110"
                    />

                    {/* Glassmorphic Book Title & Author Overlay directly on Cover Image */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent p-3 pt-7 pointer-events-none group-hover/cover:opacity-0 transition-opacity duration-200">
                      <p className="text-xs font-black text-white line-clamp-1 drop-shadow-md tracking-tight">
                        {book.title}
                      </p>
                      <p className="text-[10px] font-medium text-slate-300 line-clamp-1 drop-shadow-sm mt-0.5">
                        by {book.author}
                      </p>
                    </div>

                    {/* Interactive Quick Action Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/cover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2.5 p-4">
                      <button
                        onClick={() => setSelectedBook(book)}
                        className="w-full py-2 rounded-xl text-xs font-extrabold bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 hover:bg-indigo-500 transition flex items-center justify-center gap-1.5 translate-y-2 group-hover/cover:translate-y-0 duration-300"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Quick View & Reviews</span>
                      </button>

                      {book.availableCopies === 0 ? (
                        <button
                          onClick={() => requestHoldMutation.mutate(book.id)}
                          disabled={requestHoldMutation.isPending}
                          className="w-full py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition flex items-center justify-center gap-1.5 translate-y-2 group-hover/cover:translate-y-0 duration-300"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Request Hold Reservation</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setBarcodeModalBook(book)}
                          className="w-full py-2 rounded-xl text-xs font-extrabold bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition flex items-center justify-center gap-1.5 translate-y-2 group-hover/cover:translate-y-0 duration-300"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View Shelf Barcodes</span>
                        </button>
                      )}
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3 z-10">
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
