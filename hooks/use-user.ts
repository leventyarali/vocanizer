import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'  // client tarafı için olan import'u kullanıyoruz
import { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function getUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          throw error
        }

        setUser(user)
      } catch (e) {
        setError(e as Error)
        console.error('Error getting user:', e)
      } finally {
        setLoading(false)
      }
    }

    // Initial user fetch
    getUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    loading,
    error,
    isAdmin: user?.email === 'leventyarali@gmail.com'
  }
}