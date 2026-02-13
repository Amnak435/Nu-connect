import { useState, useEffect } from 'react';
import { Users, FileText, Calendar, CheckCircle, Clock, Download, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

import { User, AcademicDocument, AttendanceRecord } from '../types';

interface ClassroomSyncProps {
  user: User;
}

export function ClassroomSync({ user }: ClassroomSyncProps) {
  const [lectureMaterials, setLectureMaterials] = useState<AcademicDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  useEffect(() => {
    fetchLectureMaterials();
    if (user) fetchAttendance();
  }, [user]);

  const fetchAttendance = async () => {
    setAttendanceLoading(true);
    const userId = user.registrationNo;
    if (!userId) {
      setAttendanceLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', userId);

    if (!error && data) {
      setAttendanceData(data.map(item => ({
        course: item.course_name,
        attended: item.attended_classes || 0,
        total: item.total_classes || 1,
        percentage: ((item.attended_classes || 0) / (item.total_classes || 1)) * 100
      })));
    }
    setAttendanceLoading(false);
  };

  const fetchLectureMaterials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('academic_documents')
      .select('*')
      .eq('category', 'lecture')
      .eq('semester', user.semester)
      .eq('batch', user.batch || '2024')
      .or(`section.eq.${user.section || 'A'},section.eq.All`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLectureMaterials(data as AcademicDocument[]);
    }
    setLoading(false);
  };

  const handleGoogleClassroomLogin = () => {
    window.open('https://classroom.google.com/', '_blank');
  };


  const assignments = [
    { course: 'Data Structures', title: 'Binary Tree Implementation', dueDate: 'Jan 25, 2026', status: 'pending', marks: 10 },
    { course: 'Database Systems', title: 'SQL Query Assignment', dueDate: 'Jan 20, 2026', status: 'submitted', marks: 10 },
    { course: 'Software Engineering', title: 'SRS Document', dueDate: 'Feb 02, 2026', status: 'pending', marks: 15 },
    { course: 'Computer Networks', title: 'OSI Model Report', dueDate: 'Jan 18, 2026', status: 'graded', marks: 8, obtained: 7 },
    { course: 'Operating Systems', title: 'Process Scheduling', dueDate: 'Jan 30, 2026', status: 'pending', marks: 10 }
  ];

  const announcements = [
    { course: 'Data Structures', message: 'Assignment deadline extended to Jan 28', faculty: 'Dr. Sarah Ahmed', time: '2 hours ago' },
    { course: 'Database Systems', message: 'Quiz on SQL Joins next week', faculty: 'Prof. Ali Hassan', time: '5 hours ago' },
    { course: 'Software Engineering', message: 'Project groups to be finalized by Friday', faculty: 'Dr. Fatima Khan', time: '1 day ago' }
  ];

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600 bg-green-50';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85) return 'Good Standing';
    if (percentage >= 75) return 'Warning';
    return 'At Risk';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Classroom Sync</h2>
            </div>
            <p className="text-gray-600">Track attendance, assignments, and course materials</p>
          </div>
          <button
            onClick={handleGoogleClassroomLogin}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1a73e8] text-white rounded-xl font-bold hover:bg-[#1557b0] transition-all shadow-md group"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/classroom_48dp.png" alt="Classroom" className="w-6 h-6" />
            <span>Access Google Classroom</span>
            <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Attendance Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Attendance Overview</h3>
          <p className="text-sm text-gray-600 mt-1">Minimum 75% required to sit in exams</p>
        </div>
        <div className="p-6 space-y-4">
          {attendanceLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
              <p className="text-sm text-gray-500">Syncing attendance data...</p>
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No attendance records found.</p>
              <p className="text-xs mt-1 text-gray-400">Records will appear once uploaded by the department.</p>
            </div>
          ) : (
            attendanceData.map((course, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{course.course}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {course.attended} / {course.total} classes attended
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-40 sm:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${course.percentage >= 85 ? 'bg-green-500' :
                          course.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        style={{ width: `${course.percentage}%` }}
                      />
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className={`font-bold ${getAttendanceColor(course.percentage)} px-3 py-1 rounded-full text-xs`}>
                        {course.percentage.toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-tighter">{getAttendanceStatus(course.percentage)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assignments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Assignments & Submissions</h3>
          <p className="text-sm text-gray-600 mt-1">Track your assignment progress</p>
        </div>
        <div className="divide-y">
          {assignments.map((assignment, index) => (
            <div key={index} className="p-5 hover:bg-orange-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                      {assignment.course}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded font-medium ${assignment.status === 'graded' ? 'bg-green-100 text-green-700' :
                      assignment.status === 'submitted' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                      {assignment.status === 'graded' ? '✓ Graded' :
                        assignment.status === 'submitted' ? '📤 Submitted' : '⏳ Pending'}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800">{assignment.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {assignment.dueDate}
                    </span>
                    <span>Total Marks: {assignment.marks}</span>
                    {assignment.status === 'graded' && (
                      <span className="font-semibold text-green-600">
                        Obtained: {assignment.obtained}/{assignment.marks}
                      </span>
                    )}
                  </div>
                </div>
                {assignment.status === 'pending' && (
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                    Submit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lecture Materials */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">Lecture Materials</h3>
              <p className="text-sm text-gray-600 mt-1">Official materials from instructors</p>
            </div>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-purple-600" />}
          </div>
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {lectureMaterials.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No lecture materials uploaded yet.</p>
              </div>
            ) : (
              lectureMaterials.map((material, index) => (
                <div key={index} className="p-4 hover:bg-purple-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm truncate">{material.title}</h4>
                      <p className="text-xs text-purple-600 font-bold mt-1 uppercase">{material.subject}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">👨‍🏫 {material.instructor || 'Staff'}</span>
                        <span>•</span>
                        <span>{material.created_at?.split('T')[0]}</span>
                        <span>•</span>
                        <span className="font-medium text-gray-700 uppercase">{material.file_type}</span>
                      </div>
                      {material.description && (
                        <p className="text-[10px] text-gray-400 mt-1 italic line-clamp-1">{material.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => window.open(material.file_url, '_blank')}
                      className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 text-purple-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Faculty Announcements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-800">Faculty Announcements</h3>
            <p className="text-sm text-gray-600 mt-1">Latest updates from instructors</p>
          </div>
          <div className="divide-y">
            {announcements.map((announcement, index) => (
              <div key={index} className="p-5 hover:bg-green-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0" />
                  <div className="flex-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                      {announcement.course}
                    </span>
                    <p className="text-gray-800 mt-2">{announcement.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                      <span>👨‍🏫 {announcement.faculty}</span>
                      <span>•</span>
                      <span>{announcement.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {attendanceData.length > 0
                ? (attendanceData.reduce((acc, curr) => acc + curr.percentage, 0) / attendanceData.length).toFixed(1)
                : '0'}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Avg Attendance</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {assignments.filter(a => a.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Pending Tasks</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{lectureMaterials.length}</p>
            <p className="text-sm text-gray-600 mt-1">Materials Available</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">2</p>
            <p className="text-sm text-gray-600 mt-1">Completed Tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
}