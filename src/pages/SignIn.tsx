"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription } from "../components/ui/alert"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, LogIn, Info } from "lucide-react"

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { error } = await signIn(formData.email, formData.password)

      if (error) {
        setError(error.message)
      } else {
        // Redirect will be handled by the auth context
        router.push("/role-selection")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleDemoLogin = async (role: "educator" | "jobseeker" | "interviewer") => {
    setLoading(true)
    setError("")

    const demoCredentials = {
      educator: { email: "educator@demo.com", password: "demo123" },
      jobseeker: { email: "jobseeker@demo.com", password: "demo123" },
      interviewer: { email: "interviewer@demo.com", password: "demo123" },
    }

    try {
      const { error } = await signIn(demoCredentials[role].email, demoCredentials[role].password)

      if (error) {
        // Create demo user if doesn't exist
        const demoUsers = [
          {
            id: "demo-educator",
            email: "educator@demo.com",
            password: "demo123",
            profile: {
              id: "demo-educator",
              email: "educator@demo.com",
              role: "educator",
              full_name: "Demo Educator",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
          {
            id: "demo-jobseeker",
            email: "jobseeker@demo.com",
            password: "demo123",
            profile: {
              id: "demo-jobseeker",
              email: "jobseeker@demo.com",
              role: "jobseeker",
              full_name: "Demo Job Seeker",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
          {
            id: "demo-interviewer",
            email: "interviewer@demo.com",
            password: "demo123",
            profile: {
              id: "demo-interviewer",
              email: "interviewer@demo.com",
              role: "interviewer",
              full_name: "Demo Interviewer",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
        ]

        localStorage.setItem("registered_users", JSON.stringify(demoUsers))

        // Try login again
        await signIn(demoCredentials[role].email, demoCredentials[role].password)
      }

      router.push(`/${role}-dashboard`)
    } catch (err) {
      setError("Demo login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">AI Interview Question Generator</h1>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        {/* Demo Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Try the demo! Use the quick login buttons below or create your own account.
          </AlertDescription>
        </Alert>

        {/* Demo Login Buttons */}
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={() => handleDemoLogin("educator")}
            disabled={loading}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Demo as Educator
          </Button>
          <Button
            onClick={() => handleDemoLogin("jobseeker")}
            disabled={loading}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Demo as Job Seeker
          </Button>
          <Button
            onClick={() => handleDemoLogin("interviewer")}
            disabled={loading}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Demo as Interviewer
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-50 px-2 text-slate-500">Or continue with email</span>
          </div>
        </div>

        {/* Sign In Form */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-slate-800">Sign In</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-slate-200 focus:border-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="border-slate-200 focus:border-slate-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link href="/signup" className="font-medium text-slate-800 hover:text-slate-600 underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignIn
