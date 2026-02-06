import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// You need to replace these with your actual Supabase project credentials
// Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for student data
export interface StudentProfile {
    id: string;
    nutech_id: string;
    email: string;
    full_name: string;
    department: string;
    batch: string;
    semester: string;
    section: string;
    registration_no: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
}

// Auth helper functions
export const authHelpers = {
    // Sign up a new student
    async signUp(email: string, password: string, studentData: Partial<StudentProfile>) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: studentData.full_name,
                    nutech_id: studentData.nutech_id,
                    department: studentData.department,
                    batch: studentData.batch,
                    semester: studentData.semester,
                    section: studentData.section,
                    registration_no: studentData.registration_no,
                }
            }
        });
        return { data, error };
    },

    // Sign in existing student
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // Get current session
    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        return { data, error };
    },

    // Get current user
    async getUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    },

    // Create or update student profile in database
    async upsertStudentProfile(profile: Partial<StudentProfile>) {
        const { data, error } = await supabase
            .from('student_profiles')
            .upsert(profile)
            .select()
            .single();
        return { data, error };
    },

    // Get student profile by user ID
    async getStudentProfile(userId: string) {
        const { data, error } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('id', userId)
            .single();
        return { data, error };
    },

    // Request password reset
    async resetPassword(email: string) {
        // Force the production URL for the redirect to ensure reliability
        const redirectUrl = 'https://nu-connect-portal.vercel.app';
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });
        return { data, error };
    },

    // Update password
    async updatePassword(newPassword: string) {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        return { data, error };
    },

    // Resend verification email
    async resendVerificationEmail(email: string) {
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email,
        });
        return { data, error };
    }
};

/*
 * SUPABASE SETUP INSTRUCTIONS:
 * 
 * 1. Go to https://supabase.com and create a new project
 * 
 * 2. Once the project is created, go to Settings > API and copy:
 *    - Project URL (VITE_SUPABASE_URL)
 *    - anon public key (VITE_SUPABASE_ANON_KEY)
 * 
 * 3. Create a .env file in your project root with:
 *    VITE_SUPABASE_URL=your_project_url_here
 *    VITE_SUPABASE_ANON_KEY=your_anon_key_here
 * 
 * 4. Go to the SQL Editor in Supabase and run this SQL to create the student_profiles table:
 * 
 * CREATE TABLE student_profiles (
 *   id UUID REFERENCES auth.users(id) PRIMARY KEY,
 *   nutech_id TEXT UNIQUE NOT NULL,
 *   email TEXT NOT NULL,
 *   full_name TEXT NOT NULL,
 *   department TEXT NOT NULL DEFAULT 'Computer Science',
 *   batch TEXT NOT NULL,
 *   semester TEXT NOT NULL,
 *   section TEXT NOT NULL,
 *   registration_no TEXT UNIQUE NOT NULL,
 *   is_verified BOOLEAN DEFAULT FALSE,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable Row Level Security
 * ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policy for users to read their own profile
 * CREATE POLICY "Users can view own profile"
 *   ON student_profiles FOR SELECT
 *   USING (auth.uid() = id);
 * 
 * -- Create policy for users to update their own profile
 * CREATE POLICY "Users can update own profile"
 *   ON student_profiles FOR UPDATE
 *   USING (auth.uid() = id);
 * 
 * -- Create policy for users to insert their own profile
 * CREATE POLICY "Users can insert own profile"
 *   ON student_profiles FOR INSERT
 *   WITH CHECK (auth.uid() = id);
 * 
 * 5. In Supabase Dashboard > Authentication > Settings:
 *    - Enable Email provider
 *    - Configure email templates if needed
 *    - Set Site URL to http://localhost:3000 for development
 *    - Add http://localhost:3000 to Redirect URLs
 */
