"use client"

import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import Link from "next/link"
import { Brain, Users, GraduationCap, Briefcase, ArrowRight, Sparkles } from "lucide-react"

const Index = () => {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      if (profile?.role) {
        router.push(`/${profile.role}-dashboard`)
      } else {
        router.push("/role-selection")
      }
    }
  }, [user, profile, loading, router])

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

  if (user) {
    return null // Will redirect to appropriate dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-8 h-8 text-slate-800" />
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800">AI Interview Question Generator</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Generate professional, tailored interview questions with AI. Perfect for educators, job seekers, and
            interviewers looking to conduct effective interviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 text-lg">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 text-lg bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-slate-600" />
              </div>
              <CardTitle className="text-xl text-slate-800">For Educators</CardTitle>
              <CardDescription className="text-slate-600">
                Create comprehensive question sets for your students and courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-slate-400" />
                  Generate questions by topic and difficulty
                </li>
                <li className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-slate-400" />
                  Track student progress and performance
                </li>
                <li className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-slate-400" />
                  Export questions for classroom use
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-slate-600" />
              </div>
              <CardTitle className="text-xl text-slate-800">For Job Seekers</CardTitle>
              <CardDescription className="text-slate-600">
                Practice with AI-generated questions for your target roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-slate-400" />
                  Role-specific interview preparation
                </li>
                <li className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-slate-400" />
                  Progressive difficulty levels
                </li>
                <li className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-slate-400" />
                  Track your improvement over time
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-slate-600" />
              </div>
              <CardTitle className="text-xl text-slate-800">For Interviewers</CardTitle>
              <CardDescription className="text-slate-600">
                Generate professional questions for candidate evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-slate-400" />
                  Tailored questions for any role
                </li>
                <li className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-slate-400" />
                  Structured interview formats
                </li>
                <li className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-slate-400" />
                  Candidate evaluation tools
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Ready to Transform Your Interview Process?</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who use our AI-powered platform to create better interviews and achieve
            better outcomes.
          </p>
          <Link href="/signup">
            <Button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 text-lg">
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Index
