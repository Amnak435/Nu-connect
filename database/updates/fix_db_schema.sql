-- FIXED SCHEMA SCRIPT
-- Run this in your Supabase SQL Editor to fix the "disappearing uploads" and table errors.

-- 1. Add missing columns to help filter documents properly
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS semester TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS batch TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS section TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS sub_category TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS instructor TEXT;
ALTER TABLE academic_documents ADD COLUMN IF NOT EXISTS file_type TEXT;

-- 2. Drop the 'type' column check if it exists (it was causing issues), or ignore if missing
-- We use DO block to avoid errors if the constraint doesn't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'academic_documents_type_check') THEN
        ALTER TABLE academic_documents DROP CONSTRAINT academic_documents_type_check;
    END IF;
END $$;

-- 3. Ensure proper RLS (Security) Policies
ALTER TABLE academic_documents ENABLE ROW LEVEL SECURITY;

-- Drop old policies to prevent conflicts
DROP POLICY IF EXISTS "Public read documents" ON academic_documents;
DROP POLICY IF EXISTS "Public read timetable" ON academic_documents; 
DROP POLICY IF EXISTS "Admin manage documents" ON academic_documents;

-- Create correct policies
-- Everyone can VIEW documents
CREATE POLICY "Public read documents" ON academic_documents FOR SELECT USING (true);

-- Only Admins can INSERT/UPDATE/DELETE (checking against student_profiles)
CREATE POLICY "Admin manage documents" ON academic_documents 
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin')
  );

-- 4. Create indices for faster loading
CREATE INDEX IF NOT EXISTS idx_academic_semester ON academic_documents(semester);
CREATE INDEX IF NOT EXISTS idx_academic_batch ON academic_documents(batch);
