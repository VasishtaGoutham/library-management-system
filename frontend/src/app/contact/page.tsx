'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, Clock, 
  HelpCircle, MessageSquare, ShieldCheck, Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('General Question');
  const [message, setMessage] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedTicket = 'TICKET-2026-' + Math.floor(1000 + Math.random() * 9000);
      setIsSubmitting(false);
      setTicketId(generatedTicket);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border text-indigo-400 bg-indigo-500/10 border-indigo-500/20 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Guest Help Desk</span>
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            💬 Ask a Librarian & Submit Inquiry
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Have questions about physical book availability, campus guest passes, hold queues, or research assistance? Submit your inquiry directly to our 24/7 librarian desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Campus Info & Operating Hours */}
          <div className="lg:col-span-5 space-y-4">
            <div className="clean-card p-6 space-y-4">
              <h3 className="font-extrabold text-sm border-b pb-3" style={{ color: 'var(--text-main)', borderColor: 'var(--card-border)' }}>
                🏛️ University Central Library
              </h3>

              <div className="space-y-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl border bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-200">Main Campus Desk</strong>
                    <span>Central Academic Building, Floor 2 • Quad 4</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-200">Operating Hours</strong>
                    <span>Physical Desk: 8:00 AM - 10:00 PM<br />Digital Portal: <strong>24 / 7 Access</strong></span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-200">Email Inquiry Desk</strong>
                    <span className="font-mono">support@libraryuniverse.edu</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl border bg-purple-500/10 border-purple-500/30 text-purple-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-200">Phone Support</strong>
                    <span className="font-mono">+1 (800) 555-LIB-UNIV</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="clean-card p-5 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Fast 2-Hour Response Time</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All submitted guest inquiries generate a unique tracking ticket ID. Our university librarians review and reply to all tickets within 2 hours.
              </p>
            </div>
          </div>

          {/* Right Column: Dedicated Form */}
          <div className="lg:col-span-7">
            {ticketId ? (
              <div className="clean-card p-8 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-400 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    Ticket ID: {ticketId}
                  </span>
                  <h3 className="font-extrabold text-lg mt-3" style={{ color: 'var(--text-main)' }}>Inquiry Submitted Successfully!</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                  Thank you, <strong>{fullName}</strong>. Your inquiry regarding "<em>{inquiryType}</em>" has been logged into our support queue. An email response has been dispatched to <strong>{email}</strong>.
                </p>

                <button
                  onClick={() => {
                    setTicketId(null);
                    setFullName('');
                    setEmail('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="clean-card p-8 space-y-5">
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--card-border)' }}>
                  <div>
                    <h3 className="font-extrabold text-base" style={{ color: 'var(--text-main)' }}>Guest & Student Inquiry Form</h3>
                    <p className="text-xs text-slate-400">Fill in the details below to reach our librarian team.</p>
                  </div>
                  <MessageSquare className="w-6 h-6 text-indigo-400" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold block text-xs" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold block text-xs" style={{ color: 'var(--text-muted)' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold block text-xs" style={{ color: 'var(--text-muted)' }}>Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (555) 019-2834"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold block text-xs" style={{ color: 'var(--text-muted)' }}>Inquiry Category *</label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                    >
                      <option value="General Question">General Question / Campus Access</option>
                      <option value="Book Availability">Book Availability Inquiry</option>
                      <option value="Library Tour & Pass">Library Tour & Guest Pass Request</option>
                      <option value="Research Assistance">Research & Citation Assistance</option>
                      <option value="Technical Support">Technical Support / Account Help</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold block text-xs" style={{ color: 'var(--text-muted)' }}>Your Message / Detailed Question *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your message or inquiry here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit Message to Librarian Desk'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
