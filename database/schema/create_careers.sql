-- Create careers table for jobs and internships
CREATE TABLE IF NOT EXISTS public.careers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    type TEXT CHECK (type IN ('Job', 'Internship')),
    description TEXT,
    apply_link TEXT,
    image_url TEXT,
    location TEXT DEFAULT 'Remote',
    salary TEXT,
    posted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    posted_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Careers are viewable by everyone" ON public.careers;
CREATE POLICY "Careers are viewable by everyone"
    ON public.careers FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins full access careers" ON public.careers;
CREATE POLICY "Admins full access careers"
    ON public.careers FOR ALL
    USING (auth.jwt() ->> 'email' = 'f24605061@nutech.edu.pk');

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_careers_posted_at ON public.careers(posted_at DESC);
