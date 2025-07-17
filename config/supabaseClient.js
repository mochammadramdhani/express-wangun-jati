import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './main.config.js';

const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_KEY = CONFIG.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export { supabase }