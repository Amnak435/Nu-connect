-- Create Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL, -- This can be the NUTECH ID/Registration No
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

-- Enable RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view their own attendance
CREATE POLICY "Students can view own attendance" ON attendance 
FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'registration_no' = student_id) OR
    (auth.jwt() -> 'user_metadata' ->> 'nutech_id' = student_id)
);

-- Policy: Admins can do everything
CREATE POLICY "Admins have full access to attendance" ON attendance
FOR ALL USING (
    auth.jwt() ->> 'email' = 'f24605061@nutech.edu.pk'
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course ON attendance(course_name);
