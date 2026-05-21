import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/services/supabase'
import { getCurrentUser } from '@/services/auth'

interface AuthContextType {
  user: any
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setUser(null)
        return
      }
      const customer = await getCurrentUser()
      setUser(customer)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
        return
      }
      if (session?.user) {
        const customer = await getCurrentUser()
        setUser(customer)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [loadUser])

  async function refreshUser() {
    await loadUser()
  }

  async function signOut() {
    try {
      await supabase.auth.signOut()
    } catch {
      // Ignore errors during sign out
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
