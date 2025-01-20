import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgnllgedubuinpobacli.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbmxsZ2VkdWJ1aW5wb2JhY2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI0MDAsImV4cCI6MjAyNTM5ODQwMH0.qDPHvNxNsQ4Wd7eqeVgvXd1BXPGBWUDSJQcRVEfUJ0Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);