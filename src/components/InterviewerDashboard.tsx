"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Calendar, Users, FileText, Clock, Download, Save, Plus, Search, BarChart3 } from "lucide-react"
import jsPDF from "jspdf"
import Navigation from "./Navigation"

interface Interview {
  id: string
  candidateName: string
  position: string
  status: "scheduled" | "completed" | "in-progress"
  scheduledTime: string
  questionSet?: string[]
}

interface QuestionSet {
  id: string
  jobTitle: string
  difficulty: string
  questions: string[]
  createdAt: string
}

const InterviewerDashboard = () => {
  const [showGenerateQuestions, setShowGenerateQuestions] = useState(false)
  const [showScheduleInterview, setShowScheduleInterview] = useState(false)
  const [showInterviewAnalytics, setShowInterviewAnalytics] = useState(false)

  // Question generation states
  const [jobTitle, setJobTitle] = useState("")
  const [searchJobTitle, setSearchJobTitle] = useState("")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [questionCount, setQuestionCount] = useState("8")
  const [questions, setQuestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Interview scheduling states
  const [candidateName, setCandidateName] = useState("")
  const [candidateEmail, setCandidateEmail] = useState("")
  const [interviewPosition, setInterviewPosition] = useState("")
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewTime, setInterviewTime] = useState("")

  // Data states
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([])

  // Available job titles
  const jobTitles = [
    "Software Engineer",
    "Senior Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Product Manager",
    "Senior Product Manager",
    "Data Scientist",
    "Data Analyst",
    "UX Designer",
    "UI Designer",
    "Marketing Manager",
    "Sales Representative",
    "Business Analyst",
    "Project Manager",
    "Scrum Master",
    "Quality Assurance Engineer",
    "Technical Writer",
    "System Administrator",
    "Database Administrator",
    "Mobile Developer",
    "Machine Learning Engineer",
    "Security Engineer",
    "Cloud Architect",
  ]

  // Filter job titles based on search
  const filteredJobTitles = jobTitles.filter((title) => title.toLowerCase().includes(searchJobTitle.toLowerCase()))

  // Enhanced question bank with more roles and difficulties
  const questionBank: Record<string, Record<string, string[]>> = {
    "software engineer": {
      beginner: [
        "What is the difference between a class and an object?",
        "Explain what version control is and why it's important.",
        "What is debugging and how do you approach it?",
        "Describe the software development lifecycle.",
        "What is the difference between frontend and backend development?",
        "What is an API and how does it work?",
        "Explain what a database is and its purpose.",
        "What is the difference between HTTP and HTTPS?",
      ],
      intermediate: [
        "Explain the concept of Big O notation and its importance.",
        "How would you optimize a slow database query?",
        "Describe the differences between REST and GraphQL APIs.",
        "What are design patterns and can you give an example?",
        "How do you ensure code quality in a team environment?",
        "Explain the concept of inheritance in object-oriented programming.",
        "What is the difference between synchronous and asynchronous programming?",
        "How would you handle errors in a web application?",
      ],
      advanced: [
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
      beginner: [
        "What is a product roadmap and why is it important?",
        "How would you prioritize features for a new product?",
        "Describe the difference between a feature and a benefit.",
        "What metrics would you track for a mobile app?",
        "How do you gather user feedback?",
        "What is the product development lifecycle?",
        "How do you define product requirements?",
        "What is market research and why is it important?",
      ],
      intermediate: [
        "How would you handle conflicting priorities from different stakeholders?",
        "Describe your approach to A/B testing a new feature.",
        "How would you determine the success of a product launch?",
        "Walk me through how you'd conduct user research for a new feature.",
        "How do you balance technical debt with new feature development?",
        "Explain how you would price a new product.",
        "How do you work with engineering teams to deliver products?",
        "Describe your approach to competitive analysis.",
      ],
      advanced: [
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
    "data scientist": {
      beginner: [
        "What is the difference between supervised and unsupervised learning?",
        "Explain what data cleaning involves and why it's important.",
        "What is a correlation and how is it different from causation?",
        "Describe what a normal distribution is.",
        "What are the basic steps in a data science project?",
        "What is the difference between a sample and a population?",
        "Explain what statistical significance means.",
        "What are the different types of data (categorical, numerical, etc.)?",
      ],
      intermediate: [
        "How would you handle missing data in a dataset?",
        "Explain the bias-variance tradeoff in machine learning.",
        "What is cross-validation and why is it important?",
        "How would you evaluate the performance of a classification model?",
        "Describe the difference between bagging and boosting.",
        "What is feature engineering and why is it important?",
        "How do you handle imbalanced datasets?",
        "Explain the difference between Type I and Type II errors.",
      ],
      advanced: [
        "Design an A/B testing framework for a large-scale platform.",
        "How would you build a recommendation system for an e-commerce site?",
        "Describe your approach to feature engineering for time series data.",
        "How would you handle concept drift in a production ML model?",
        "Walk me through building a real-time fraud detection system.",
        "How would you design a data pipeline for processing petabytes of data?",
        "Explain how you would implement a deep learning model in production.",
        "Describe your approach to model interpretability and explainability.",
      ],
    },
  }

  // Load data from localStorage
  useEffect(() => {
    const savedInterviews = localStorage.getItem("interviewerInterviews")
    const savedQuestionSets = localStorage.getItem("interviewerQuestionSets")

    if (savedInterviews) {
      setInterviews(JSON.parse(savedInterviews))
    } else {
      // Initialize with sample data
      const sampleInterviews: Interview[] = [
        {
          id: "1",
          candidateName: "Sarah Johnson",
          position: "Senior Product Manager",
          status: "completed",
          scheduledTime: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "2",
          candidateName: "Mike Chen",
          position: "Software Engineer",
          status: "scheduled",
          scheduledTime: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: "3",
          candidateName: "Emily Davis",
          position: "UX Designer",
          status: "in-progress",
          scheduledTime: new Date().toISOString(),
        },
      ]
      setInterviews(sampleInterviews)
      localStorage.setItem("interviewerInterviews", JSON.stringify(sampleInterviews))
    }

    if (savedQuestionSets) {
      setQuestionSets(JSON.parse(savedQuestionSets))
    }
  }, [])

  // Generate questions for interviews
  const generateQuestions = () => {
    if (!jobTitle.trim()) return

    setIsGenerating(true)

    setTimeout(() => {
      const normalizedTitle = jobTitle.toLowerCase().trim()
      let selectedQuestions: string[] = []

      // Find matching questions or use generic ones
      if (questionBank[normalizedTitle]) {
        selectedQuestions =
          questionBank[normalizedTitle][difficulty as keyof (typeof questionBank)["software engineer"]]
      } else {
        // Generic questions for unknown job titles
        const genericQuestions = {
          beginner: [
            `What interests you most about working as a ${jobTitle}?`,
            `Describe your relevant experience for this ${jobTitle} role.`,
            `What do you consider your greatest strength for this position?`,
            `How do you stay updated with industry trends?`,
            `Where do you see yourself in 5 years in this field?`,
            `What motivates you in your work as a ${jobTitle}?`,
            `How do you handle constructive feedback?`,
            `Describe a typical day in your current role.`,
          ],
          intermediate: [
            `Describe a challenging project you worked on as a ${jobTitle}.`,
            `How do you handle tight deadlines and pressure?`,
            `Tell me about a time you had to learn something new quickly.`,
            `How do you approach problem-solving in your work?`,
            `Describe a situation where you had to work with a difficult team member.`,
            `How do you prioritize your tasks when everything seems urgent?`,
            `Tell me about a time you made a mistake and how you handled it.`,
            `How do you ensure quality in your work?`,
          ],
          advanced: [
            `How would you lead a team through a major organizational change?`,
            `Describe your approach to strategic planning in your field.`,
            `How do you measure success in your role as a ${jobTitle}?`,
            `Tell me about a time you had to make a difficult decision with limited information.`,
            `How would you handle a situation where you disagree with senior management?`,
            `Describe how you would mentor junior team members.`,
            `How do you stay innovative in your field?`,
            `What would you do in your first 90 days in this role?`,
          ],
        }
        selectedQuestions = genericQuestions[difficulty as keyof typeof genericQuestions]
      }

      // Select the requested number of questions
      const count = Number.parseInt(questionCount)
      const finalQuestions = selectedQuestions.slice(0, count)

      setQuestions(finalQuestions)

      // Save question set
      const newQuestionSet: QuestionSet = {
        id: Date.now().toString(),
        jobTitle,
        difficulty,
        questions: finalQuestions,
        createdAt: new Date().toISOString(),
      }

      const updatedQuestionSets = [...questionSets, newQuestionSet]
      setQuestionSets(updatedQuestionSets)
      localStorage.setItem("interviewerQuestionSets", JSON.stringify(updatedQuestionSets))

      setIsGenerating(false)
    }, 1000)
  }

  // Schedule new interview
  const scheduleInterview = () => {
    if (!candidateName.trim() || !interviewPosition.trim() || !interviewDate || !interviewTime) return

    const newInterview: Interview = {
      id: Date.now().toString(),
      candidateName,
      position: interviewPosition,
      status: "scheduled",
      scheduledTime: new Date(`${interviewDate}T${interviewTime}`).toISOString(),
    }

    const updatedInterviews = [...interviews, newInterview]
    setInterviews(updatedInterviews)
    localStorage.setItem("interviewerInterviews", JSON.stringify(updatedInterviews))

    // Reset form
    setCandidateName("")
    setCandidateEmail("")
    setInterviewPosition("")
    setInterviewDate("")
    setInterviewTime("")
    setShowScheduleInterview(false)
  }

  // Download PDF
  const downloadPDF = () => {
    if (questions.length === 0) return

    const doc = new jsPDF()
    const pageHeight = doc.internal.pageSize.height
    let yPosition = 20

    // Title
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Interview Questions", 20, yPosition)
    yPosition += 10

    // Job title and difficulty
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Job Title: ${jobTitle}`, 20, yPosition)
    yPosition += 7
    doc.text(`Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`, 20, yPosition)
    yPosition += 7
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition)
    yPosition += 15

    // Questions
    doc.setFontSize(11)
    questions.forEach((question, index) => {
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

    doc.save(`${jobTitle}-interview-questions-${difficulty}.pdf`)
  }

  // Save question set
  const saveQuestionSet = () => {
    if (questions.length === 0) return
    alert("Question set saved successfully!")
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-800">Interviewer Dashboard</h1>
            <p className="text-slate-600">Conduct effective interviews with AI-generated questions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Interviews Scheduled</CardTitle>
                <Calendar className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {interviews.filter((i) => i.status === "scheduled").length}
                </div>
                <p className="text-xs text-slate-500">Upcoming interviews</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Candidates Reviewed</CardTitle>
                <Users className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {interviews.filter((i) => i.status === "completed").length}
                </div>
                <p className="text-xs text-slate-500">Completed interviews</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Question Sets</CardTitle>
                <FileText className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{questionSets.length}</div>
                <p className="text-xs text-slate-500">Total created</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Avg Questions</CardTitle>
                <Clock className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {questionSets.length > 0
                    ? Math.round(questionSets.reduce((acc, set) => acc + set.questions.length, 0) / questionSets.length)
                    : 0}
                </div>
                <p className="text-xs text-slate-500">Per question set</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions */}
          {!showGenerateQuestions && !showScheduleInterview && !showInterviewAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Generate Questions
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Create tailored questions for your upcoming interviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowGenerateQuestions(true)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    Generate Questions
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Interview
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Schedule a new interview with a candidate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowScheduleInterview(true)}
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Schedule Interview
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Track interview performance and candidate metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowInterviewAnalytics(true)}
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Generate Questions Interface */}
          {showGenerateQuestions && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">Generate Interview Questions</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowGenerateQuestions(false)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <CardDescription className="text-slate-600">
                  Create tailored questions for your upcoming interviews
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Search Job Title</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search job titles..."
                        value={searchJobTitle}
                        onChange={(e) => setSearchJobTitle(e.target.value)}
                        className="pl-10 border-slate-200 focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Job Title or Topic</label>
                    <Select value={jobTitle} onValueChange={setJobTitle}>
                      <SelectTrigger className="border-slate-200 focus:border-slate-400">
                        <SelectValue placeholder="Choose job title" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {filteredJobTitles.length > 0 ? (
                          filteredJobTitles.map((title) => (
                            <SelectItem key={title} value={title}>
                              {title}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No job titles found
                          </SelectItem>
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
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="8">8 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="12">12 Questions</SelectItem>
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
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={generateQuestions}
                  disabled={!jobTitle.trim() || isGenerating}
                  className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>

                {questions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800">Generated Questions</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveQuestionSet}
                          className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Set
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadPDF}
                          className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {questions.map((question, index) => (
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

          {/* Schedule Interview Interface */}
          {showScheduleInterview && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">Schedule Interview</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowScheduleInterview(false)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <CardDescription className="text-slate-600">Schedule a new interview with a candidate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Candidate Name</label>
                    <Input
                      placeholder="Enter candidate name"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="border-slate-200 focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Candidate Email</label>
                    <Input
                      type="email"
                      placeholder="Enter candidate email"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      className="border-slate-200 focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Position</label>
                    <Select value={interviewPosition} onValueChange={setInterviewPosition}>
                      <SelectTrigger className="border-slate-200 focus:border-slate-400">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {jobTitles.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Interview Date</label>
                    <Input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="border-slate-200 focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Interview Time</label>
                    <Input
                      type="time"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="border-slate-200 focus:border-slate-400"
                    />
                  </div>
                </div>

                <Button
                  onClick={scheduleInterview}
                  disabled={!candidateName.trim() || !interviewPosition || !interviewDate || !interviewTime}
                  className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Interview Analytics Interface */}
          {showInterviewAnalytics && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">Interview Analytics</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowInterviewAnalytics(false)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <CardDescription className="text-slate-600">
                  Track interview performance and candidate metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Interview Status Overview */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Interview Status Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-2xl font-bold text-green-800">
                          {interviews.filter((i) => i.status === "completed").length}
                        </div>
                        <div className="text-sm text-green-600">Completed</div>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-2xl font-bold text-blue-800">
                          {interviews.filter((i) => i.status === "scheduled").length}
                        </div>
                        <div className="text-sm text-blue-600">Scheduled</div>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-800">
                          {interviews.filter((i) => i.status === "in-progress").length}
                        </div>
                        <div className="text-sm text-yellow-600">In Progress</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Question Sets */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Question Sets</h3>
                    <div className="space-y-3">
                      {questionSets.slice(-5).map((set) => (
                        <div
                          key={set.id}
                          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                              <FileText className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{set.jobTitle}</p>
                              <p className="text-sm text-slate-600">{set.questions.length} questions</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <Badge
                              variant="secondary"
                              className={
                                set.difficulty === "advanced"
                                  ? "bg-red-100 text-red-800"
                                  : set.difficulty === "intermediate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }
                            >
                              {set.difficulty}
                            </Badge>
                            <div>
                              <p className="text-xs text-slate-500">{new Date(set.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity - Only show when not in other views */}
          {!showGenerateQuestions && !showScheduleInterview && !showInterviewAnalytics && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">Recent Interview Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-600">
                            {interview.candidateName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{interview.candidateName}</p>
                          <p className="text-sm text-slate-600">{interview.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            interview.status === "completed"
                              ? "default"
                              : interview.status === "in-progress"
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            interview.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : interview.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-700"
                          }
                        >
                          {interview.status === "in-progress" ? "In Progress" : interview.status}
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(interview.scheduledTime).toLocaleDateString()}
                        </p>
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

export default InterviewerDashboard
