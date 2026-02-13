import { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase, authHelpers } from '../lib/supabase';
import campusImage from 'figma:asset/581aa23a5779fe9d3a072bcd28058ca083aa67c5.png';
import nutechLogo from 'figma:asset/2e00157302a9218f37a6b07498488713f16d8e8a.png';

interface LoginProps {
  onLogin: (userData: any) => void;
}

type AuthMode = 'login' | 'register' | 'verify' | 'forgot-password';

export function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');

  // Login form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Registration form data
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    nutechId: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science',
    batch: '',
    semester: '',
    section: '',
  });

  const departments = ['Computer Science'];
  const batches = ['2021', '2022', '2023', '2024', '2025', '2026'];
  const sections = ['A', 'B', 'C', 'D'];
  const semesters = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];

  // Check for existing session on mount
  useEffect(() => {
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await handleSuccessfulAuth(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await handleSuccessfulAuth(session.user);
    }
  };

  const handleSuccessfulAuth = async (user: any) => {
    const userData = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || 'Student',
      registrationNo: user.user_metadata?.registration_no || user.user_metadata?.nutech_id || '',
      department: user.user_metadata?.department || 'Computer Science',
      batch: user.user_metadata?.batch || '',
      section: user.user_metadata?.section || '',
      semester: user.user_metadata?.semester || '',
      role: user.user_metadata?.role || 'Student',
    };
    onLogin(userData);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const email = loginData.email.trim();
      const { data, error } = await authHelpers.signIn(email, loginData.password);

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setPendingVerificationEmail(email);
          setMode('verify');
          setError('');
        } else {
          setError(error.message);
        }
      } else if (data.user) {
        await handleSuccessfulAuth(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const email = registerData.email.trim();
      const { data, error } = await authHelpers.signUp(email, registerData.password, {
        full_name: registerData.fullName,
        nutech_id: registerData.nutechId,
        department: registerData.department,
        batch: registerData.batch,
        semester: registerData.semester,
        section: registerData.section,
        registration_no: registerData.nutechId,
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Email confirmation disabled, logged in immediately
        await handleSuccessfulAuth(data.user);
      } else if (data.user) {
        // Email confirmation enabled
        setPendingVerificationEmail(email);
        setMode('verify');
        setSuccess('Registration successful! Please check your email to verify your account.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyReset = async () => {
    const email = loginData.email.trim();
    if (!email) {
      setError('Please enter your email first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Calls the SQL function we created
      const { error } = await supabase.rpc('handle_password_reset', {
        user_email: email,
        new_password: 'Nutech@2026'
      });

      if (error) {
        throw error;
      }

      setSuccess('Your password has been reset to: Nutech@2026. You can log in now!');
    } catch (err: any) {
      setError('Emergency reset failed. Make sure you ran the SQL setup in Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { error } = await authHelpers.resetPassword(loginData.email);

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password reset email sent! Check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setIsLoading(true);

    try {
      const { error } = await authHelpers.resendVerificationEmail(pendingVerificationEmail);

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Verification email resent! Please check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login handler (for testing without Supabase)
  const handleDemoLogin = () => {
    onLogin({
      id: 'demo-user',
      email: 'demo@nutech.edu.pk',
      name: 'Demo Student',
      registrationNo: 'NUTECH-CS-2024-001',
      department: 'Computer Science',
      batch: '2024',
      section: 'A',
      semester: '4th Semester',
      role: 'Student',
    });
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            id="email"
            required
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            placeholder="your.id@nutech.edu.pk"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            required
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            placeholder="Enter your password"
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-1">
        <button
          type="button"
          onClick={() => setMode('forgot-password')}
          className="text-xs text-green-600 hover:text-green-700 hover:underline"
        >
          Forgot Password?
        </button>
        <button
          type="button"
          onClick={handleEmergencyReset}
          className="text-xs text-red-600 hover:text-red-700 hover:underline font-medium"
        >
          Emergency Fix (No Email)
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDemoLogin}
        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
      >
        Continue with Demo Account
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Register Now
        </button>
      </p>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-hide">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="fullName"
              required
              value={registerData.fullName}
              onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
              placeholder="Your full name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="regEmail"
              required
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              placeholder="your.id@nutech.edu.pk"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="nutechId" className="block text-sm font-medium text-gray-700 mb-1">
            NUTECH ID / Registration Number <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="nutechId"
            value={registerData.nutechId}
            onChange={(e) => setRegisterData({ ...registerData, nutechId: e.target.value })}
            placeholder="e.g., NUTECH-CS-2024-001"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="regBatch" className="block text-sm font-medium text-gray-700 mb-1">
            Batch
          </label>
          <select
            id="regBatch"
            required
            value={registerData.batch}
            onChange={(e) => setRegisterData({ ...registerData, batch: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          >
            <option value="">Select</option>
            {batches.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="regSection" className="block text-sm font-medium text-gray-700 mb-1">
            Section
          </label>
          <select
            id="regSection"
            required
            value={registerData.section}
            onChange={(e) => setRegisterData({ ...registerData, section: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          >
            <option value="">Select</option>
            {sections.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="regSemester" className="block text-sm font-medium text-gray-700 mb-1">
            Current Semester
          </label>
          <select
            id="regSemester"
            required
            value={registerData.semester}
            onChange={(e) => setRegisterData({ ...registerData, semester: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          >
            <option value="">Select Semester</option>
            {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="regPassword"
              required
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              placeholder="Create a password (min 6 characters)"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              required
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Sign In
        </button>
      </p>
    </form>
  );

  const renderVerificationScreen = () => (
    <div className="text-center py-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Verify Your Email</h3>
      <p className="text-gray-600 mb-6">
        We've sent a verification link to<br />
        <span className="font-semibold text-gray-800">{pendingVerificationEmail}</span>
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Please check your email and click the verification link to activate your account.
      </p>

      <div className="space-y-3">
        <button
          onClick={handleResendVerification}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Resend Verification Email
            </>
          )}
        </button>

        <button
          onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
          className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <form onSubmit={handleForgotPassword} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Reset Password</h3>
        <p className="text-gray-600 text-sm mt-1">Enter your email to receive a reset link</p>
      </div>

      <div>
        <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            id="resetEmail"
            required
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            placeholder="your.id@nutech.edu.pk"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Reset Link'
        )}
      </button>

      <button
        type="button"
        onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Login
      </button>
    </form>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${campusImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-green-800/90 to-green-900/95" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-md z-10">
        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-2 sm:mb-4">
            <img src={nutechLogo} alt="NUTECH Logo" className="w-16 sm:w-24 h-16 sm:h-24 drop-shadow-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">NUConnect</h1>
          <p className="text-green-100 text-sm sm:text-lg">Your Digital Campus</p>
          <p className="text-green-200 text-[10px] sm:text-sm mt-1 sm:mt-2">National University of Technology</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
            {mode === 'login' && 'Student Login'}
            {mode === 'register' && 'Create Account'}
            {mode === 'verify' && 'Email Verification'}
            {mode === 'forgot-password' && 'Forgot Password'}
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {mode === 'login' && renderLoginForm()}
          {mode === 'register' && renderRegisterForm()}
          {mode === 'verify' && renderVerificationScreen()}
          {mode === 'forgot-password' && renderForgotPassword()}
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-green-100 text-sm">
            © 2026 National University of Technology. All rights reserved.
          </p>
          <p className="text-green-200/80 text-xs font-mono">
            Made by Amna Khurram | CS 2024 Batch | F24605061 | Full Stack Development
          </p>
        </div>
      </div>
    </div>
  );
}