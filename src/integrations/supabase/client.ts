// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eklywveqwjmwpvvrrbhn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbHl3dmVxd2ptd3B2dnJyYmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDU3NjQsImV4cCI6MjA2ODkyMTc2NH0.XY6pNaUKSNrxa4h3aZCFESw_yc0VJhMQf_cxdN_unQs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});