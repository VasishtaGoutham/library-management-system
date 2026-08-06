'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  BookOpen, ArrowRight, ShieldCheck, Sparkles, ScanLine, 
  Clock, Award, Layers, Users, BookMarked, CheckCircle2,
  Mail, MapPin, Phone, HelpCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex items-center max-w-7xl w-full mx-auto px-6 py-10 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
          
          {/* Left Column Text & CTAs - Slides in smoothly from Left */}
          <div className="lg:col-span-6 space-y-6 text-left animate-slide-from-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold hover:scale-105 transition cursor-default" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome to LibraryUniverse</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight transition-transform duration-300 hover:scale-[1.03] origin-left cursor-pointer" style={{ color: 'var(--text-main)' }}>
              <span className="inline-block transition-transform duration-300 hover:scale-105">Your Gateway to</span> <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent hover:brightness-125 transition-transform duration-300 inline-block hover:scale-105">
                Endless Knowledge
              </span>
            </h1>

            <p className="text-base leading-relaxed max-w-xl transition-all duration-300 hover:scale-105 hover:text-white origin-left cursor-pointer" style={{ color: 'var(--text-muted)' }}>
              Discover, reserve, and borrow thousands of books from our extensive collection. Join our community of readers and experience seamless, modern library management.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/catalog"
                className="btn-motion px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-xl flex items-center space-x-2 group"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                <span>Explore Books</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>

              {user ? (
                <Link
                  href={user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
                  className="btn-motion px-6 py-3.5 rounded-xl font-bold text-sm border flex items-center space-x-2 group"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                >
                  <BookMarked className="w-4 h-4 text-emerald-500 group-hover:rotate-12 transition-transform duration-300" />
                  <span>My Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="btn-motion px-6 py-3.5 rounded-xl font-bold text-sm border flex items-center space-x-2 group"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                >
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent-color)' }} />
                  <span>Login / Register</span>
                </Link>
              )}
            </div>

            {/* Quick Stat Indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border bg-slate-900/30 hover:scale-105 transition cursor-default" style={{ borderColor: 'var(--card-border)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>10,000+ Books</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border bg-slate-900/30 hover:scale-105 transition cursor-default" style={{ borderColor: 'var(--card-border)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <span>5,000+ Members</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border bg-slate-900/30 hover:scale-105 transition cursor-default" style={{ borderColor: 'var(--card-border)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
                <span>24/7 Access</span>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Student Library Desk Image - Slides in smoothly from Right */}
          <div className="lg:col-span-6 relative animate-slide-from-right">
            <div 
              className="hero-image-card relative rounded-3xl p-3 md:p-4 border shadow-2xl overflow-hidden cursor-pointer"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              
              {/* Floating Top Badge */}
              <div className="absolute top-6 right-6 z-10 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[11px] shadow-lg flex items-center space-x-1.5 backdrop-blur-md hover:scale-110 transition">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
                <span>📚 Quiet Study Area</span>
              </div>

              {/* Main Image */}
              <div className="relative h-80 md:h-[420px] w-full rounded-2xl overflow-hidden group">
                <img
                  src="/hero_student.jpg"
                  alt="Student studying at private library desk with paintings"
                  className="w-full h-full object-cover rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Bottom Feature Bar */}
              <div className="mt-3 p-3.5 rounded-xl border flex items-center justify-between text-xs transition group-hover:border-indigo-500/50" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg border transition group-hover:scale-110" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-color)' }}>
                    <BookOpen className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
                  </div>
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--text-main)' }}>Private Study Desks & Digital Library</span>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Experience tranquil learning spaces</span>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* About Section (#about) */}
      <section id="about" className="border-t py-16 transition-colors duration-300 relative z-10" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="max-w-7xl w-full mx-auto px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-color)' }}>About LibraryUniverse</span>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-main)' }}>Empowering Knowledge & Discovery</h2>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              LibraryUniverse is a state-of-the-art digital and physical library management system built to provide students, faculty, and librarians with real-time barcode tracking, seamless catalog exploration, and automated circulation controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="clean-card p-6 space-y-3">
              <div className="p-3 w-fit rounded-xl border" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-color)' }}>
                <ScanLine className="w-6 h-6" style={{ color: 'var(--accent-color)' }} />
              </div>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-main)' }}>Camera Barcode Scanner</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Instantly scan physical book barcodes using your phone or laptop camera for 1-click check-outs and check-ins.
              </p>
            </div>

            <div className="clean-card p-6 space-y-3">
              <div className="p-3 w-fit rounded-xl border" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-color)' }}>
                <Clock className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-main)' }}>Flexible Borrow Durations</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Choose custom loan periods from 1 to 14 days with real-time return due date calculations and automated fine engine.
              </p>
            </div>

            <div className="clean-card p-6 space-y-3">
              <div className="p-3 w-fit rounded-xl border" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-color)' }}>
                <ShieldCheck className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-main)' }}>Executive Multi-Theme UI</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Seamlessly switch between 4 curated themes (Obsidian Dark, Porcelain Light, Emerald Green, and Violet Tech).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section (#contact) */}
      <section id="contact" className="py-20 border-t transition-colors duration-300 relative z-10" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
        <div className="max-w-7xl w-full mx-auto px-6 space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold px-3 py-1 rounded-full border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
              ⚡ Guest & Visitor Help Desk
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
              Have a Question? Ask the University Librarian Desk
            </h2>
            <p className="text-xs max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Submit your inquiry about book availability, membership passes, or campus library access. Our librarian team replies within 2 hours.
            </p>
          </div>

          {/* 2-Column High-End Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Left Column: Interactive Form */}
            <div className="lg:col-span-7 clean-card p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden group/form hover:border-indigo-500/50">
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--card-border)' }}>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base" style={{ color: 'var(--text-main)' }}>Send a Message to Librarian Desk</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Guest Help Desk
                </span>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert('🎉 Thank you! Your message has been sent to the Head Librarian Desk. We will email you back shortly.'); }} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="font-bold text-[11px] block" style={{ color: 'var(--text-main)' }}>Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      className="w-full px-4 py-3 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="font-bold text-[11px] block" style={{ color: 'var(--text-main)' }}>Your Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@university.edu"
                      className="w-full px-4 py-3 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="font-bold text-[11px] block" style={{ color: 'var(--text-main)' }}>Inquiry Subject / Topic *</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  >
                    <option>General Question / Campus Access</option>
                    <option>Book Availability & Barcode Request</option>
                    <option>Hold Reservation & Queue Status</option>
                    <option>Study Pod & Quiet Room Booking</option>
                    <option>Faculty & Syllabus Book Requests</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="font-bold text-[11px] block" style={{ color: 'var(--text-main)' }}>Your Message / Question *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your message or inquiry here..."
                    className="w-full px-4 py-3 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-motion w-full py-3.5 rounded-xl font-extrabold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Message to Librarian Desk</span>
                </button>
              </form>
            </div>

            {/* Right Column: Desk Info & Staff Live Card */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Staff Live Status Card */}
              <div className="clean-card p-6 space-y-5 border-emerald-500/30 shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--card-bg), var(--bg-color))' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-bold text-emerald-400">Desk Staff Online Now</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Response: &lt; 2 Hrs</span>
                </div>

                <div className="space-y-1 text-left">
                  <h4 className="font-extrabold text-lg" style={{ color: 'var(--text-main)' }}>Central Campus Help Desk</h4>
                  <p className="text-xs text-slate-400">Main Academic Building • Floor 2, Quad 4</p>
                </div>

                <div className="space-y-3 pt-2 border-t text-xs" style={{ borderColor: 'var(--card-border)' }}>
                  <div className="flex items-center space-x-3 text-left">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--text-main)' }}>In-Person Desk Hours</span>
                      <span className="text-[11px] text-slate-400">Mon - Sat: 8:00 AM - 10:00 PM</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-left">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--text-main)' }}>Direct Desk Phone Hotline</span>
                      <span className="text-[11px] font-mono text-indigo-400">+1 (800) 555-LIB-UNIV</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-left">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--text-main)' }}>Official Library Email</span>
                      <span className="text-[11px] font-mono text-purple-400">librarian@libraryuniverse.edu</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick FAQ Tip */}
              <div className="clean-card p-5 text-left space-y-2 border-indigo-500/30">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Looking for instant book checkouts?</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Log in to your student portal to instantly generate physical book barcodes and reserve soundproof study rooms in 1-click!
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-xs relative z-10" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
        <div className="max-w-7xl w-full mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 font-bold" style={{ color: 'var(--text-main)' }}>
            <BookOpen className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
            <span>LibraryUniverse v1.0.0</span>
          </div>
          <p>© 2026 LibraryUniverse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
