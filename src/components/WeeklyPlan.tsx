import { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, MapPin, BookOpen, FlaskConical, User as UserIcon, Loader2, FileText, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

import { User, ClassSlot, AcademicDocument } from '../types';

interface WeeklyPlanProps {
  user: User;
}

// Default Fallback Data
const defaultSchedules: Record<string, Record<string, ClassSlot[]>> = {
  '1st Semester': {
    Monday: [{ time: '08:30 – 09:20', subject: 'Programming Fundamentals', type: 'Lecture', venue: 'AC-301' }],
    Tuesday: [{ time: '08:30 – 09:20', subject: 'Application of ICT', type: 'Lecture', venue: 'AC-301' }],
    Wednesday: [{ time: '10:10 – 11:00', subject: 'Math I', type: 'Lecture', venue: 'AC-203' }],
    Thursday: [{ time: '08:30 – 09:20', subject: 'Programming Fundamentals', type: 'Lecture', venue: 'AC-301' }],
    Friday: [{ time: '08:30 – 09:20', subject: 'Programming Fundamentals', type: 'Lecture', venue: 'AC-301' }],
  },
  '2nd Semester': {
    Monday: [{ time: '12:50 – 13:40', subject: 'Object Oriented Programming', type: 'Lecture', teacher: 'Lec. Alina Maryum', venue: 'AC-301' }],
    Tuesday: [{ time: '12:50 – 13:40', subject: 'Database Systems', type: 'Lecture', teacher: 'Lec. Sundas Rana', venue: 'AC-301' }],
    Wednesday: [{ time: '11:15 – 12:05', subject: 'Digital Logic Design', type: 'Lecture', teacher: 'Lec. Tahreem Khalil', venue: 'AC-301' }],
    Thursday: [{ time: '11:15 – 12:05', subject: 'Multivariable Calculus', type: 'Lecture', teacher: 'Dr. Atta Ullah', venue: 'AC-301' }],
    Friday: [],
  },
};

// Time slots for reference
const timeSlots = [
  '08:30-09:20', '09:20-10:10', '10:10-11:00', '11:00-11:50', '11:15-12:05',
  '11:50-12:40', '12:40-13:30', '12:50-13:40', '13:30-14:20', '13:45-14:35',
  '14:20-15:10', '14:40-15:30', '15:10-16:00',
];

export function WeeklyPlan({ user }: WeeklyPlanProps) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedSemester, setSelectedSemester] = useState(user?.semester || '2nd Semester');
  const [dbSchedules, setDbSchedules] = useState<Record<string, Record<string, ClassSlot[]>>>({});
  const [loading, setLoading] = useState(true);
  const [currentDoc, setCurrentDoc] = useState<AcademicDocument | null>(null);

  useEffect(() => {
    fetchTimetable();
  }, [selectedSemester]);

  const fetchTimetable = async () => {
    setLoading(true);

    // 1. Fetch structured entries specifically for 4th Semester Section B (The Master Schedule)
    const { data: entries, error: entryError } = await supabase
      .from('timetable_entries')
      .select('*')
      .eq('semester', '4th Semester')
      .eq('batch', '2024')
      .or(`section.eq.B,section.eq.All`);

    if (!entryError && entries && entries.length > 0) {
      const formatted: Record<string, Record<string, ClassSlot[]>> = {};

      // Populate EVERYTHING with this data
      semesters.forEach(sem => {
        formatted[sem] = {};
        entries.forEach(entry => {
          if (!formatted[sem][entry.day]) formatted[sem][entry.day] = [];
          formatted[sem][entry.day].push({
            time: entry.time_slot,
            subject: entry.subject,
            type: entry.type as 'Lecture' | 'Lab',
            teacher: entry.faculty_name,
            venue: entry.venue
          });
        });
      });
      setDbSchedules(formatted);
    }

    // 2. Fetch the latest OFFICIAL DOCUMENT for 4th Semester
    const { data: docs, error: docError } = await supabase
      .from('academic_documents')
      .select('*')
      .eq('category', 'timetable')
      .eq('semester', '4th Semester')
      .eq('batch', '2024')
      .order('created_at', { ascending: false })
      .limit(1);

    if (!docError && docs && docs.length > 0) {
      setCurrentDoc(docs[0] as AcademicDocument);
    } else {
      setCurrentDoc(null);
    }

    setLoading(false);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const semesters = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];

  const activeSchedules = Object.keys(dbSchedules).length > 0 ? dbSchedules : defaultSchedules;

  // Get schedule for selected semester and day
  const currentSchedule = useMemo(() => {
    const semSchedule = activeSchedules[selectedSemester];
    if (!semSchedule) return [];
    return semSchedule[selectedDay] || [];
  }, [activeSchedules, selectedSemester, selectedDay]);

  // Calculate stats for selected semester
  const stats = useMemo(() => {
    const semSchedule = activeSchedules[selectedSemester];
    if (!semSchedule) return { totalClasses: 0, labSessions: 0, uniqueCourses: 0 };

    let totalClasses = 0;
    let labSessions = 0;
    const courseSet = new Set<string>();

    Object.values(semSchedule).forEach((dayClasses) => {
      dayClasses.forEach((cls) => {
        totalClasses++;
        if (cls.type === 'Lab') labSessions++;
        courseSet.add(cls.subject.replace(' Lab', ''));
      });
    });

    return {
      totalClasses,
      labSessions,
      uniqueCourses: courseSet.size,
    };
  }, [activeSchedules, selectedSemester]);

  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Determine semester type
  const isSpring = parseInt(selectedSemester) % 2 === 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
        <p className="text-gray-500">Loading live timetable...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Weekly Timetable</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              NUTECH CS Department • {isSpring ? 'Spring' : 'Fall'} 2026
            </p>
          </div>

          {/* Semester Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Select Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white min-w-[160px]"
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Official Document View */}
      {currentDoc && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-green-100 overflow-hidden">
          <div className="bg-green-600 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <FileText className="w-5 h-5" />
              <h3 className="font-bold">Official {selectedSemester} Timetable</h3>
            </div>
            <a
              href={currentDoc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all"
            >
              Open Full Size
            </a>
          </div>
          <div className="p-4 bg-gray-50 flex justify-center border-b">
            {currentDoc.file_type?.toLowerCase() === 'pdf' ? (
              <div className="py-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Timetable available as PDF document</p>
                <a
                  href={currentDoc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-all"
                >
                  <Upload className="w-4 h-4 rotate-180" />
                  View PDF Timetable
                </a>
              </div>
            ) : (
              <div className="relative group max-w-4xl w-full">
                <img
                  src={currentDoc.file_url}
                  alt="Official Timetable"
                  className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <a
                    href={currentDoc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-green-700 px-6 py-2 rounded-full font-bold shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
                  >
                    Click to Zoom
                  </a>
                </div>
              </div>
            )}
          </div>
          {currentDoc.description && (
            <div className="px-6 py-3 bg-white text-sm text-gray-500 italic">
              Note: {currentDoc.description}
            </div>
          )}
        </div>
      )}

      {/* Day Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all whitespace-nowrap flex items-center gap-2 ${selectedDay === day
                ? 'bg-green-600 text-white shadow-md'
                : day === today
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {day}
              {day === today && selectedDay !== day && (
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule for Selected Day */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{selectedDay}'s Schedule</h3>
              <p className="text-sm text-gray-600 mt-1">
                {currentSchedule.length} {currentSchedule.length === 1 ? 'class' : 'classes'} scheduled • {selectedSemester}
              </p>
            </div>
            {selectedDay === today && (
              <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
                Today
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {currentSchedule.length > 0 ? (
            <div className="space-y-4">
              {currentSchedule.map((cls, index) => (
                <div
                  key={index}
                  className={`relative border-l-4 ${cls.type === 'Lab' ? 'border-purple-500' : 'border-green-500'
                    } bg-gray-50 rounded-lg p-5 hover:bg-green-50 transition-colors`}
                >
                  <div className="flex flex-col gap-3">
                    {/* Time & Type */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-green-700 font-medium">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-mono">{cls.time}</span>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${cls.type === 'Lab'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                        }`}>
                        {cls.type === 'Lab' ? (
                          <FlaskConical className="w-3 h-3" />
                        ) : (
                          <BookOpen className="w-3 h-3" />
                        )}
                        {cls.type}
                      </span>
                    </div>

                    {/* Subject */}
                    <h4 className="font-bold text-gray-800 text-lg">{cls.subject}</h4>

                    {/* Teacher & Venue */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {cls.teacher && (
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-blue-500" />
                          <span>{cls.teacher}</span>
                        </div>
                      )}
                      {cls.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{cls.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No classes on {selectedDay}</p>
              <p className="text-gray-400 text-sm mt-1">Enjoy your free day! 🎉</p>
            </div>
          )}
        </div>
      </div>

      {/* Full Week Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Full Week Overview - {selectedSemester}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b w-32">Time</th>
                {days.map((day) => (
                  <th key={day} className={`px-4 py-3 text-left text-sm font-medium border-b ${day === today ? 'bg-green-50 text-green-700' : 'text-gray-600'
                    }`}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => {
                const dayEntries = days.map(day => {
                  const daySchedule = activeSchedules[selectedSemester]?.[day] || [];
                  // Match with tolerance for hyphens/spaces
                  return daySchedule.find(c => {
                    const normalizedC = c.time.replace(/\s/g, '').replace(/–/g, '-');
                    const normalizedSlot = slot.replace(/\s/g, '').replace(/–/g, '-');
                    return normalizedC === normalizedSlot;
                  });
                });

                const hasAnyClass = dayEntries.some(c => !!c);

                if (!hasAnyClass) return null;

                return (
                  <tr key={slot} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-mono text-gray-600 whitespace-nowrap">
                      {slot}
                    </td>
                    {days.map((day, idx) => {
                      const cls = dayEntries[idx];

                      return (
                        <td key={day} className={`px-3 py-2 ${day === today ? 'bg-green-50/50' : ''}`}>
                          {cls ? (
                            <div className={`px-3 py-2 rounded-lg text-xs ${cls.type === 'Lab'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-green-100 text-green-800 border border-green-200'
                              }`}>
                              <div className="font-semibold truncate">{cls.subject}</div>
                              {cls.venue && (
                                <div className="text-[10px] opacity-75 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {cls.venue}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalClasses}</p>
            <p className="text-[10px] sm:text-sm text-gray-600 mt-1 uppercase tracking-wider font-semibold">Classes/Week</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.labSessions}</p>
            <p className="text-[10px] sm:text-sm text-gray-600 mt-1 uppercase tracking-wider font-semibold">Labs</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 col-span-2 md:col-span-1">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.uniqueCourses}</p>
            <p className="text-[10px] sm:text-sm text-gray-600 mt-1 uppercase tracking-wider font-semibold">Courses</p>
          </div>
        </div>
      </div>

      {/* Course List for Semester */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">📚 Courses - {selectedSemester}</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from(new Set(
              Object.values(activeSchedules[selectedSemester] || {})
                .flat()
                .map(c => c.subject)
            )).map((course, idx) => {
              const courseData = Object.values(activeSchedules[selectedSemester] || {})
                .flat()
                .find(c => c.subject === course);
              const isLab = course.includes('Lab');

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${isLab
                    ? 'bg-purple-50 border-purple-200'
                    : 'bg-green-50 border-green-200'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    {isLab ? (
                      <FlaskConical className="w-4 h-4 text-purple-600 mt-0.5" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-green-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{course}</p>
                      {courseData?.teacher && (
                        <p className="text-xs text-gray-600 mt-1">{courseData.teacher}</p>
                      )}
                      {courseData?.venue && (
                        <p className="text-xs text-gray-500">{courseData.venue}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}