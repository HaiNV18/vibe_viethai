/**
 * Supabase Client Configuration & Initialization
 */

const SUPABASE_CONFIG = {
  // Project URL from supabase.txt
  url: 'https://ikwpxefjfbohdhtmupfm.supabase.co',

  // Project Anon (public) API Key from supabase.txt
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlrd3B4ZWZqZmJvaGRodG11cGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwOTEyMDEsImV4cCI6MjEwNjY2NzIwMX0.F5H3jMhUZ_CWtxRvsVoiRMFZo0ISSNFEWhI5pzlpiAA',

  // Check if configured with a real anon key
  isConfigured() {
    return Boolean(
      this.url && 
      this.anonKey && 
      !this.anonKey.includes('PLACEHOLDER') &&
      this.anonKey.length > 30
    );
  }
};

// Initialize Supabase JS Client instance if library is loaded
let supabaseClient = null;

if (typeof window !== 'undefined' && typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('[Supabase] Client initialized successfully for URL:', SUPABASE_CONFIG.url);
  } catch (err) {
    console.error('[Supabase] Initialization error:', err);
  }
}

if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
  window.supabaseClient = supabaseClient;
}
