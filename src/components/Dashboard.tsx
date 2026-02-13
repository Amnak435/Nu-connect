import { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, BookOpen, AlertCircle, CheckCircle, Edit2, X, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  user: any;
}

export function Dashboard({ user }: DashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    semester: user.semester || '1st Semester',
    batch: user.batch || '2024',
    section: user.section || 'A'
  });

  const semesters = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];
  const batches = ['2021', '2022', '2023', '2024', '2025', '2026'];
  const sections = ['A', 'B', 'C', 'D'];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          semester: formData.semester,
          batch: formData.batch,
          section: formData.section
        }
      });

      if (error) throw error;

      // Update local state by forcing a refresh or calling a parent update
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const [todaysClasses, setTodaysClasses] = useState<any[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);

  useEffect(() => {
    fetchTodaysClasses();
  }, [user]);

  const fetchTodaysClasses = async () => {
    setClassesLoading(true);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // Fetch from timetable_entries with strict targeting
    const { data: entries, error } = await supabase
      .from('timetable_entries')
      .select('*')
      .eq('semester', user.semester)
      .eq('batch', user.batch || '2024')
      .or(`section.eq.${user.section},section.eq.All`)
      .eq('day', today);

    if (!error && entries && entries.length > 0) {
      setTodaysClasses(entries.map(e => ({
        time: e.time_slot.replace(/\s/g, '').replace(/–/g, '-'),
        subject: e.subject,
        room: e.venue,
        faculty: e.faculty_name
      })));
    } else {
      // Fallback or empty if no entries found
      setTodaysClasses([]);
    }
    setClassesLoading(false);
  };

  const upcomingDeadlines = [
    { type: 'Assignment', course: 'Data Structures', title: 'Binary Tree Implementation', dueDate: 'Jan 25, 2026', urgent: true },
    { type: 'Quiz', course: 'Database Systems', title: 'SQL Queries Quiz', dueDate: 'Jan 28, 2026', urgent: false },
    { type: 'Project', course: 'Software Engineering', title: 'SRS Document Submission', dueDate: 'Feb 02, 2026', urgent: false },
  ];

  const announcements = [
    { title: 'NUTECH & PCCA Seminar on Climate-Resilient Pakistan', time: 'Jan 29, 2026', priority: 'high' },
    { title: 'Ali Trust Pakistan Delegation Visits NUTECH', time: 'Jan 28, 2026', priority: 'medium' },
    { title: 'Industry Partnership Workshop on Contract Management', time: 'Jan 25, 2026', priority: 'medium' },
    { title: 'Career Fair 2026 Registration Opens Soon', time: 'Jan 20, 2026', priority: 'low' },
  ];


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
              {user.role === 'admin' && (
                <span className="w-fit bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-white/30 backdrop-blur-sm">
                  Admin
                </span>
              )}
            </div>

            {!isEditing ? (
              <p className="text-green-100 italic">
                {user.department} • {user.batch} • Section {user.section}
              </p>
            ) : (
              <p className="text-green-100">Updating your profile information...</p>
            )}
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
            title="Edit Profile"
          >
            {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
            <div>
              <label className="block text-xs text-green-100 mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:bg-white/20"
              >
                {semesters.map(s => <option key={s} value={s} className="text-gray-800">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-green-100 mb-1">Batch</label>
              <select
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:bg-white/20"
              >
                {batches.map(b => <option key={b} value={b} className="text-gray-800">{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-green-100 mb-1">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:bg-white/20"
              >
                {sections.map(s => <option key={s} value={s} className="text-gray-800">{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-50 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="bg-white/10 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
              <p className="text-[9px] text-green-100 italic leading-none">Semester</p>
              <p className="text-sm font-semibold mt-0.5">{user.semester}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
              <p className="text-[9px] text-green-100 italic leading-none">Reg / ID</p>
              <p className="text-sm font-semibold mt-0.5">{user.registrationNo}</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">3</span>
          </div>
          <p className="text-sm text-gray-600">Classes Today</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">3</span>
          </div>
          <p className="text-sm text-gray-600">Pending Tasks</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-bold text-red-600">UNPAID</span>
          </div>
          <p className="text-sm text-gray-600">Fee Status</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">12</span>
          </div>
          <p className="text-sm text-gray-600">Days to Midterm</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-800">Today's Classes</h3>
            <p className="text-sm text-gray-600 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="p-6 space-y-4">
            {classesLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-2" />
                <p className="text-sm text-gray-500">Fetching your schedule...</p>
              </div>
            ) : todaysClasses.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No classes scheduled for today.</p>
                <p className="text-xs mt-1">Time to relax! ☕</p>
              </div>
            ) : (
              todaysClasses.map((cls, index) => (
                <div key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                  <div className="text-center shrink-0">
                    <div className="w-14 sm:w-20 h-14 sm:h-20 bg-green-600 text-white rounded-lg flex flex-col items-center justify-center overflow-hidden shadow-md">
                      <Clock className="w-3.5 sm:w-5 h-3.5 sm:h-5 mb-0.5 sm:mb-1 opacity-80" />
                      <span className="text-[9px] sm:text-xs font-bold px-1 text-center leading-tight">
                        {cls.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{cls.subject}</h4>
                    <p className="text-sm text-gray-600 mt-1">{cls.faculty}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md uppercase">
                        📍 {cls.room}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-800">Upcoming Deadlines</h3>
            <p className="text-sm text-gray-600 mt-1">Don't miss these important dates</p>
          </div>
          <div className="p-6 space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
                {deadline.urgent ? (
                  <AlertCircle className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                      {deadline.type}
                    </span>
                    {deadline.urgent && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                        Urgent
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800">{deadline.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{deadline.course}</p>
                  <p className="text-xs text-gray-500 mt-1">Due: {deadline.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Announcements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Latest Announcements</h3>
          <p className="text-sm text-gray-600 mt-1">Stay updated with campus news</p>
        </div>
        <div className="divide-y">
          {announcements.map((announcement, index) => (
            <div key={index} className="p-4 hover:bg-purple-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${announcement.priority === 'high' ? 'bg-red-500' :
                  announcement.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{announcement.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{announcement.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}