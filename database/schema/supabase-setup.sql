-- =====================================================
-- NUCONNECT STUDENT PORTAL - SUPABASE DATABASE SETUP
-- =====================================================
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- =====================================================

-- 1. Create the student_profiles table
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
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_student_nutech_id ON student_profiles(nutech_id);
CREATE INDEX IF NOT EXISTS idx_student_registration ON student_profiles(registration_no);
CREATE INDEX IF NOT EXISTS idx_student_department ON student_profiles(department);
CREATE INDEX IF NOT EXISTS idx_student_batch ON student_profiles(batch);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON student_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON student_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON student_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 5. Create a function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.student_profiles (
    id,
    email,
    nutech_id,
    full_name,
    department,
    batch,
    semester,
    section,
    registration_no
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

-- 6. Create trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_student_profiles_updated_at ON student_profiles;
CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- OPTIONAL: Announcements Table (for admin to post)
-- =====================================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium',
  department TEXT DEFAULT 'All Departments',
  posted_by TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Everyone can read active announcements
CREATE POLICY "Anyone can view active announcements"
  ON announcements FOR SELECT
  USING (is_active = TRUE);

-- =====================================================
-- OPTIONAL: Fee Records Table
-- =====================================================
CREATE TABLE IF NOT EXISTS fee_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES student_profiles(id),
  semester TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid', -- paid, unpaid, pending
  payment_proof_url TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  verified_by TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  due_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for fee_records
ALTER TABLE fee_records ENABLE ROW LEVEL SECURITY;

-- Users can view their own fee records
CREATE POLICY "Users can view own fee records"
  ON fee_records FOR SELECT
  USING (auth.uid() = student_id);

-- Users can update their own fee records (for uploading proof)
CREATE POLICY "Users can update own fee records"
  ON fee_records FOR UPDATE
  USING (auth.uid() = student_id);

-- =====================================================
-- OPTIONAL: Complaints Table
-- =====================================================
CREATE TABLE IF NOT EXISTS complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES student_profiles(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, resolved, closed
  response TEXT,
  responded_by TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for complaints
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Users can view their own complaints
CREATE POLICY "Users can view own complaints"
  ON complaints FOR SELECT
  USING (auth.uid() = student_id);

-- Users can insert their own complaints
CREATE POLICY "Users can insert own complaints"
  ON complaints FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- =====================================================
-- SUCCESS! Your database is now set up.
-- =====================================================
