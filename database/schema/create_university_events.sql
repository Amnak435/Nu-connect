-- Create university_events table for campus events and announcements
CREATE TABLE IF NOT EXISTS public.university_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    caption TEXT,
    event_link TEXT,
    image_url TEXT,
    event_date TIMESTAMPTZ,
    visibility_type TEXT CHECK (visibility_type IN ('everyone', 'specific')) DEFAULT 'everyone',
    target_batch TEXT,
    target_section TEXT,
    target_semester TEXT,
    posted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    posted_by UUID REFERENCES auth.users(id)
);

-- Create event_likes table for tracking student likes
CREATE TABLE IF NOT EXISTS public.event_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.university_events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    liked_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.university_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_likes ENABLE ROW LEVEL SECURITY;

-- Policies for university_events
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.university_events;
CREATE POLICY "Events are viewable by everyone"
    ON public.university_events FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins full access university_events" ON public.university_events;
CREATE POLICY "Admins full access university_events"
    ON public.university_events FOR ALL
    USING (auth.jwt() ->> 'email' = 'f24605061@nutech.edu.pk');

-- Policies for event_likes
DROP POLICY IF EXISTS "Users can view all likes" ON public.event_likes;
CREATE POLICY "Users can view all likes"
    ON public.event_likes FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can manage their own likes" ON public.event_likes;
CREATE POLICY "Users can manage their own likes"
    ON public.event_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own likes" ON public.event_likes;
CREATE POLICY "Users can delete their own likes"
    ON public.event_likes FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_university_events_posted_at ON public.university_events(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_university_events_visibility ON public.university_events(visibility_type, target_batch, target_section, target_semester);
CREATE INDEX IF NOT EXISTS idx_event_likes_event_id ON public.event_likes(event_id);
CREATE INDEX IF NOT EXISTS idx_event_likes_user_id ON public.event_likes(user_id);
