/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xpmraiqhdjelffoqnyzq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwbXJhaXFoZGplbGZmb3FueXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTgyMzgsImV4cCI6MjA5MDI5NDIzOH0.AKa5MNVAIwg7dB0EloWe0ACdFz6ssV5IZvmqyv4f94Q';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Please configure them in the Settings menu.');
}

// Only create the client if we have a URL to avoid "supabaseUrl is required" error
export const supabase = supabaseUrl 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Cast to any to avoid TS errors in components, but it will fail if used
