-- 1. Add Role to Student Profiles
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- 2. Create Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('exam', 'academic', 'event', 'holiday', 'fee')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  department TEXT NOT NULL DEFAULT 'Computer Science',
  posted_by TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Timetable Table (Simplified for dynamic updates)
CREATE TABLE IF NOT EXISTS timetable_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  semester TEXT NOT NULL,
  day TEXT NOT NULL, -- 'Monday', 'Tuesday', etc.
  subject TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  venue TEXT NOT NULL,
  faculty_name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Lecture', -- 'Lecture' or 'Lab'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Academic Documents Table (For Syllabus/Fee Chits)
CREATE TABLE IF NOT EXISTS academic_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('syllabus', 'fee_form', 'policy')),
  category TEXT, -- e.g. '2nd Semester'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Set Up RLS (Row Level Security)
-- Allow all students to READ these tables
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public read timetable" ON timetable_entries FOR SELECT USING (true);
CREATE POLICY "Public read documents" ON academic_documents FOR SELECT USING (true);

-- Allow ONLY admins to INSERT/UPDATE/DELETE
CREATE POLICY "Admin manage announcements" ON announcements 
  FOR ALL USING (auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin'));

CREATE POLICY "Admin manage timetable" ON timetable_entries 
  FOR ALL USING (auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin'));

CREATE POLICY "Admin manage documents" ON academic_documents 
  FOR ALL USING (auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin'));

-- 6. Insert a Sample Admin (Optional - Replace with your actual UUID from Authentication tab to make yourself admin)
-- UPDATE student_profiles SET role = 'admin' WHERE email = 'your-email@example.com';
