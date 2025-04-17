import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function useProtectedRoute(requiredRole = null) {
  const { user, role, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true })
      } else if (requiredRole && role !== requiredRole) {
        navigate('/', { 
          replace: true,
          state: { 
            error: `Access denied. This page is only accessible to ${requiredRole}s.` 
          }
        })
      }
    }
  }, [user, role, loading, navigate, requiredRole])

  return { user, role, loading }
}

export function usePublicRoute() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate])

  return { user, loading }
}
