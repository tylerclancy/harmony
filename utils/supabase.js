import { createClient } from '@supabase/supabase-js';

import { config } from 'dotenv';
config();

const supabaseUrl = process.env.DATABASE_URL;
const supabaseKey = process.env.DATABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
