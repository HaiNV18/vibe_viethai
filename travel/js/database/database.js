import { seedDatabase } from './seed.js';

export const SUPABASE_URL = 'https://eacgavjbnhjdgnivkomo.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_VZrz7yGSYqDWAwjyt-8-pg_lp1O5I1l';

let supabaseClient = null;

/**
 * Utility to hash password with Web Crypto API SHA-256
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Gets Supabase Client Instance
 */
export function getSupabase() {
  if (supabaseClient) return supabaseClient;

  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
  } else {
    throw new Error('Supabase Client SDK not loaded from CDN.');
  }
}

/**
 * Initializes Supabase connection and triggers seeding if database is empty
 */
export async function initDatabase() {
  const supabase = getSupabase();

  // Test query users count
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (error) {
    if (error.code === '42P01' || error.message.includes('relation "public.users" does not exist') || error.status === 404) {
      throw new Error('TABLES_NOT_FOUND');
    }
    console.warn('Supabase query notice:', error.message);
  } else if (count === 0) {
    console.log('Supabase tables empty. Triggering seed...');
    await seedDatabase(supabase);
  }

  console.log('Supabase connection initialized successfully.');
  return supabase;
}
