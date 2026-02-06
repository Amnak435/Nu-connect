import { useState, useEffect } from 'react';
import { Calendar, Clock, Download, AlertCircle, FileText, Upload, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DateSheetProps {
  user: any;
}

export function DateSheet({ user }: DateSheetProps) {
  const [examType, setExamType] = useState('midterm');
  const [currentDoc, setCurrentDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDateSheetDoc();
  }, [examType]);

  const fetchDateSheetDoc = async () => {
    setLoading(true);
    // Fetch doc that matches:
    // 1. Category = datesheet
    // 2. sub_category = midterm or final (matching current view)
    // 3. Semester & Batch
    // 4. Section (A/B/C/D or Alpha/Beta/Gamma/Delta or 'All')
    const { data, error } = await supabase
      .from('academic_documents')
      .select('*')
      .eq('category', 'datesheet')
      .eq('sub_category', examType === 'midterm' ? 'midterm' : 'final')
      .eq('semester', user.semester)
      .eq('batch', user.batch || '2024')
      .or(`section.eq.${user.section},section.eq.All,section.eq.${user.section === 'A' ? 'Alpha' : user.section === 'B' ? 'Beta' : user.section === 'C' ? 'Gamma' : 'Delta'}`)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      setCurrentDoc(data[0]);
    } else {
      setCurrentDoc(null);
    }
    setLoading(false);
  };

  const midtermExams = [
    { date: 'Feb 02, 2026', day: 'Monday', time: '09:00 AM - 11:00 AM', course: 'Data Structures', code: 'CS-301', room: 'Exam Hall A' },
    { date: 'Feb 04, 2026', day: 'Wednesday', time: '09:00 AM - 11:00 AM', course: 'Database Systems', code: 'CS-302', room: 'Exam Hall B' },
    { date: 'Feb 06, 2026', day: 'Friday', time: '09:00 AM - 11:00 AM', course: 'Software Engineering', code: 'CS-303', room: 'Exam Hall A' },
    { date: 'Feb 09, 2026', day: 'Monday', time: '02:00 PM - 04:00 PM', course: 'Computer Networks', code: 'CS-304', room: 'Exam Hall C' },
    { date: 'Feb 11, 2026', day: 'Wednesday', time: '09:00 AM - 11:00 AM', course: 'Operating Systems', code: 'CS-305', room: 'Exam Hall B' },
  ];

  const finalExams = [
    { date: 'May 10, 2026', day: 'Sunday', time: '09:00 AM - 12:00 PM', course: 'Data Structures', code: 'CS-301', room: 'Exam Hall A' },
    { date: 'May 13, 2026', day: 'Wednesday', time: '09:00 AM - 12:00 PM', course: 'Database Systems', code: 'CS-302', room: 'Exam Hall B' },
    { date: 'May 16, 2026', day: 'Saturday', time: '09:00 AM - 12:00 PM', course: 'Software Engineering', code: 'CS-303', room: 'Exam Hall A' },
    { date: 'May 19, 2026', day: 'Tuesday', time: '02:00 PM - 05:00 PM', course: 'Computer Networks', code: 'CS-304', room: 'Exam Hall C' },
    { date: 'May 22, 2026', day: 'Friday', time: '09:00 AM - 12:00 PM', course: 'Operating Systems', code: 'CS-305', room: 'Exam Hall B' },
  ];

  const exams = examType === 'midterm' ? midtermExams : finalExams;

  const getDaysUntilExam = (examDate: string) => {
    const today = new Date('2026-01-21');
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Examination Date Sheet</h2>
            </div>
            <p className="text-gray-600">{user.department} - {user.semester}</p>
          </div>
          <button
            onClick={() => {
              if (currentDoc) {
                window.open(currentDoc.file_url, '_blank');
              } else {
                alert('Official verified date sheet not yet available for download.');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download {currentDoc ? 'Official' : 'PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official Date Sheet Document */}
      {currentDoc && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-red-100 overflow-hidden">
          <div className="bg-red-600 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <FileText className="w-5 h-5" />
              <h3 className="font-bold">Official {user.semester} Date Sheet</h3>
            </div>
            <a
              href={currentDoc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all"
            >
              Download PDF
            </a>
          </div>
          <div className="p-4 bg-gray-50 border-b">
            {currentDoc.file_type?.toLowerCase() === 'pdf' ? (
              <div className="py-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">{currentDoc.title}</p>
                <a
                  href={currentDoc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  View PDF Date Sheet
                </a>
              </div>
            ) : (
              <div className="flex justify-center">
                <img
                  src={currentDoc.file_url}
                  alt="Official Date Sheet"
                  className="max-h-[350px] w-auto rounded-lg shadow-sm border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exam Type Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setExamType('midterm')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${examType === 'midterm'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Midterm Exams
          </button>
          <button
            onClick={() => setExamType('final')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${examType === 'final'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Final Exams
          </button>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-yellow-900 mb-1">Important Instructions</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Arrive at least 30 minutes before exam time</li>
            <li>• Bring your student ID card and admit card</li>
            <li>• Use of mobile phones is strictly prohibited</li>
            <li>• Cheating will result in exam cancellation</li>
          </ul>
        </div>
      </div>

      {/* Exam Schedule - ONLY show if no official doc is present */}
      {!currentDoc ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-800">
              {examType === 'midterm' ? 'Midterm' : 'Final'} Examination Schedule (Predicted)
            </h3>
            <p className="text-sm text-gray-600 mt-1">Note: This is a predicted timeline. Refer to the Official Date Sheet if available.</p>
          </div>

          <div className="divide-y">
            {exams.map((exam, index) => {
              const daysUntil = getDaysUntilExam(exam.date);
              const isUrgent = daysUntil <= 7 && daysUntil > 0;
              const isPast = daysUntil < 0;

              return (
                <div
                  key={index}
                  className={`p-6 hover:bg-green-50 transition-colors ${isPast ? 'opacity-50' : ''
                    }`}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Date Box */}
                    <div className="shrink-0">
                      <div className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center ${isUrgent ? 'bg-red-500' : isPast ? 'bg-gray-400' : 'bg-green-600'
                        } text-white shadow-md`}>
                        <span className="text-sm">{exam.date.split(' ')[0]}</span>
                        <span className="text-2xl font-bold">{exam.date.split(' ')[1].replace(',', '')}</span>
                        <span className="text-sm">{exam.date.split(' ')[2]}</span>
                      </div>
                      {daysUntil > 0 && (
                        <div className={`text-center mt-2 text-sm font-medium ${isUrgent ? 'text-red-600' : 'text-green-600'
                          }`}>
                          {daysUntil} days left
                        </div>
                      )}
                    </div>

                    {/* Exam Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">{exam.course}</h4>
                          <p className="text-sm text-gray-600 mt-1">Course Code: {exam.code}</p>
                        </div>
                        {isUrgent && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                            <AlertCircle className="w-4 h-4" />
                            Upcoming
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{exam.day}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{exam.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-sm">📍 {exam.room}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900">Official Date Sheet Loaded</h4>
            <p className="text-sm text-blue-800">The generic schedule has been replaced by the official document uploaded by the Admin Office for your section ({user.section}).</p>
          </div>
        </div>
      )}

      {/* Exam Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{exams.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Exams</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {examType === 'midterm' ? '12' : '109'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Days Until First Exam</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {examType === 'midterm' ? '10' : '13'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Exam Duration (days)</p>
          </div>
        </div>
      </div>
    </div>
  );
}