import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dgnllgedubuinpobacli.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbmxsZ2VkdWJ1aW5wb2JhY2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0MjI5NzcsImV4cCI6MjAyNTk5ODk3N30.vxjVPiM1MKrVJGZFiQJwh9ufK_jHNXeKHRXxXjP0qYY'

export const supabase = createClient(supabaseUrl, supabaseKey)