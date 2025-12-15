'use client'

import { useSupabase } from '@/lib/supabase/provider'

export const useAuth = () => {
  const { supabase } = useSupabase()

  const signInWithTwitter = async () => {
    const redirectUrl = `${window.location.origin}/auth/callback`
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (error) {
      console.error('Twitter sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  return {
    signInWithTwitter,
    signOut,
  }
}

