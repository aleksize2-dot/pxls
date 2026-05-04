import { createClient } from '@supabase/supabase-js'
import { parseEnv } from '@pxls/config'

const env = parseEnv()

// We use the Service Role key to bypass RLS since the bot runs on a trusted server
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)
