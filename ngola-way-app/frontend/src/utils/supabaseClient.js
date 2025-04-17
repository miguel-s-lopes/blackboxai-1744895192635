import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yxnokzlzluyqsiwveyiq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bm9remx6bHV5cXNpd3ZleWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MzM3ODEsImV4cCI6MjA1ODQwOTc4MX0.4Ba0BJDsFQer62GZWE-VMCeyPSwPGKYI8qb9U4JWd_Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
