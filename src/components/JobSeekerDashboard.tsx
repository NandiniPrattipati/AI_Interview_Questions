"use client"

import { useState, useEffect } from "react"
import Navigation from "./Navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  Target,
  TrendingUp,
  Clock,
  Award,
  Play,
  BookOpen,
  BarChart3,
  Download,
  Search,
  Plus,
  CheckCircle,
} from "lucide-react"
import jsPDF from "jspdf"

interface PracticeSession {
  id: string
  role: string
  questions: string[]
  answers: string[]
  score: number
  difficulty: string
  completedAt: string
  timeSpent: number
}

interface QuestionSet {
  role: string
  difficulty: string
  questions: string[]
}

const JobSeekerDashboard = () => {
  const [showQuickPractice, setShowQuickPractice] = useState(false)
  const [showRoleSpecific, setShowRoleSpecific] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  // Role-specific practice states
  const [selectedRole, setSelectedRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [questionCount, setQuestionCount] = useState("5")
  const [difficulty, setDifficulty] = useState("medium")
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Quick practice states
  const [quickQuestions, setQuickQuestions] = useState<string[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [practiceComplete, setPracticeComplete] = useState(false)

  // Progress states
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([])

  // Available job roles
  const jobRoles = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "UX Designer",
    "Marketing Manager",
    "Sales Representative",
    "Business Analyst",
    "DevOps Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "Project Manager",
    "Scrum Master",
    "Quality Assurance",
    "Technical Writer",
  ]

  // Filter roles based on search
  const filteredRoles = jobRoles.filter((role) => role.toLowerCase().includes(searchTerm.toLowerCase()))

  // Question bank for different roles and difficulties
  const questionBank: Record<string, Record<string, string[]>> = {
    "software engineer": {
      easy: [
        "What is the difference between a class and an object?",
        "Explain what version control is and why it's important.",
        "What is debugging and how do you approach it?",
        "Describe the software development lifecycle.",
        "What is the difference between frontend and backend development?",
        "What is an API and how does it work?",
        "Explain what a database is and its purpose.",
        "What is the difference between HTTP and HTTPS?",
      ],
      medium: [
        "Explain the concept of Big O notation and its importance.",
        "How would you optimize a slow database query?",
        "Describe the differences between REST and GraphQL APIs.",
        "What are design patterns and can you give an example?",
        "How do you ensure code quality in a team environment?",
        "Explain the concept of inheritance in object-oriented programming.",
        "What is the difference between synchronous and asynchronous programming?",
        "How would you handle errors in a web application?",
      ],
      hard: [
        "Design a scalable system for handling millions of concurrent users.",
        "How would you implement a distributed caching system?",
        "Describe your approach to microservices architecture.",
        "How would you handle database sharding in a high-traffic application?",
        "Walk me through designing a real-time messaging system.",
        "Explain how you would implement a load balancer.",
        "How would you design a system for processing large amounts of data?",
        "Describe your approach to implementing security in a distributed system.",
      ],
    },
    "product manager": {
      easy: [
        "What is a product roadmap and why is it important?",
        "How would you prioritize features for a new product?",
        "Describe the difference between a feature and a benefit.",
        "What metrics would you track for a mobile app?",
        "How do you gather user feedback?",
        "What is the product development lifecycle?",
        "How do you define product requirements?",
        "What is market research and why is it important?",
      ],
      medium: [
        "How would you handle conflicting priorities from different stakeholders?",
        "Describe your approach to A/B testing a new feature.",
        "How would you determine the success of a product launch?",
        "Walk me through how you'd conduct user research for a new feature.",
        "How do you balance technical debt with new feature development?",
        "Explain how you would price a new product.",
        "How do you work with engineering teams to deliver products?",
        "Describe your approach to competitive analysis.",
      ],
      hard: [
        "Design a go-to-market strategy for a B2B SaaS product entering a competitive market.",
        "How would you approach pricing strategy for a freemium product?",
        "Describe how you'd handle a situation where user data shows declining engagement.",
        "How would you build and manage a product team across multiple time zones?",
        "Walk me through your framework for making build vs. buy decisions.",
        "How would you pivot a product that's not meeting market expectations?",
        "Describe your approach to international product expansion.",
        "How would you handle a major product crisis or failure?",
      ],
    },
  }

  // Load practice sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem("practiceSessions")
    if (savedSessions) {
      setPracticeSessions(JSON.parse(savedSessions))
    }
  }, [])

  // Generate questions for role-specific practice
  const generateRoleQuestions = () => {
    if (!selectedRole) return

    setIsGenerating(true)

    setTimeout(() => {
      const normalizedRole = selectedRole.toLowerCase()
      const difficultyLevel = difficulty === "easy" ? "easy" : difficulty === "hard" ? "hard" : "medium"

      let questions: string[] = []

      if (questionBank[normalizedRole]) {
        questions = questionBank[normalizedRole][difficultyLevel] || []
      } else {
        // Generic questions for unknown roles
        const genericQuestions = {
          easy: [
            `What interests you most about working as a ${selectedRole}?`,
            `Describe your relevant experience for this ${selectedRole} role.`,
            `What do you consider your greatest strength for this position?`,
            `How do you stay updated with industry trends in ${selectedRole}?`,
            `Where do you see yourself in 5 years in this field?`,
          ],
          medium: [
            `Describe a challenging project you worked on as a ${selectedRole}.`,
            `How do you handle tight deadlines and pressure in ${selectedRole} work?`,
            `Tell me about a time you had to learn something new quickly in your ${selectedRole} role.`,
            `How do you approach problem-solving in ${selectedRole} work?`,
            `Describe a situation where you had to work with a difficult team member.`,
          ],
          hard: [
            `How would you lead a ${selectedRole} team through a major organizational change?`,
            `Describe your approach to strategic planning in ${selectedRole} work.`,
            `How do you measure success in your role as a ${selectedRole}?`,
            `Tell me about a time you had to make a difficult decision with limited information.`,
            `How would you handle a situation where you disagree with senior management?`,
          ],
        }
        questions = genericQuestions[difficultyLevel] || genericQuestions.medium
      }

      // Select the requested number of questions
      const count = Number.parseInt(questionCount)
      const selectedQuestions = questions.slice(0, count)

      setGeneratedQuestions(selectedQuestions)
      setIsGenerating(false)
    }, 1000)
  }

  // Start quick practice
  const startQuickPractice = () => {
    const quickQuestionSet = [
      "Tell me about yourself and your background.",
      "What are your greatest strengths?",
      "What is your biggest weakness?",
      "Why do you want to work here?",
      "Where do you see yourself in 5 years?",
      "Describe a challenging situation you faced and how you handled it.",
      "Why are you leaving your current job?",
      "What motivates you in your work?",
    ]

    setQuickQuestions(quickQuestionSet.slice(0, 5))
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setCurrentAnswer("")
    setPracticeComplete(false)
    setShowQuickPractice(true)
  }

  // Handle answer submission in quick practice
  const submitAnswer = () => {
    const newAnswers = [...userAnswers, currentAnswer]
    setUserAnswers(newAnswers)
    setCurrentAnswer("")

    if (currentQuestionIndex < quickQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Practice complete
      setPracticeComplete(true)

      // Save session
      const session: PracticeSession = {
        id: Date.now().toString(),
        role: "General Interview",
        questions: quickQuestions,
        answers: newAnswers,
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        difficulty: "mixed",
        completedAt: new Date().toISOString(),
        timeSpent: Math.floor(Math.random() * 20) + 10, // Random time 10-30 minutes
      }

      const updatedSessions = [...practiceSessions, session]
      setPracticeSessions(updatedSessions)
      localStorage.setItem("practiceSessions", JSON.stringify(updatedSessions))
    }
  }

  // Download PDF for role-specific questions
  const downloadQuestionsPDF = () => {
    if (generatedQuestions.length === 0) return

    const doc = new jsPDF()
    const pageHeight = doc.internal.pageSize.height
    let yPosition = 20

    // Title
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Interview Practice Questions", 20, yPosition)
    yPosition += 10

    // Details
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Role: ${selectedRole}`, 20, yPosition)
    yPosition += 7
    doc.text(`Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`, 20, yPosition)
    yPosition += 7
    doc.text(`Number of Questions: ${generatedQuestions.length}`, 20, yPosition)
    yPosition += 15

    // Questions
    doc.setFontSize(11)
    generatedQuestions.forEach((question, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFont("helvetica", "bold")
      doc.text(`${index + 1}.`, 20, yPosition)
      doc.setFont("helvetica", "normal")

      const lines = doc.splitTextToSize(question, 160)
      doc.text(lines, 30, yPosition)
      yPosition += lines.length * 5 + 10
    })

    doc.save(`${selectedRole}-interview-questions-${difficulty}.pdf`)
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-800">Job Seeker Dashboard</h1>
            <p className="text-slate-600">Practice and improve your interview skills with AI-generated questions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Practice Sessions</CardTitle>
                <Target className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{practiceSessions.length}</div>
                <p className="text-xs text-slate-500">Total completed</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {practiceSessions.length > 0
                    ? Math.round(
                        practiceSessions.reduce((acc, session) => acc + session.score, 0) / practiceSessions.length,
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-slate-500">Across all sessions</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Time Practiced</CardTitle>
                <Clock className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {Math.round(practiceSessions.reduce((acc, session) => acc + session.timeSpent, 0) / 60)}h
                </div>
                <p className="text-xs text-slate-500">Total practice time</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Skills Practiced</CardTitle>
                <Award className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {new Set(practiceSessions.map((s) => s.role)).size}
                </div>
                <p className="text-xs text-slate-500">Different roles</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Practice Section */}
          {!showQuickPractice && !showRoleSpecific && !showProgress && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Quick Practice
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Start a 15-minute practice session with common interview questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={startQuickPractice} className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                    Start Practice
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Role-Specific Practice
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Practice questions tailored to your target job role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowRoleSpecific(true)}
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Choose Role
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Progress
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Track your improvement and identify areas to focus on
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowProgress(true)}
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    View Progress
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Practice Interface */}
          {showQuickPractice && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">Quick Practice Session</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowQuickPractice(false)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!practiceComplete ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        Question {currentQuestionIndex + 1} of {quickQuestions.length}
                      </Badge>
                      <div className="text-sm text-slate-600">
                        Progress: {Math.round(((currentQuestionIndex + 1) / quickQuestions.length) * 100)}%
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        {quickQuestions[currentQuestionIndex]}
                      </h3>
                      <textarea
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full h-32 p-3 border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <Button
                      onClick={submitAnswer}
                      disabled={!currentAnswer.trim()}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      {currentQuestionIndex < quickQuestions.length - 1 ? "Next Question" : "Complete Practice"}
                    </Button>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h3 className="text-2xl font-bold text-slate-800">Practice Complete!</h3>
                    <p className="text-slate-600">Great job! You've completed the quick practice session.</p>
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">{quickQuestions.length}</div>
                        <div className="text-sm text-slate-600">Questions Answered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">{Math.floor(Math.random() * 30) + 70}%</div>
                        <div className="text-sm text-slate-600">Estimated Score</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowQuickPractice(false)}
                      className="bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Role-Specific Practice Interface */}
          {showRoleSpecific && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">Role-Specific Practice</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowRoleSpecific(false)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <CardDescription className="text-slate-600">
                  Generate customized interview questions for your target role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Search Role</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search job roles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-200 focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Select Role</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="border-slate-200 focus:border-slate-400">
                        <SelectValue placeholder="Choose a role" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {filteredRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                        {filteredRoles.length === 0 && (
                          <div className="px-2 py-1.5 text-sm text-slate-500">No roles found</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Number of Questions</label>
                    <Select value={questionCount} onValueChange={setQuestionCount}>
                      <SelectTrigger className="border-slate-200 focus:border-slate-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Questions</SelectItem>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="8">8 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Difficulty Level</label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="border-slate-200 focus:border-slate-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={generateRoleQuestions}
                  disabled={!selectedRole || isGenerating}
                  className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>

                {generatedQuestions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800">Generated Questions</h3>
                      <Button
                        onClick={downloadQuestionsPDF}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {generatedQuestions.map((question, index) => (
                        <div key={index} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                          <div className="flex items-start gap-3">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 mt-1">
                              {index + 1}
                            </Badge>
                            <p className="text-slate-800 leading-relaxed">{question}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Progress View */}
          {showProgress && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">Your Progress</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowProgress(false)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <CardDescription className="text-slate-600">
                  Track your interview practice sessions and improvement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {practiceSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No Practice Sessions Yet</h3>
                    <p className="text-slate-600 mb-4">Start practicing to see your progress here!</p>
                    <Button
                      onClick={() => setShowProgress(false)}
                      className="bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      Start Practicing
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {practiceSessions.map((session, index) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{session.role}</p>
                            <p className="text-sm text-slate-600">
                              {session.questions.length} questions • {session.timeSpent} minutes
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className={
                              session.difficulty === "hard"
                                ? "bg-red-100 text-red-800"
                                : session.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {session.difficulty}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium text-slate-800">Score: {session.score}%</p>
                            <p className="text-xs text-slate-500">
                              {new Date(session.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recent Practice Sessions - Only show when not in other views */}
          {!showQuickPractice && !showRoleSpecific && !showProgress && practiceSessions.length > 0 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">Recent Practice Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {practiceSessions
                    .slice(-4)
                    .reverse()
                    .map((session, index) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{session.role}</p>
                            <p className="text-sm text-slate-600">{session.questions.length} questions answered</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className={
                              session.difficulty === "hard"
                                ? "bg-red-100 text-red-800"
                                : session.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : session.difficulty === "easy"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-slate-100 text-slate-700"
                            }
                          >
                            {session.difficulty}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium text-slate-800">Score: {session.score}%</p>
                            <p className="text-xs text-slate-500">
                              {new Date(session.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

export default JobSeekerDashboard
