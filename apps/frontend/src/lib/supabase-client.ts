
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use the Supabase client from the integrations folder
// This file is here for backward compatibility
import { supabase as supabaseClient } from '@/integrations/supabase/client';

export const supabase = supabaseClient;
