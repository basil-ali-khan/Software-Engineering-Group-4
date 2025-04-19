import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kwkinqhjstxhyxdenxah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a2lucWhqc3R4aHl4ZGVueGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDQwMzIsImV4cCI6MjA1OTg4MDAzMn0.4GQa1tDkEGwSr_lhxELe5FdgOeDoeYXZri6jrCUzULI';

export const supabase = createClient(supabaseUrl, supabaseKey);