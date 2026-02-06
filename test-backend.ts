
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    console.log('--- Testing Database Permissions ---');

    // 1. Check if we can read public announcements (should be public)
    const { data: announcements, error: annError } = await supabase.from('announcements').select('*').limit(1);
    if (annError) {
        console.log('⚠️ Announcements check failed (might be empty table or RLS):', annError.message);
    } else {
        console.log('✅ Announcements table readable');
    }

    // 2. Check Auth Service
    const { data: authConfig, error: authError } = await supabase.auth.getSession();
    if (authError) {
        console.error('❌ Auth Service Error:', authError.message);
    } else {
        console.log('✅ Auth Service Reachable');
    }

    console.log('\n--- Recommendation ---');
    console.log('If you are not receiving emails:');
    console.log('1. Go to Supabase Dashboard -> Authentication -> Providers -> Email');
    console.log('2. DISABLE "Confirm email" (toggle it off)');
    console.log('3. Save changes');
    console.log('4. Try registering again.');
}

checkDatabase();
