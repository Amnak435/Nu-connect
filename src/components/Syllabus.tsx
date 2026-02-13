import { useState, useEffect } from 'react';
import { BookOpen, Download, FileText, Search, Loader2, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User, AcademicDocument } from '../types';

interface SyllabusProps {
  user: User;
}

export function Syllabus({ user }: SyllabusProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [syllabusDocs, setSyllabusDocs] = useState<AcademicDocument[]>([]);
  const [currentDoc, setCurrentDoc] = useState<AcademicDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSyllabusDocs();
  }, []);

  const fetchSyllabusDocs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('academic_documents')
      .select('*')
      .in('category', ['syllabus', 'lecture'])
      .eq('semester', '4th Semester') // Use 4th Semester as master
      .eq('batch', user.batch || '2024')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSyllabusDocs(data as AcademicDocument[]);
      // Main generic doc is the one without a specific subject
      const generic = (data as AcademicDocument[]).find(d => !d.subject);
      setCurrentDoc(generic || (data[0] as AcademicDocument));
    }
    setLoading(false);
  };

  const masterCourseList = [
    {
      code: 'CS230',
      name: 'Computer Organization & Assembly Language',
      creditHours: 2,
      topics: ['ISA', 'Microarchitecture', 'Register Transfer', 'Assembly', 'Memory Hierarchy', 'I/O'],
      faculty: 'Shanza Zafar',
      examWeightage: { midterm: '30%', final: '50%', assignments: '20%' }
    },
    {
      code: 'CS231',
      name: 'Computer Organization & Assembly Language Lab',
      creditHours: 1,
      topics: ['Assembly Programming', 'CPU Simulation', 'Hardware', 'Debuggers', 'Stack', 'Interrupts'],
      faculty: 'Naveed Ahmed',
      examWeightage: { labs: '60%', project: '40%' }
    },
    {
      code: 'CS212',
      name: 'Theory of Automata',
      creditHours: 3,
      topics: ['Finite Automata', 'Regular Expressions', 'CFG', 'PDA', 'Turing Machines', 'Decidability'],
      faculty: 'Naveed Yousaf',
      examWeightage: { midterm: '30%', final: '50%', quizzes: '20%' }
    },
    {
      code: 'CS260',
      name: 'Advance Database Management Systems',
      creditHours: 2,
      topics: ['Distributed DB', 'Object-Oriented', 'Warehousing', 'Mining', 'Processing', 'Concurrency'],
      faculty: 'Rabbiya Younas',
      examWeightage: { midterm: '30%', final: '50%', assignments: '20%' }
    },
    {
      code: 'CS261',
      name: 'Advance Database Management Systems Lab',
      creditHours: 1,
      topics: ['Advanced SQL', 'PL/SQL', 'DBA', 'NoSQL', 'Reporting', 'ETL'],
      faculty: 'Rabbiya Younas',
      examWeightage: { labs: '60%', project: '40%' }
    },
    {
      code: 'GE250',
      name: 'Applied Physics',
      creditHours: 2,
      topics: ['Mechanics', 'Thermodynamics', 'EM', 'Optics', 'Modern Physics', 'Solid State'],
      faculty: 'Dr. KhushBakht',
      examWeightage: { midterm: '30%', final: '50%', assignments: '20%' }
    },
    {
      code: 'GE251',
      name: 'Applied Physics Lab',
      creditHours: 1,
      topics: ['Mechanics', 'Thermodynamics', 'EM', 'Optics', 'Modern Physics', 'Solid State'],
      faculty: 'Dr. KhushBakht',
      examWeightage: { labs: '100%' }
    },
    {
      code: 'GE111',
      name: 'Expository Writing',
      creditHours: 3,
      topics: ['Critical Reading', 'Rhetoric', 'Argumentative', 'Research', 'Citation', 'Reviews'],
      faculty: 'Mehwish',
      examWeightage: { midterm: '20%', final: '40%', portfolio: '40%' }
    },
    {
      code: 'GE111',
      name: 'Islamic Studies',
      creditHours: 2,
      topics: ['Quranic', 'Seerat', 'Civilization', 'Social System', 'Ethics', 'Human Rights'],
      faculty: 'Dr. Noushin Iqbal',
      examWeightage: { midterm: '30%', final: '50%', assignments: '20%' }
    },
    {
      code: 'MT110',
      name: 'Linear Algebra (Pre-Med)',
      creditHours: 3,
      topics: ['Linear Equations', 'Matrices', 'Vector Spaces', 'Transformations', 'Eigenvalues', 'Inward Product'],
      faculty: 'Maryam Zafar',
      examWeightage: { midterm: '30%', final: '50%', quizzes: '20%' }
    }
  ];

  const courses = masterCourseList;

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Course Syllabus</h2>
        </div>
        <p className="text-gray-600">{user.semester} - Complete Course Details</p>
      </div>

      {/* Official Syllabus Document */}
      {currentDoc && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-green-100 overflow-hidden">
          <div className="bg-green-600 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <FileText className="w-5 h-5" />
              <h3 className="font-bold">Official {user.semester} Syllabus Document</h3>
            </div>
            <a
              href={currentDoc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all"
            >
              Download Official Copy
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
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  View PDF Syllabus
                </a>
              </div>
            ) : (
              <div className="flex justify-center">
                <img
                  src={currentDoc.file_url}
                  alt="Official Syllabus"
                  className="max-h-[300px] w-auto rounded-lg shadow-sm border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Course Cards */}
      <div className="space-y-4">
        {filteredCourses.map((course, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Course Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg">
                      {course.code}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
                      {course.creditHours} Credit Hours
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">👨‍🏫 {course.faculty}</p>
                </div>
                <button
                  onClick={() => {
                    const doc = syllabusDocs.find(d => d.subject?.toLowerCase() === course.name.toLowerCase());
                    if (doc) {
                      window.open(doc.file_url, '_blank');
                    } else {
                      alert(`Official subject-wise syllabus for ${course.name} is not yet available. Please refer to the general syllabus above.`);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {syllabusDocs.some(d => d.subject?.toLowerCase() === course.name.toLowerCase()) ? 'Official' : 'PDF'}</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Topics Covered */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Topics Covered
                  </h4>
                  <ul className="space-y-2">
                    {course.topics.map((topic: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-sm">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exam Weightage */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    Assessment Breakdown
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(course.examWeightage).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-600 rounded-full"
                              style={{ width: value as string }}
                            />
                          </div>
                          <span className="text-sm font-bold text-green-600 min-w-[3rem] text-right">{value as string}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                    <h5 className="font-medium text-green-900 mb-2 text-sm">📚 Recommended Textbooks</h5>
                    <ul className="text-xs text-green-800 space-y-1">
                      <li>• Main reference book available in library</li>
                      <li>• Additional reading materials on LMS</li>
                    </ul>
                  </div>

                  {/* Lecture Materials Section */}
                  {syllabusDocs.some(d => d.category === 'lecture' && d.subject?.toLowerCase().includes(course.name.toLowerCase())) && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h5 className="font-medium text-blue-900 mb-2 text-sm flex items-center gap-2">
                        <Upload className="w-4 h-4 rotate-180" />
                        Lecture Materials
                      </h5>
                      <div className="space-y-2">
                        {syllabusDocs
                          .filter(d => d.category === 'lecture' && d.subject?.toLowerCase().includes(course.name.toLowerCase()))
                          .map((doc, i) => (
                            <a
                              key={doc.id}
                              href={doc.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="block p-2 bg-white rounded border border-blue-200 text-xs text-blue-800 hover:bg-blue-100 transition-colors flex items-center justify-between"
                            >
                              <span className="truncate flex-1">{doc.title || `Lecture ${i + 1}`}</span>
                              <Download className="w-3 h-3 text-blue-500 ml-2" />
                            </a>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No courses found matching your search</p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{courses.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Courses</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">15</p>
            <p className="text-sm text-gray-600 mt-1">Credit Hours</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{courses.length}</p>
            <p className="text-sm text-gray-600 mt-1">PDFs Available</p>
          </div>
        </div>
      </div>
    </div>
  );
}