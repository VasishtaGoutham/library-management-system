'use client';

import { Sparkles, Megaphone, Lightbulb, Bookmark, Calendar, Bell } from 'lucide-react';

const ANNOUNCEMENTS = [
  {
    icon: Lightbulb,
    text: "Can't find a book in our library? Suggest missing titles for library acquisition under your Student Dashboard!",
    color: "text-amber-300",
  },
  {
    icon: Bookmark,
    text: "Book Hold Queue System is Live! Reserve out-of-stock books to receive an automated pickup email upon return.",
    color: "text-indigo-300",
  },
  {
    icon: Calendar,
    text: "Reserve soundproof group study rooms and quiet focus pods under 'Study Rooms' in the top menu!",
    color: "text-emerald-300",
  },
  {
    icon: Sparkles,
    text: "Fall 2026 Departmental Course Reserve Textbooks uploaded for CS, Mechanical & Electrical Engineering modules!",
    color: "text-rose-300",
  },
  {
    icon: Megaphone,
    text: "Library 24/7 Extended Hours: Central Campus Library remains open 24 hours daily during midterm examination week.",
    color: "text-sky-300",
  },
];

export default function AnnouncementTicker() {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white text-[11px] py-2 border-b border-indigo-500/30 overflow-hidden relative shadow-md z-40">
      <div className="animate-marquee whitespace-nowrap flex items-center space-x-12">
        {/* First Loop */}
        {ANNOUNCEMENTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={`a-${idx}`} className="inline-flex items-center space-x-2 font-medium tracking-wide">
              <Icon className={`w-3.5 h-3.5 ${item.color} animate-pulse shrink-0`} />
              <span>{item.text}</span>
              <span className="text-indigo-400/50 mx-4 font-mono">•</span>
            </div>
          );
        })}

        {/* Second Duplicate Loop for Continuous Smooth Infinity Scroll */}
        {ANNOUNCEMENTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={`b-${idx}`} className="inline-flex items-center space-x-2 font-medium tracking-wide">
              <Icon className={`w-3.5 h-3.5 ${item.color} animate-pulse shrink-0`} />
              <span>{item.text}</span>
              <span className="text-indigo-400/50 mx-4 font-mono">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
