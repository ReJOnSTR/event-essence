import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dgnllgedubuinpobacli.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbmxsZ2VkdWJ1aW5wb2JhY2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0OTQ0MDAsImV4cCI6MjAyMzA3MDQwMH0.KxGQYVcHXeIAG6-W8Lj5rlDVQVqHrGi9Ow7V3bNGxZY";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);