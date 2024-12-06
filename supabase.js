import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

const supabaseUrl = "https://tlehmozjugfrftzepjgb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZWhtb3pqdWdmcmZ0emVwamdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MzA1NTcsImV4cCI6MjA0NzUwNjU1N30.3wLEqau3pslk4k_7HFV6J47rs7NKLlxCD9Tps6wvTls";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
