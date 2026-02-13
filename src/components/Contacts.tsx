import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Search, User, GraduationCap, Wrench } from 'lucide-react';

export function Contacts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'senior-faculty', 'lecturers', 'lab-engineers', 'administration', 'support'];

  const contacts = [
    // Senior Faculty & Head
    {
      category: 'senior-faculty',
      name: 'Dr. Muhammad Rashid',
      designation: 'Principal NUSIT & Head of Computer Science',
      department: 'Computer Science',
      email: 'dr.rashid@nutech.edu.pk',
      phone: '+92-51-9876544',
      office: 'CS Building, Room 101',
      hours: 'Mon-Fri, 9:00 AM - 3:00 PM',
      expertise: 'AI, Software Development, Advanced Computing'
    },
    {
      category: 'senior-faculty',
      name: 'Dr. Sultan Daud Khan',
      designation: 'Associate Professor',
      department: 'Computer Science',
      email: 'sultan.khan@nutech.edu.pk',
      phone: '+92-51-9876545',
      office: 'CS Building, Room 201',
      hours: 'Mon-Thu, 10:00 AM - 2:00 PM',
      expertise: 'Computer Vision, Image Processing'
    },
    {
      category: 'senior-faculty',
      name: 'Dr. Maria Kanwal',
      designation: 'Assistant Professor',
      department: 'Computer Science',
      email: 'maria.kanwal@nutech.edu.pk',
      phone: '+92-51-9876546',
      office: 'CS Building, Room 202',
      hours: 'Tue-Thu, 11:00 AM - 1:00 PM',
      expertise: 'Data Science, Machine Learning'
    },

    // Lecturers
    {
      category: 'lecturers',
      name: 'Ms. Alina Maryum',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'alinamaryum@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Machine Learning, Digital Image Processing, Deep Learning'
    },
    {
      category: 'lecturers',
      name: 'Ms. Amna Ikram',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'amna.ikram@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Mr. Asif Mehmood',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'asif.mehmood@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'AI, Machine Learning, Biometrics'
    },
    {
      category: 'lecturers',
      name: 'Mr. Naveed Yousaf',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'naveedyousaf@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Cybersecurity, Computer Vision, Data Science'
    },
    {
      category: 'lecturers',
      name: 'Ms. Noushin Saba',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'noushin.saba@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'AI, Machine Learning, Data Science, Computer Vision'
    },
    {
      category: 'lecturers',
      name: 'Ms. Tehreem Fatima',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'tehreemfatimaf22@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Machine Learning, Deep Learning'
    },
    {
      category: 'lecturers',
      name: 'Ms. Faria Sajjad',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'faria.sajjad@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Ms. Kiran Jabeen',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'kiranjabeen@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Ms. Laraib Khan',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'laraibkhan@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Mr. Mehran Yousaf',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'mehranyousaf@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Ms. Momina Mir',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'mominamir@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Mr. Muhammad Bilal Rehman',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'bilalrehman.cs@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Ms. Saba Farooq',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'sabafarooq@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Ms. Saima Yasmeen',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'saimayasmeen@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Ms. Shanza Zafar',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'shanzazafar@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Ms. Sumera Aslam',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'sumeraaslam@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Ms. Tayyaba Kalsoom',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'tayyabakalsoom@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Ms. Zainab Iftikhar',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'zainabiftikhar@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Mr. Umar Aftab',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'umaraftab@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },
    {
      category: 'lecturers',
      name: 'Ms. Tabinda Nasir',
      designation: 'Lecturer',
      department: 'Computer Science',
      email: 'tabindanasir@nutech.edu.pk',
      office: 'CS Building',
      expertise: 'Computer Science'
    },

    // Lab Engineers
    {
      category: 'lab-engineers',
      name: 'Mr. Muhammad Arsalan',
      designation: 'Junior Lab Engineer',
      department: 'Computer Science',
      email: 'arsalan@nutech.edu.pk',
      office: 'CS Lab Building',
      expertise: 'Lab Support & Technical Assistance'
    },
    {
      category: 'lab-engineers',
      name: 'Ms. Ishrat Jabeen',
      designation: 'Junior Lab Engineer',
      department: 'Computer Science',
      email: 'ishrat.jabeen@nutech.edu.pk',
      office: 'CS Lab Building',
      expertise: 'Lab Support & Technical Assistance'
    },
    {
      category: 'lab-engineers',
      name: 'Mr. Mohsin Suleman',
      designation: 'Junior Lab Engineer',
      department: 'Computer Science',
      email: 'mohsin.suleman@nutech.edu.pk',
      office: 'CS Lab Building',
      expertise: 'Lab Support & Technical Assistance'
    },
    {
      category: 'lab-engineers',
      name: 'Engr. Muhammad Haseeb Khan',
      designation: 'Junior Lab Engineer',
      department: 'Computer Science',
      email: 'haseeb.khan@nutech.edu.pk',
      office: 'CS Lab Building',
      expertise: 'Lab Support & Technical Assistance'
    },
    {
      category: 'lab-engineers',
      name: 'Ms. Sabahat Fatima',
      designation: 'Junior Lab Engineer',
      department: 'Computer Science',
      email: 'sabahat.fatima@nutech.edu.pk',
      office: 'CS Lab Building',
      expertise: 'Lab Support & Technical Assistance'
    },
    {
      category: 'lab-engineers',
      name: 'Mr. Syed Aizaz Hussain Shah',
      designation: 'Junior Lab Engineer',
      department: 'Computer Science',
      email: 'aizaz.shah@nutech.edu.pk',
      office: 'CS Lab Building',
      expertise: 'Lab Support & Technical Assistance'
    },
    {
      category: 'lab-engineers',
      name: 'Mr. Umair',
      designation: 'Junior Lab Engineer',
      department: 'Computer Science',
      email: 'umair@nutech.edu.pk',
      office: 'CS Lab Building',
      expertise: 'Lab Support & Technical Assistance'
    },

    // Administration
    {
      category: 'administration',
      name: 'CS Department Office',
      designation: 'Department Administration',
      department: 'Computer Science',
      email: 'cs.dept@nutech.edu.pk',
      phone: '+92-51-9876543',
      office: 'CS Building, Ground Floor',
      hours: 'Mon-Fri, 8:00 AM - 4:00 PM'
    },
    {
      category: 'administration',
      name: 'Examination Office',
      designation: 'Exam Controller',
      department: 'Examinations',
      email: 'exams@nutech.edu.pk',
      phone: '+92-51-9876545',
      office: 'Admin Block, 1st Floor',
      hours: 'Mon-Fri, 9:00 AM - 4:00 PM'
    },
    {
      category: 'administration',
      name: 'Finance Office',
      designation: 'Fee Collection & Finance',
      department: 'Finance',
      email: 'finance@nutech.edu.pk',
      phone: '+92-51-9876546',
      office: 'Admin Block, Ground Floor',
      hours: 'Mon-Fri, 8:30 AM - 3:30 PM'
    },
    {
      category: 'administration',
      name: 'Student Affairs Office',
      designation: 'Student Services',
      department: 'Student Affairs',
      email: 'student.affairs@nutech.edu.pk',
      phone: '+92-51-9876547',
      office: 'Student Center, Room 202',
      hours: 'Mon-Fri, 9:00 AM - 5:00 PM'
    },

    // Support
    {
      category: 'support',
      name: 'IT Help Desk',
      designation: 'Technical Support',
      department: 'IT Services',
      email: 'ithelpdesk@nutech.edu.pk',
      phone: '+92-51-9876548',
      office: 'Library Building, Basement',
      hours: 'Mon-Sat, 8:00 AM - 8:00 PM'
    },
    {
      category: 'support',
      name: 'Library Services',
      designation: 'University Library',
      department: 'Library',
      email: 'library@nutech.edu.pk',
      phone: '+92-51-9876549',
      office: 'Central Library',
      hours: 'Mon-Sat, 8:00 AM - 10:00 PM'
    }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.expertise && contact.expertise.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || contact.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'senior-faculty': return GraduationCap;
      case 'lecturers': return User;
      case 'lab-engineers': return Wrench;
      default: return User;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'senior-faculty': return { bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' };
      case 'lecturers': return { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500' };
      case 'lab-engineers': return { bg: 'bg-amber-50', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500' };
      case 'administration': return { bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700', bar: 'bg-purple-500' };
      case 'support': return { bg: 'bg-orange-50', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700', bar: 'bg-gray-500' };
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'senior-faculty': return 'Senior Faculty';
      case 'lecturers': return 'Lecturers';
      case 'lab-engineers': return 'Lab Engineers';
      case 'administration': return 'Administration';
      case 'support': return 'Support';
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Faculty & Contacts</h2>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Find contact information for CS faculty and services</p>
      </div>

      {/* Faculty Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-emerald-50 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-emerald-700">3</p>
          <p className="text-xs sm:text-sm text-emerald-600 font-medium">Senior Faculty</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-blue-700">18</p>
          <p className="text-xs sm:text-sm text-blue-600 font-medium">Lecturers</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-amber-700">7</p>
          <p className="text-xs sm:text-sm text-amber-600 font-medium">Lab Engineers</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-purple-700">4</p>
          <p className="text-xs sm:text-sm text-purple-600 font-medium">Admin</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-xl sm:text-2xl font-bold text-orange-700">2</p>
          <p className="text-xs sm:text-sm text-orange-600 font-medium">Support</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, expertise, or designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category === 'all' ? 'All' : getCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact, index) => {
          const colors = getCategoryColor(contact.category);
          const Icon = getCategoryIcon(contact.category);

          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className={`h-2 ${colors.bar}`} />

              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors.bg}`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base mb-1">{contact.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{contact.designation}</p>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                      {getCategoryLabel(contact.category)}
                    </span>
                  </div>
                </div>

                {contact.expertise && (
                  <div className="mt-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium mb-1">Expertise</p>
                    <p className="text-sm text-gray-700">{contact.expertise}</p>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{contact.email}</span>
                    </a>
                  )}

                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </a>
                  )}

                  {contact.office && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{contact.office}</span>
                    </div>
                  )}

                  {contact.hours && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{contact.hours}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredContacts.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No contacts found matching your search</p>
        </div>
      )}

      {/* About NUSIT CS */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          About NUSIT Computer Science Department
        </h3>
        <p className="text-green-800 text-sm leading-relaxed">
          The Computer Science Department at NUSIT aims to produce graduates who are strong problem solvers,
          innovators, and technical leaders. Our curriculum focuses on both foundational theory and practical
          "learning by doing" approach. We offer BS, MS, and PhD programs in Computer Science.
        </p>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Emergency Contacts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-semibold text-red-900">Security Office</p>
            <p className="text-sm text-red-800">+92-51-9876550 (24/7)</p>
          </div>
          <div>
            <p className="font-semibold text-red-900">Medical Center</p>
            <p className="text-sm text-red-800">+92-51-9876551 (24/7)</p>
          </div>
          <div>
            <p className="font-semibold text-red-900">Campus Main Office</p>
            <p className="text-sm text-red-800">+92-51-9876552</p>
          </div>
        </div>
      </div>
    </div>
  );
}