'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Users, Clock, Calendar, CheckCircle2, ShieldCheck, 
  Tv, Wifi, Zap, Award, Sparkles, MapPin, Search
} from 'lucide-react';

interface StudySpace {
  id: number;
  name: string;
  category: 'Group Room' | 'Quiet Pod' | 'Computer Lab' | 'Conference Hall';
  capacity: string;
  location: string;
  amenities: string[];
  image: string;
  description: string;
}

const SAMPLE_SPACES: StudySpace[] = [
  {
    id: 1,
    name: 'Innovation Hub Room 4A',
    category: 'Group Room',
    capacity: '4 - 6 People',
    location: '2nd Floor - East Wing',
    amenities: ['4K Smart TV', 'Glass Whiteboard', 'Power Outlets', 'High-Speed Wi-Fi'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    description: 'Soundproof collaborative discussion room equipped with smart displays and dual glass whiteboards.',
  },
  {
    id: 2,
    name: 'Silent Focus Pod B12',
    category: 'Quiet Pod',
    capacity: '1 Person',
    location: '3rd Floor - Silent Zone',
    amenities: ['Ergonomic Chair', 'LED Task Light', 'Dual USB-C Chargers', 'Acoustic Soundproofing'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Individual acoustic quiet booth designed for intensive exam preparation and deep study sessions.',
  },
  {
    id: 3,
    name: 'High-Performance Lab 102',
    category: 'Computer Lab',
    capacity: '1 Person / Station',
    location: '1st Floor - Tech Center',
    amenities: ['Dual 27" Monitors', 'RTX GPU Workstation', 'MATLAB & CAD Software', 'Ethernet Port'],
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    description: 'Workstation station loaded with simulation, programming, and engineering software suites.',
  },
  {
    id: 4,
    name: 'Executive Boardroom 301',
    category: 'Conference Hall',
    capacity: '8 - 12 People',
    location: '3rd Floor - Executive Suite',
    amenities: ['Conference Projector', 'Surround Audio', 'Video Call Bar', 'Executive Seating'],
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious meeting hall for student organization presentations, defense rehearsals, and group projects.',
  },
];

const TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '01:00 PM - 03:00 PM',
  '03:00 PM - 05:00 PM',
  '05:00 PM - 07:00 PM',
  '07:00 PM - 09:00 PM',
];

export default function StudySpacesPage() {
  const [selectedSpace, setSelectedSpace] = useState<StudySpace | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[0]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const handleBook = () => {
    if (!selectedSpace) return;
    const newBooking = {
      id: Date.now(),
      spaceName: selectedSpace.name,
      category: selectedSpace.category,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'CONFIRMED',
    };
    setUserBookings([newBooking, ...userBookings]);
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedSpace(null);
    }, 2500);
  };

  const filteredSpaces = filterCategory === 'ALL' 
    ? SAMPLE_SPACES 
    : SAMPLE_SPACES.filter(s => s.category === filterCategory);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="border-b pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: 'var(--card-border)' }}>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold px-2.5 py-1 rounded-md border text-indigo-400 bg-indigo-500/10 border-indigo-500/20">
              Campus Facilities & Study Reservations
            </span>
            <h1 className="text-2xl font-black tracking-tight mt-2" style={{ color: 'var(--text-main)' }}>
              🏛️ Study Rooms & Quiet Pod Reservations
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Reserve soundproof group study rooms, individual quiet focus pods, and high-performance lab stations.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto text-xs">
            {['ALL', 'Group Room', 'Quiet Pod', 'Computer Lab', 'Conference Hall'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'hover:opacity-80 border-slate-700/50'
                }`}
                style={filterCategory !== cat ? { backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* User Active Reservations (if any) */}
        {userBookings.length > 0 && (
          <div className="clean-card p-6 space-y-4 border-l-4 border-indigo-500">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Your Active Room Reservations ({userBookings.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {userBookings.map((b) => (
                <div key={b.id} className="p-3 rounded-xl border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}>
                  <div>
                    <h4 className="font-bold">{b.spaceName}</h4>
                    <p className="text-[11px] text-slate-400">{b.date} • {b.timeSlot}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Spaces Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSpaces.map((space) => (
            <div
              key={space.id}
              className="clean-card overflow-hidden flex flex-col justify-between group hover:border-indigo-500/50 transition duration-300"
            >
              <div>
                <div className="h-48 w-full relative overflow-hidden">
                  <img
                    src={space.image}
                    alt={space.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-black/70 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
                    {space.category}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base" style={{ color: 'var(--text-main)' }}>{space.name}</h3>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      {space.capacity}
                    </span>
                  </div>

                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{space.description}</p>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{space.location}</span>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {space.amenities.map((am) => (
                      <span
                        key={am}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium border"
                        style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 border-t" style={{ borderColor: 'var(--card-border)' }}>
                <button
                  onClick={() => setSelectedSpace(space)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Time Slot</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Reservation Booking Modal */}
      {selectedSpace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl relative"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
              <div>
                <h3 className="font-bold text-base">{selectedSpace.name}</h3>
                <span className="text-xs text-indigo-400">{selectedSpace.category} • {selectedSpace.capacity}</span>
              </div>
              <button onClick={() => setSelectedSpace(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-base">Reservation Confirmed! 🎉</h4>
                <p className="text-xs text-slate-400">
                  Booked for <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>. Check your email for access barcode.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    style={{ borderColor: 'var(--card-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Select 2-Hour Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-xl border text-[11px] font-bold text-center transition ${
                          selectedSlot === slot
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                            : 'border-slate-700/50 hover:bg-slate-800/50'
                        }`}
                        style={selectedSlot !== slot ? { backgroundColor: 'var(--bg-color)', color: 'var(--text-muted)' } : {}}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedSpace(null)}
                    className="px-4 py-2 rounded-xl border font-bold"
                    style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBook}
                    className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
