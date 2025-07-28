"use client"

import type React from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "educator" | "jobseeker" | "interviewer"
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/signin")
        return
      }

      if (requiredRole && profile?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user's role
        if (profile?.role) {
          router.push(`/${profile.role}-dashboard`)
        } else {
          router.push("/role-selection")
        }
        return
      }

      // If user doesn't have a role set, redirect to role selection
      if (!profile?.role && !window.location.pathname.includes("role-selection")) {
        router.push("/role-selection")
        return
      }
    }
  }, [user, profile, loading, requiredRole, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return null // Will redirect to appropriate dashboard
  }

  if (!profile?.role && !window.location.pathname.includes("role-selection")) {
    return null // Will redirect to role selection
  }

  return <>{children}</>
}

export default ProtectedRoute
