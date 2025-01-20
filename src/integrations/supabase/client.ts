import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dgnllgedubuinpobacli.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbmxsZ2VkdWJ1aW5wb2JhY2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU3MzQ0OTEsImV4cCI6MjAyMTMxMDQ5MX0.oNxn03W2UGXopi6U3zr7uibjIlcGeFKFdg-XOcZQKMA";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);