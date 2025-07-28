"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Alert, AlertDescription } from "../components/ui/alert"
import { useAuth, type UserRole } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { GraduationCap, Briefcase, Users, ArrowRight } from "lucide-react"

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { updateUserRole } = useAuth()
  const router = useRouter()

  const roles = [
    {
      id: "educator" as UserRole,
      title: "Educator",
      description: "Create and manage interview questions for students and courses",
      icon: GraduationCap,
      features: ["Create question sets", "Track student progress", "Manage courses"],
    },
    {
      id: "jobseeker" as UserRole,
      title: "Job Seeker",
      description: "Practice with AI-generated interview questions for your target roles",
      icon: Briefcase,
      features: ["Practice interviews", "Track progress", "Get feedback"],
    },
    {
      id: "interviewer" as UserRole,
      title: "Interviewer",
      description: "Generate professional interview questions for candidate evaluation",
      icon: Users,
      features: ["Generate questions", "Manage candidates", "Schedule interviews"],
    },
  ]

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleContinue = async () => {
    if (!selectedRole) return

    setLoading(true)
    setError("")

    try {
      const { error } = await updateUserRole(selectedRole)

      if (error) {
        setError("Failed to update role. Please try again.")
      } else {
        router.push(`/${selectedRole}-dashboard`)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">Welcome to AI Interview Question Generator</h1>
          <p className="text-slate-600">Choose your role to get started with personalized features</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id

            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? "border-slate-800 shadow-lg bg-slate-50"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      isSelected ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl text-slate-800">{role.title}</CardTitle>
                  <CardDescription className="text-slate-600">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50 max-w-md mx-auto">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || loading}
            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Setting up...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
