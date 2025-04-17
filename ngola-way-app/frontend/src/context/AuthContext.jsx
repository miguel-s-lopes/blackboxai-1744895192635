import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState(null)

  const fetchUserRole = async (userId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user?.user_metadata?.role || "client"
    } catch (error) {
      console.error("Error in fetchUserRole:", error.message)
      return "client"
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          const userRole = await fetchUserRole(session.user.id)
          setRole(userRole)
        }
      } catch (error) {
        console.error("Error initializing auth:", error.message)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        const userRole = await fetchUserRole(session.user.id)
        setRole(userRole)
      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (data) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })
      
      if (authError) throw authError

      // Create profile after successful signup
      if (authData?.user?.id) {
        const { error: profileError } = await supabase.auth.updateUser({
          data: { role: data.role || "client" }
        })

        if (profileError) {
          console.error("Error updating user metadata:", profileError.message)
        }
      }

      return { data: authData, error: null }
    } catch (error) {
      console.error("Error in signUp:", error.message)
      throw error
    }
  }

  const value = {
    signUp,
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
    role,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
