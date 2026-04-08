import { createClient } from '@supabase/supabase-js';
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseUserKey = process.env.SUPABASE_USER_KEY!;

// Service role key bypasses RLS — correct for server-side use
export const supabase = createClient(supabaseUrl, supabaseUserKey);
