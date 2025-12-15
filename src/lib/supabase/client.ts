import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Create a function to get fresh supabase client
export const getSupabaseClient = () => {
  return createClientComponentClient<Database>()
}

// Use auth helpers client for authentication-aware operations
export const supabase = getSupabaseClient()

// Fallback client for non-auth operations (lazy initialization)
let _supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export const supabaseClient = () => {
  if (!_supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing Supabase environment variables. Please check your .env.local file.'
      )
    }

    _supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return _supabaseClient
}

