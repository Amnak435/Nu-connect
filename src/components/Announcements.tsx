import { useState, useEffect } from 'react';
import { Megaphone, AlertCircle, Info, CheckCircle, Calendar, Filter, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnnouncementsProps {
  user: any;
}

export function Announcements({ user }: AnnouncementsProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    // Fetch announcements that apply to this student specifically
    // 1. Matches student's department OR is 'All'
    // 2. Matches student's batch OR is 'All'
    // 3. Matches student's semester OR is 'All'
    // 4. Matches student's section OR is 'All'
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .or(`department.eq.${user.department},department.eq.All Departments,department.eq.All`)
      .or(`batch.eq.${user.batch},batch.eq.All`)
      .or(`semester.eq.${user.semester},semester.eq.All`)
      .or(`section.eq.${user.section},section.eq.All`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAnnouncements(data);
    }
    setLoading(false);
  };

  const categories = ['all', 'exam', 'academic', 'fee', 'event', 'facility', 'general'];
  const priorities = ['all', 'high', 'medium', 'low'];

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesCategory = selectedFilter === 'all' || announcement.category === selectedFilter;
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    const matchesDepartment =
      !announcement.department ||
      announcement.department === 'All Departments' ||
      announcement.department === user.department;
    return matchesCategory && matchesPriority && matchesDepartment;
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      exam: 'bg-red-100 text-red-700',
      academic: 'bg-blue-100 text-blue-700',
      fee: 'bg-green-100 text-green-700',
      event: 'bg-purple-100 text-purple-700',
      facility: 'bg-orange-100 text-orange-700',
      general: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Important Announcements</h2>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Stay updated with the latest campus news</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Filter Announcements</h3>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">Category</label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedFilter(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${selectedFilter === category
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">Priority Level</label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  onClick={() => setSelectedPriority(priority)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${selectedPriority === priority
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden hover:shadow-md transition-shadow ${getPriorityColor(announcement.priority)}`}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1">
                  {getPriorityIcon(announcement.priority)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadge(announcement.category)}`}>
                      {announcement.category.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                      {announcement.priority.toUpperCase()} PRIORITY
                    </span>
                    {announcement.department !== 'All Departments' && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {announcement.department}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-800 text-lg mb-3">{announcement.title}</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">{announcement.message}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{announcement.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📢</span>
                      <span>{announcement.postedBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No announcements found matching your filters</p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{announcements.length}</p>
            <p className="text-[10px] sm:text-sm text-gray-600 mt-1 uppercase font-semibold">Total</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
              {announcements.filter(a => a.priority === 'high').length}
            </p>
            <p className="text-[10px] sm:text-sm text-gray-600 mt-1 uppercase font-semibold text-red-600">High</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
              {announcements.filter(a => a.priority === 'medium').length}
            </p>
            <p className="text-[10px] sm:text-sm text-gray-600 mt-1 uppercase font-semibold text-yellow-600">Medium</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
              {announcements.filter(a => a.priority === 'low').length}
            </p>
            <p className="text-[10px] sm:text-sm text-gray-600 mt-1 uppercase font-semibold text-green-600">Low</p>
          </div>
        </div>
      </div>
    </div>
  );
}