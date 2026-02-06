-- ================================================================
-- NUCONNECT PORTAL - CONSOLIDATED SUPABASE SCHEMA
-- ================================================================

-- 1. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT,
    course_name TEXT NOT NULL,
    attended_classes INTEGER DEFAULT 0,
    total_classes INTEGER DEFAULT 1,
    semester TEXT,
    batch TEXT,
    section TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users(id),
    student_name TEXT,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, in_progress, resolved
    response TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ACADEMIC DOCUMENTS (Lectures, Timetables, Datesheets, Syllabi)
CREATE TABLE IF NOT EXISTS academic_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- timetable, datesheet, syllabus, lecture
    sub_category TEXT, -- midterm, final, etc.
    file_url TEXT NOT NULL,
    file_type TEXT,
    semester TEXT,
    batch TEXT,
    section TEXT,
    subject TEXT,
    instructor TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TIMETABLE ENTRIES (For dynamic weekly view)
CREATE TABLE IF NOT EXISTS timetable_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day TEXT NOT NULL, -- Monday, Tuesday...
    time_slot TEXT NOT NULL, -- 09:00 - 10:30
    subject TEXT NOT NULL,
    faculty_name TEXT,
    venue TEXT,
    semester TEXT,
    batch TEXT,
    section TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. ANNOUNCEMENTS (Targeted)
-- Ensure 'semester', 'batch', 'section', 'department' columns exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='announcements' AND column_name='semester') THEN
        ALTER TABLE announcements ADD COLUMN semester TEXT DEFAULT 'All';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='announcements' AND column_name='batch') THEN
        ALTER TABLE announcements ADD COLUMN batch TEXT DEFAULT 'All';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='announcements' AND column_name='section') THEN
        ALTER TABLE announcements ADD COLUMN section TEXT DEFAULT 'All';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='announcements' AND column_name='department') THEN
        ALTER TABLE announcements ADD COLUMN department TEXT DEFAULT 'All Departments';
    END IF;
END $$;

-- 6. SECURITY - ENABLE RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;

-- 7. POLICIES
DROP POLICY IF EXISTS "Public access to docs" ON academic_documents;
CREATE POLICY "Public access to docs" ON academic_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public access to timetable" ON timetable_entries;
CREATE POLICY "Public access to timetable" ON timetable_entries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students see own attendance" ON attendance;
CREATE POLICY "Students see own attendance" ON attendance 
FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'registration_no' = student_id) OR
    (auth.jwt() -> 'user_metadata' ->> 'nutech_id' = student_id)
);

DROP POLICY IF EXISTS "Students see own complaints" ON complaints;
CREATE POLICY "Students see own complaints" ON complaints
FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students create complaints" ON complaints;
CREATE POLICY "Students create complaints" ON complaints
FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ADMIN POLICIES (Full Access)
CREATE POLICY "Admins full access" ON attendance FOR ALL USING (auth.jwt() ->> 'email' = 'f24605061@nutech.edu.pk');
CREATE POLICY "Admins full access complaints" ON complaints FOR ALL USING (auth.jwt() ->> 'email' = 'f24605061@nutech.edu.pk');
CREATE POLICY "Admins full access docs" ON academic_documents FOR ALL USING (auth.jwt() ->> 'email' = 'f24605061@nutech.edu.pk');
CREATE POLICY "Admins full access timetable" ON timetable_entries FOR ALL USING (auth.jwt() ->> 'email' = 'f24605061@nutech.edu.pk');

-- 8. INDEXES
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_complaints_student_id ON complaints(student_id);
CREATE INDEX IF NOT EXISTS idx_timetable_targeting ON timetable_entries(semester, batch, section);
CREATE INDEX IF NOT EXISTS idx_docs_category ON academic_documents(category);
