# 🚀 NUConnect Supabase Backend Setup Guide

This guide will help you set up the Supabase backend for the NUConnect Student Portal.

---

## 📋 Prerequisites

- A free [Supabase](https://supabase.com) account
- Node.js installed (already done ✅)
- NUConnect project set up (already done ✅)

---

## 🔧 Step-by-Step Setup

### Step 1: Create a Supabase Project

1. Go to **[supabase.com](https://supabase.com)** and sign up or log in
2. Click **"New Project"**
3. Fill in the details:
   - **Project name:** `nuconnect`
   - **Database password:** Create a strong password (save it!)
   - **Region:** Choose closest to Pakistan (e.g., Singapore or Mumbai)
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be created

---

### Step 2: Get Your API Keys

1. Once the project is ready, go to **Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

---

### Step 3: Create Environment File

1. In your project folder (`Centralized Student Portal`), create a new file called `.env`
2. Add your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace with your actual values from Step 2

---

### Step 4: Set Up the Database

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the contents of `supabase-setup.sql` from your project
4. Click **"Run"**

Alternatively, here's the SQL to run:

```sql
-- Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nutech_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'Computer Science',
  batch TEXT NOT NULL,
  semester TEXT NOT NULL,
  section TEXT NOT NULL,
  registration_no TEXT UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  profile_picture_url TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON student_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON student_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON student_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.student_profiles (
    id, email, nutech_id, full_name, department,
    batch, semester, section, registration_no
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nutech_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'department', 'Computer Science'),
    COALESCE(NEW.raw_user_meta_data->>'batch', ''),
    COALESCE(NEW.raw_user_meta_data->>'semester', ''),
    COALESCE(NEW.raw_user_meta_data->>'section', ''),
    COALESCE(NEW.raw_user_meta_data->>'registration_no', NEW.raw_user_meta_data->>'nutech_id', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### Step 5: Configure Authentication Settings

1. Go to **Authentication** → **Settings**
2. Under **Email:**
   - Enable **"Enable Email provider"**
   - Enable **"Enable email confirmations"** (for verification)
3. Under **Redirect URLs:**
   - Add: `http://localhost:3000`
   - Add: `http://localhost:5173` (Vite default)
   - Add your production URL later

---

### Step 6: Restart Development Server

1. Stop the current dev server (Ctrl+C)
2. Run again:

```bash
npm run dev
```

---

## ✅ Testing the Setup

### Test Registration:
1. Open http://localhost:3000
2. Click "Register Now"
3. Fill in:
   - Full Name: Your name
   - Email: your.email@example.com
   - NUTECH ID: NUTECH-CS-2024-001
   - Batch: 2024
   - Semester: 2nd Semester
   - Section: B
   - Password: (min 6 characters)
4. Click "Create Account"
5. Check your email for verification link

### Test Login:
1. After verifying email, go to login
2. Enter email and password
3. Click "Sign In"

### Demo Login (Without Supabase):
- Click "Continue with Demo Account" to test without Supabase

---

## 🗄️ Database Tables

### `student_profiles`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | User ID (from auth.users) |
| nutech_id | TEXT | NUTECH ID (e.g., NUTECH-CS-2024-001) |
| email | TEXT | Student email |
| full_name | TEXT | Full name |
| department | TEXT | Department (default: Computer Science) |
| batch | TEXT | Batch year |
| semester | TEXT | Current semester |
| section | TEXT | Section (A/B/C/D) |
| registration_no | TEXT | Registration number |
| is_verified | BOOLEAN | Account verification status |

---

## 🔐 Security Features

- **Row Level Security (RLS):** Students can only access their own data
- **Email verification:** Required before login
- **Password reset:** Via email link
- **Session persistence:** Stay logged in across browser sessions

---

## 🎯 Features Enabled

After setup, you'll have:

✅ **User Registration** with NUTECH ID, batch, semester, section  
✅ **Email Verification** before first login  
✅ **Secure Login** with email/password  
✅ **Password Reset** via email  
✅ **Session Persistence** across browser sessions  
✅ **Automatic Profile Creation** on signup  
✅ **Demo Mode** for testing without Supabase  

---

## 🐛 Troubleshooting

### "Invalid API key"
- Check that `.env` has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Restart the dev server after creating `.env`

### "Email not confirmed"
- Check spam folder for verification email
- Use "Resend Verification Email" button

### "User already registered"
- That email is already used
- Try password reset or use different email

### "Network error"
- Check internet connection
- Verify Supabase project is running

---

## 📞 Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com

---

## 🎉 You're All Set!

Your NUConnect portal now has a complete backend with:
- User authentication
- Student profiles database
- Session management
- Email verification

Happy coding! 🚀
