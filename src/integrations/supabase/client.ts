// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dgnllgedubuinpobacli.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbmxsZ2VkdWJ1aW5wb2JhY2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMTI0OTEsImV4cCI6MjA1MTU4ODQ5MX0.oNxn03W2UGXopi6U3zr7uibjIlcGeFKFdg-XOcZQKMA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);