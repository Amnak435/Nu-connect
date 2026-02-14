-- Fix for disappearing uploads and missing columns
-- Run this in your Supabase SQL Editor

-- 1. Add missing columns to academic_documents table
ALTER TABLE academic_documents 
ADD COLUMN IF NOT EXISTS semester TEXT,
ADD COLUMN IF NOT EXISTS batch TEXT,
ADD COLUMN IF NOT EXISTS section TEXT,
ADD COLUMN IF NOT EXISTS sub_category TEXT,
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS instructor TEXT,
ADD COLUMN IF NOT EXISTS file_type TEXT;

-- 2. Relax the constraint on 'type' column (it was preventing inserts that didn't match specific types)
ALTER TABLE academic_documents ALTER COLUMN type DROP NOT NULL;
ALTER TABLE academic_documents DROP CONSTRAINT IF EXISTS academic_documents_type_check;

-- 3. Add indices for faster lookup
CREATE INDEX IF NOT EXISTS idx_academic_semester ON academic_documents(semester);
CREATE INDEX IF NOT EXISTS idx_academic_batch ON academic_documents(batch);
CREATE INDEX IF NOT EXISTS idx_academic_section ON academic_documents(section);
CREATE INDEX IF NOT EXISTS idx_academic_category ON academic_documents(category);

-- 4. Enable RLS and Ensure Policies are correct
ALTER TABLE academic_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts before recreating
DROP POLICY IF EXISTS "Public read documents" ON academic_documents;
DROP POLICY IF EXISTS "Public read timetable" ON academic_documents; 
DROP POLICY IF EXISTS "Admin manage documents" ON academic_documents;

-- Recreate policies
CREATE POLICY "Public read documents" ON academic_documents FOR SELECT USING (true);

-- Allow admins (checked via student_profiles role) to manage documents
CREATE POLICY "Admin manage documents" ON academic_documents 
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM student_profiles WHERE role = 'admin')
  );
