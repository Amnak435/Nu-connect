-- 1. Update the User to be an Admin
UPDATE student_profiles
SET role = 'admin'
WHERE email = 'f24605061@nutech.edu.pk';

-- 2. Ensure Storage Bucket Exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('portal-docs', 'portal-docs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Set Storage Policies (Allow anyone to read, authenticated users to upload)
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;

-- Create meaningful policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portal-docs');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portal-docs' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (bucket_id = 'portal-docs' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'portal-docs' AND auth.role() = 'authenticated');

-- 4. Update Academic Documents Table Schema
-- Ensure the table exists first (if not created by previous scripts)
CREATE TABLE IF NOT EXISTS academic_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns required by the Admin Panel
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS sub_category TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS semester TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS batch TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS section TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS instructor TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS file_type TEXT;

-- 5. Update RLS for Academic Documents
ALTER TABLE academic_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read documents" ON academic_documents;
CREATE POLICY "Public read documents" ON academic_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin insert documents" ON academic_documents;
CREATE POLICY "Admin insert documents" ON academic_documents FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin') OR
  auth.email() = 'f24605061@nutech.edu.pk' -- Fallback hardcoded check
);

DROP POLICY IF EXISTS "Admin update documents" ON academic_documents;
CREATE POLICY "Admin update documents" ON academic_documents FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin') OR
  auth.email() = 'f24605061@nutech.edu.pk'
);

DROP POLICY IF EXISTS "Admin delete documents" ON academic_documents;
CREATE POLICY "Admin delete documents" ON academic_documents FOR DELETE USING (
  auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin') OR
  auth.email() = 'f24605061@nutech.edu.pk'
);

-- 6. Ensure Announcements Table Exists and has columns
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE announcements ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS priority TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS semester TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS batch TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS section TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS posted_by TEXT;

-- 7. Update RLS for Announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read announcements" ON announcements;
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage announcements" ON announcements;
CREATE POLICY "Admin manage announcements" ON announcements FOR ALL USING (
  auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin') OR
  auth.email() = 'f24605061@nutech.edu.pk'
);

-- 8. Admin Policies for Fee Structures
CREATE TABLE IF NOT EXISTS fee_structures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage fee structures" ON fee_structures;
CREATE POLICY "Admin manage fee structures" ON fee_structures FOR ALL USING (
  auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin') OR
  auth.email() = 'f24605061@nutech.edu.pk'
);
CREATE POLICY "Public read fee structures" ON fee_structures FOR SELECT USING (true);


-- 9. Admin Policies for Fee Submissions
CREATE TABLE IF NOT EXISTS fee_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE fee_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage fee submissions" ON fee_submissions;
CREATE POLICY "Admin manage fee submissions" ON fee_submissions FOR ALL USING (
  auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin') OR
  auth.email() = 'f24605061@nutech.edu.pk'
);
-- Students can insert their own submissions (usually handled by other policies, but ensuring admin access is key here)


-- 10. Admin Policies for Complaints
CREATE TABLE IF NOT EXISTS complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage complaints" ON complaints;
CREATE POLICY "Admin manage complaints" ON complaints FOR ALL USING (
  auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin') OR
  auth.email() = 'f24605061@nutech.edu.pk'
);


-- 11. Admin Policies for Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage attendance" ON attendance;
CREATE POLICY "Admin manage attendance" ON attendance FOR ALL USING (
  auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin') OR
  auth.email() = 'f24605061@nutech.edu.pk'
);

