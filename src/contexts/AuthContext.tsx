"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "educator" | "jobseeker" | "interviewer"

export interface User {
  id: string
  email: string
}

export interface UserProfile {
  id: string
  email: string
  role: UserRole | null
  full_name?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateUserRole: (role: UserRole) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem("auth_user")
    const savedProfile = localStorage.getItem("auth_profile")

    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser))
      setProfile(JSON.parse(savedProfile))
    }

    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("registered_users") || "[]")
      if (existingUsers.find((u: any) => u.email === email)) {
        return { error: { message: "User already exists" } }
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
      }

      const newProfile: UserProfile = {
        id: newUser.id,
        email,
        role: null,
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Save to localStorage (simulating database)
      existingUsers.push({ ...newUser, password, profile: newProfile })
      localStorage.setItem("registered_users", JSON.stringify(existingUsers))

      setUser(newUser)
      setProfile(newProfile)

      localStorage.setItem("auth_user", JSON.stringify(newUser))
      localStorage.setItem("auth_profile", JSON.stringify(newProfile))

      return { error: null }
    } catch (error) {
      return { error: { message: "Sign up failed" } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const existingUsers = JSON.parse(localStorage.getItem("registered_users") || "[]")
      const foundUser = existingUsers.find((u: any) => u.email === email && u.password === password)

      if (!foundUser) {
        return { error: { message: "Invalid email or password" } }
      }

      const user: User = {
        id: foundUser.id,
        email: foundUser.email,
      }

      setUser(user)
      setProfile(foundUser.profile)

      localStorage.setItem("auth_user", JSON.stringify(user))
      localStorage.setItem("auth_profile", JSON.stringify(foundUser.profile))

      return { error: null }
    } catch (error) {
      return { error: { message: "Sign in failed" } }
    }
  }

  const signOut = async () => {
    setUser(null)
    setProfile(null)
    localStorage.removeItem("auth_user")
    localStorage.removeItem("auth_profile")
  }

  const updateUserRole = async (role: UserRole) => {
    if (!user || !profile) return { error: "No user logged in" }

    try {
      const updatedProfile = {
        ...profile,
        role,
        updated_at: new Date().toISOString(),
      }

      // Update in localStorage
      const existingUsers = JSON.parse(localStorage.getItem("registered_users") || "[]")
      const userIndex = existingUsers.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        existingUsers[userIndex].profile = updatedProfile
        localStorage.setItem("registered_users", JSON.stringify(existingUsers))
      }

      setProfile(updatedProfile)
      localStorage.setItem("auth_profile", JSON.stringify(updatedProfile))

      return { error: null }
    } catch (error) {
      return { error: "Failed to update role" }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
