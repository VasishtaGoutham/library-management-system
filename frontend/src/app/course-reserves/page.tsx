'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  GraduationCap, BookOpen, Layers, Search, CheckCircle2, 
  ExternalLink, ArrowRight, Bookmark, ShieldCheck, UserCheck
} from 'lucide-react';

interface CourseReserve {
  courseCode: string;
  courseName: string;
  department: string;
  instructor: string;
  semester: string;
  textbooks: {
    title: string;
    author: string;
    isbn: string;
    type: 'Required' | 'Recommended';
    availableCopies: number;
  }[];
}

const SAMPLE_RESERVES: CourseReserve[] = [
  {
    courseCode: 'CS 301',
    courseName: 'Data Structures & Algorithms',
    department: 'Computer Science & IT',
    instructor: 'Prof. Alan Turing',
    semester: 'Fall 2026',
    textbooks: [
      { title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest, Stein', isbn: '9780262046305', type: 'Required', availableCopies: 4 },
      { title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', isbn: '9780132350884', type: 'Recommended', availableCopies: 2 },
    ],
  },
  {
    courseCode: 'ME 201',
    courseName: 'Thermodynamics & Heat Transfer',
    department: 'Mechanical Engineering',
    instructor: 'Dr. Nikola Tesla',
    semester: 'Fall 2026',
    textbooks: [
      { title: 'Fundamentals of Engineering Thermodynamics', author: 'Michael J. Moran', isbn: '9781119391388', type: 'Required', availableCopies: 5 },
    ],
  },
  {
    courseCode: 'EE 102',
    courseName: 'Digital Circuits & Signals',
    department: 'Electrical & Electronics',
    instructor: 'Prof. James Maxwell',
    semester: 'Fall 2026',
    textbooks: [
      { title: 'Digital Design: With an Introduction to Verilog HDL', author: 'M. Morris Mano', isbn: '9780132774208', type: 'Required', availableCopies: 3 },
    ],
  },
  {
    courseCode: 'MATH 402',
    courseName: 'Applied Statistics & Probability',
    department: 'Mathematics & Data Science',
    instructor: 'Dr. Carl Gauss',
    semester: 'Fall 2026',
    textbooks: [
      { title: 'Probability & Statistics for Engineers', author: 'Ronald E. Walpole', isbn: '9780321629111', type: 'Required', availableCopies: 6 },
    ],
  },
];

export default function CourseReservesPage() {
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = ['ALL', 'Computer Science & IT', 'Mechanical Engineering', 'Electrical & Electronics', 'Mathematics & Data Science'];

  const filteredReserves = SAMPLE_RESERVES.filter((res) => {
    const matchesDept = selectedDept === 'ALL' || res.department === selectedDept;
    const matchesQuery = !searchQuery || 
      res.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="border-b pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: 'var(--card-border)' }}>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold px-2.5 py-1 rounded-md border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
              Academic Curriculum Integration
            </span>
            <h1 className="text-2xl font-black tracking-tight mt-2" style={{ color: 'var(--text-main)' }}>
              🎓 Departmental Course Reserves & Textbook Hub
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Browse required and recommended textbooks assigned by professors for university courses this semester.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search course code or professor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs bg-slate-900/50 focus:ring-2 focus:ring-emerald-500 outline-none"
              style={{ borderColor: 'var(--card-border)', color: 'var(--text-main)' }}
            />
          </div>
        </div>

        {/* Department Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto text-xs pb-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition border ${
                selectedDept === dept
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'hover:opacity-80 border-slate-700/50'
              }`}
              style={selectedDept !== dept ? { backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)' } : {}}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Course Cards */}
        <div className="space-y-6">
          {filteredReserves.map((course) => (
            <div key={course.courseCode} className="clean-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2" style={{ borderColor: 'var(--card-border)' }}>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {course.courseCode}
                    </span>
                    <h2 className="font-extrabold text-base" style={{ color: 'var(--text-main)' }}>{course.courseName}</h2>
                  </div>
                  <p className="text-xs mt-1 text-slate-400">
                    Instructor: <strong>{course.instructor}</strong> • Department: {course.department}
                  </p>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 self-start">
                  {course.semester}
                </span>
              </div>

              {/* Textbooks List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Textbooks & Syllabus Materials</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.textbooks.map((tb) => (
                    <div
                      key={tb.isbn}
                      className="p-4 rounded-xl border flex flex-col justify-between space-y-3"
                      style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)' }}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-sm line-clamp-1" style={{ color: 'var(--text-main)' }}>{tb.title}</h5>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                            tb.type === 'Required' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                          }`}>
                            {tb.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">by {tb.author}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-1">ISBN: {tb.isbn}</p>
                      </div>

                      <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: 'var(--card-border)' }}>
                        <span className="text-xs font-semibold text-emerald-400">
                          {tb.availableCopies} Copies Available in Library
                        </span>
                        <Link
                          href={`/catalog?search=${encodeURIComponent(tb.title)}`}
                          className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <span>Locate in Catalog</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
