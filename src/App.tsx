import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { WeeklyPlan } from './components/WeeklyPlan';
import { DateSheet } from './components/DateSheet';
import { Syllabus } from './components/Syllabus';
import { UniversityEvents } from './components/UniversityEvents';
import { ClassroomSync } from './components/ClassroomSync';
import { Contacts } from './components/Contacts';
import { Announcements } from './components/Announcements';
import { Fees } from './components/Fees';
import { Complaints } from './components/Complaints';
import { Careers } from './components/Careers';
import { Login } from './components/Login';
import GeminiTest from './components/GeminiTest';
import { supabase } from './lib/supabase';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  BookOpen,
  Bot,
  Users,
  Phone,
  Megaphone,
  CreditCard,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Loader2,
  Lock,
  Briefcase,
  PartyPopper
} from 'lucide-react';
import { AdminPanel } from './components/AdminPanel';
import nutechLogo from 'figma:asset/2e00157302a9218f37a6b07498488713f16d8e8a.png';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userData = extractUserData(session.user);
        setCurrentUser(userData);
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setActiveTab('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userData = extractUserData(session.user);
        setCurrentUser(userData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractUserData = (user: any) => {
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || 'Student',
      registrationNo: user.user_metadata?.registration_no || user.user_metadata?.nutech_id || '',
      department: user.user_metadata?.department || 'Computer Science',
      batch: user.user_metadata?.batch || '2024',
      section: user.user_metadata?.section || 'A',
      semester: user.user_metadata?.semester || '2nd Semester',
      role: (user.email?.toLowerCase() === 'f24605061@nutech.edu.pk') ? 'admin' : (user.user_metadata?.role || 'Student'),
    };
  };

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <img src={nutechLogo} alt="NUTECH" className="w-24 h-24 mx-auto mb-6 animate-pulse" />
          <h1 className="text-3xl font-bold text-white mb-2">NUConnect</h1>
          <p className="text-green-200 mb-6">Your Digital Campus</p>
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'weekly-plan', label: 'Weekly Plan', icon: Calendar },
    { id: 'date-sheet', label: 'Date Sheet', icon: CalendarDays },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'university-events', label: 'University Events', icon: PartyPopper },
    { id: 'classroom', label: 'Classroom Sync', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'fees', label: 'Fees & Payments', icon: CreditCard },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'careers', label: 'Jobs & Internships', icon: Briefcase },
  ];

  // Add Admin Panel item for admins or owner
  if (currentUser?.role === 'admin' || currentUser?.email?.toLowerCase() === 'f24605061@nutech.edu.pk') {
    menuItems.push({ id: 'admin-panel', label: 'Admin Panel', icon: Lock });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={currentUser} />;
      case 'weekly-plan':
        return <WeeklyPlan user={currentUser} />;
      case 'date-sheet':
        return <DateSheet user={currentUser} />;
      case 'syllabus':
        return <Syllabus user={currentUser} />;
      case 'university-events':
        return <UniversityEvents user={currentUser} />;
      case 'classroom':
        return <ClassroomSync user={currentUser} />;
      case 'contacts':
        return <Contacts />;
      case 'announcements':
        return <Announcements user={currentUser} />;
      case 'fees':
        return <Fees user={currentUser} />;
      case 'complaints':
        return <Complaints user={currentUser} />;
      case 'careers':
        return <Careers />;
      case 'admin-panel':
        return <AdminPanel />;
      case 'test-api':
        return <GeminiTest />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold tracking-tight">NUConnect</h1>
                <p className="text-xs text-green-100/90 font-medium">Your Digital Campus</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{currentUser?.name}</p>
                <p className="text-xs text-green-100">{currentUser?.department} • {currentUser?.semester}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <nav className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                          ? 'bg-green-50 text-green-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="bg-white w-64 h-full shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
                <div className="mb-6 pb-4 border-b">
                  <p className="font-semibold">{currentUser?.name}</p>
                  <p className="text-sm text-gray-600">{currentUser?.department}</p>
                  <p className="text-xs text-gray-500">{currentUser?.semester}</p>
                </div>
                <nav>
                  <ul className="space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                              ? 'bg-green-50 text-green-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
                <button
                  onClick={handleLogout}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0 flex flex-col">
            <div className="flex-1">
              {renderContent()}
            </div>

            <footer className="mt-8 text-center text-gray-500 text-xs font-mono py-4 border-t border-gray-200">
              Made by Amna Khurram | CS 2024 Batch | F24605061 | Full Stack Development
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}