-- Fee Management Tables
CREATE TABLE IF NOT EXISTS fee_structures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    semester TEXT NOT NULL,
    batch TEXT NOT NULL,
    amount INTEGER NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users(id),
    full_name TEXT,
    nutech_id TEXT NOT NULL,
    semester TEXT NOT NULL,
    batch TEXT NOT NULL,
    amount INTEGER,
    file_url TEXT NOT NULL,
    payment_type TEXT, -- 'bank' or 'online'
    status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    admin_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_submissions ENABLE ROW LEVEL SECURITY;

-- Everyone can view fee structures
CREATE POLICY \
Fee
structures
are
viewable
by
everyone\ ON fee_structures FOR SELECT USING (true);

-- Students can view their own submissions
CREATE POLICY \Students
can
view
their
own
submissions\ ON fee_submissions FOR SELECT 
USING (auth.uid() = student_id);

-- Students can insert their own submissions
CREATE POLICY \Students
can
insert
their
own
submissions\ ON fee_submissions FOR INSERT 
WITH CHECK (auth.uid() = student_id);

-- Admins can manage everything
CREATE POLICY \Admins
can
manage
fee
structures\ ON fee_structures FOR ALL 
USING (auth.jwt() ->> 'email' = 'f24605061@nutech.edu.pk' OR (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'));

CREATE POLICY \Admins
can
manage
fee
submissions\ ON fee_submissions FOR ALL 
USING (auth.jwt() ->> 'email' = 'f24605061@nutech.edu.pk' OR (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'));
