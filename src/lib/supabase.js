import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qcvpqinljbxwjuwxdrbm.supabase.co';
export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdnBxaW5samJ4d2p1d3hkcmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0NjkyMDEsImV4cCI6MjEwOTA0NTIwMX0.shdtWCpnvc76h3uQm6dwIDlD7LpO2KPUDSZUAObpMMw';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
