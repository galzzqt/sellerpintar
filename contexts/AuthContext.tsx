"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient, LoginRequest, RegisterRequest, UserProfile } from '@/lib/api'

/**
 * Interface untuk konteks autentikasi
 */
interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message?: string }>
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provider konteks autentikasi
 * Mengelola state autentikasi global untuk seluruh aplikasi
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Periksa status autentikasi saat mount
  useEffect(() => {
    const checkAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          const response = await apiClient.getUserProfile()
          if (response.success) {
            setUser(response.data)
          } else {
            apiClient.clearToken()
          }
        } catch (error) {
          console.error('Gagal mengambil profil pengguna:', error)
          apiClient.clearToken()
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  /**
   * Fungsi untuk login pengguna
   */
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      const response = await apiClient.login(credentials)
      
      if (response.success) {
        setUser(response.data.user)
        return { success: true }
      } else {
        return { success: false, message: response.message || 'Login gagal' }
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Login gagal' }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fungsi untuk registrasi pengguna baru
   */
  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true)
      const response = await apiClient.register(userData)
      
      if (response.success) {
        setUser(response.data.user)
        return { success: true }
      } else {
        return { success: false, message: response.message || 'Registrasi gagal' }
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Registrasi gagal' }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fungsi untuk logout pengguna
   */
  const logout = () => {
    apiClient.logout()
    setUser(null)
  }

  /**
   * Fungsi untuk memperbarui profil pengguna
   */
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      const response = await apiClient.updateUserProfile(profileData)
      
      if (response.success) {
        setUser(response.data)
        return { success: true }
      } else {
        return { success: false, message: response.message || 'Update profil gagal' }
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Update profil gagal' }
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook untuk menggunakan konteks autentikasi
 * Harus digunakan di dalam AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider')
  }
  return context
}
