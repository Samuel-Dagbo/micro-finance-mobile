import React, { createContext, useContext, useState, useEffect } from 'react'
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

  useEffect(() => {
    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const customer = await getCurrentUser()
        setUser(customer)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUser() {
    try {
      const customer = await getCurrentUser()
      setUser(customer)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function refreshUser() {
    await loadUser()
  }

  async function signOut() {
    await supabase.auth.signOut()
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
