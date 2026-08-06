'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  BookOpen, Mail, Phone, MapPin, Clock, ShieldCheck, 
  Globe, Share2, ExternalLink, Heart, ArrowUpRight
} from 'lucide-react';

export default function Footer() {
  const { user } = useAuthStore();

  // Only render footer when NOT logged in
  if (user) return null;

  return (
    <footer 
      className="w-full border-t transition-colors duration-300 relative z-10" 
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
    >
      <div className="max-w-7xl w-full mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b" style={{ borderColor: 'var(--card-border)' }}>
          
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="p-2 rounded-xl border transition group-hover:scale-110" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-main)' }}>
                Library<span style={{ color: 'var(--accent-color)' }}>Universe</span>
              </span>
            </Link>

            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Next-generation digital and physical university library management system featuring camera barcode checkout, hold reservation queues, study spaces, and automated circulation alerts.
            </p>

            <div className="flex items-center space-x-3 pt-1">
              <a href="#" className="p-2 rounded-lg border hover:scale-110 transition text-slate-400 hover:text-white" style={{ borderColor: 'var(--card-border)' }} title="Global Portal">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg border hover:scale-110 transition text-slate-400 hover:text-indigo-400" style={{ borderColor: 'var(--card-border)' }} title="Share Library">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg border hover:scale-110 transition text-slate-400 hover:text-emerald-400" style={{ borderColor: 'var(--card-border)' }} title="University Network">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/catalog" className="hover:underline transition flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <span>Explore Book Catalog</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:underline transition" style={{ color: 'var(--text-muted)' }}>
                  About LibraryUniverse
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:underline transition" style={{ color: 'var(--text-muted)' }}>
                  Help & Contact Desk
                </a>
              </li>
              <li>
                <Link href="/login?mode=login" className="hover:underline transition" style={{ color: 'var(--text-muted)' }}>
                  Student & Faculty Login
                </Link>
              </li>
              <li>
                <Link href="/login?mode=register" className="hover:underline transition" style={{ color: 'var(--text-muted)' }}>
                  Create Library Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours & Location */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Campus Library Info</h4>
            <div className="space-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                <span>Central Campus Library, Quad 4<br />University Park Campus</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Operating Hours: <strong>24 / 7 Access</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Help Desk: <strong>+91 1800 123 4567</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 shrink-0 text-purple-400" />
                <span>support@libraryuniverse.edu</span>
              </div>
            </div>
          </div>

          {/* Column 4: System Status & Security */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">System Security</h4>
            <div className="p-3.5 rounded-xl border space-y-2" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Spring Security & JWT 256-Bit</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                All circulation records, barcodes, and user credentials are encrypted with HTTPS standard protocols.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-4" style={{ color: 'var(--text-muted)' }}>
          <p>© {new Date().getFullYear()} LibraryUniverse System. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-[11px]">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:underline">Acceptable Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
