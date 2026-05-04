/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iydbitfaguhhyxbhjirr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5ZGJpdGZhZ3VoaHl4YmhqaXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTUxNTUsImV4cCI6MjA5MzQ3MTE1NX0.RCgYBqCXmqluDnzDycBNAW_77BgsmvP95EPeBcID9lU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
