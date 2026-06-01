import { useState } from 'react'

export interface AuthUser {
  name: string
  email: string
  role: string
}

const STORAGE_KEY = 'stockflow_user'

function getStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as AuthUser) : null
  } catch {
    return null
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser)

  const login = (userData: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return { user, login, logout, isAuthenticated: user !== null }
}
