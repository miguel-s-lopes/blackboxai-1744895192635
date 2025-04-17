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
      // First try to fetch existing profile
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // Record not found
          // Create new profile if doesn't exist
          const { data: userData } = await supabase.auth.getUser()
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([
              {
                id: userId,
                role: "client",
                email: userData.user.email
              }
            ])
          
          if (insertError) throw insertError
          return "client"
        }
        throw error
      }

      return data.role
    } catch (error) {
      console.error("Error in fetchUserRole:", error.message)
      // Retry once if there's an error
      try {
        const { data: retryData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single()
        
        return retryData?.role || "client"
      } catch (retryError) {
        console.error("Error in retry fetchUserRole:", retryError.message)
        return "client"
      }
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
      const authResponse = await supabase.auth.signUp(data)
      if (authResponse.error) throw authResponse.error

      if (authResponse.data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: authResponse.data.user.id,
              role: "client",
              email: data.email
            }
          ])

        if (profileError) throw profileError
      }

      return authResponse
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
