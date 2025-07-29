"use client"

import { useState, useEffect } from "react"
import Navigation from "./Navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { BookOpen, Users, BarChart3, Plus, FileText, Download, Search } from "lucide-react"
import jsPDF from "jspdf"

interface Course {
  id: string
  name: string
  students: number
  questionSets: number
  createdAt: string
}

interface QuestionSet {
  id: string
  courseName: string
  topic: string
  difficulty: string
  questions: string[]
  createdAt: string
}

const EducatorDashboard = () => {
  const [showCreateCourse, setShowCreateCourse] = useState(false)
  const [showGenerateQuestions, setShowGenerateQuestions] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Course creation states
  const [courseName, setCourseName] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [expectedStudents, setExpectedStudents] = useState("20")

  // Question generation states
  const [selectedCourse, setSelectedCourse] = useState("")
  const [questionTopic, setQuestionTopic] = useState("")
  const [searchTopic, setSearchTopic] = useState("")
  const [questionCount, setQuestionCount] = useState("10")
  const [difficulty, setDifficulty] = useState("medium")
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Data states
  const [courses, setCourses] = useState<Course[]>([])
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([])

  // Available topics for questions
  const questionTopics = [
    "JavaScript Fundamentals",
    "React Development",
    "Node.js Backend",
    "Database Design",
    "System Architecture",
    "Data Structures",
    "Algorithms",
    "Web Security",
    "API Development",
    "Testing Strategies",
    "DevOps Practices",
    "Mobile Development",
    "UI/UX Design",
    "Project Management",
    "Agile Methodology",
    "Version Control",
    "Cloud Computing",
    "Machine Learning",
    "Data Analysis",
    "Software Engineering",
  ]

  // Filter topics based on search
  const filteredTopics = questionTopics.filter((topic) => topic.toLowerCase().includes(searchTopic.toLowerCase()))

  // Question bank for different topics and difficulties
  const questionBank: Record<string, Record<string, string[]>> = {
    "javascript fundamentals": {
      easy: [
        "What is the difference between let, const, and var in JavaScript?",
        "Explain what a function is and how to declare one.",
        "What are JavaScript data types?",
        "How do you create an array in JavaScript?",
        "What is the difference between == and === in JavaScript?",
        "Explain what a loop is and give an example.",
        "What is an object in JavaScript?",
        "How do you add an element to an array?",
      ],
      medium: [
        "Explain closures in JavaScript with an example.",
        "What is the difference between synchronous and asynchronous JavaScript?",
        "How does event bubbling work in JavaScript?",
        "Explain the concept of hoisting in JavaScript.",
        "What are arrow functions and how do they differ from regular functions?",
        "How do you handle errors in JavaScript?",
        "Explain the concept of prototypes in JavaScript.",
        "What is the difference between map() and forEach()?",
      ],
      hard: [
        "Implement a debounce function from scratch.",
        "Explain how the JavaScript event loop works.",
        "What are generators and how do you use them?",
        "Implement a deep clone function for objects.",
        "Explain the differences between call, apply, and bind.",
        "How would you implement a custom Promise?",
        "Explain memory management and garbage collection in JavaScript.",
        "What are Web Workers and when would you use them?",
      ],
    },
    "react development": {
      easy: [
        "What is React and why is it useful?",
        "How do you create a React component?",
        "What is JSX and how does it work?",
        "Explain the difference between props and state.",
        "How do you handle events in React?",
        "What is the virtual DOM?",
        "How do you render a list of items in React?",
        "What are React hooks?",
      ],
      medium: [
        "Explain the React component lifecycle methods.",
        "How do you manage state in a React application?",
        "What is the useEffect hook and when do you use it?",
        "How do you handle forms in React?",
        "Explain the concept of lifting state up.",
        "What are controlled vs uncontrolled components?",
        "How do you optimize React performance?",
        "What is React Context and when would you use it?",
      ],
      hard: [
        "Implement a custom hook for data fetching with caching.",
        "Explain React's reconciliation algorithm.",
        "How would you implement server-side rendering with React?",
        "What are render props and higher-order components?",
        "How do you implement code splitting in React?",
        "Explain React's Suspense and Concurrent Mode.",
        "How would you test React components effectively?",
        "Implement a React component that handles infinite scrolling.",
      ],
    },
  }

  // Load data from localStorage
  useEffect(() => {
    const savedCourses = localStorage.getItem("educatorCourses")
    const savedQuestionSets = localStorage.getItem("educatorQuestionSets")

    if (savedCourses) {
      setCourses(JSON.parse(savedCourses))
    } else {
      // Initialize with sample data
      const sampleCourses: Course[] = [
        {
          id: "1",
          name: "Advanced JavaScript",
          students: 24,
          questionSets: 3,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "2",
          name: "React Fundamentals",
          students: 18,
          questionSets: 2,
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        },
        {
          id: "3",
          name: "Database Design",
          students: 31,
          questionSets: 4,
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        },
      ]
      setCourses(sampleCourses)
      localStorage.setItem("educatorCourses", JSON.stringify(sampleCourses))
    }

    if (savedQuestionSets) {
      setQuestionSets(JSON.parse(savedQuestionSets))
    }
  }, [])

  // Create new course
  const createCourse = () => {
    if (!courseName.trim()) return

    const newCourse: Course = {
      id: Date.now().toString(),
      name: courseName,
      students: 0,
      questionSets: 0,
      createdAt: new Date().toISOString(),
    }

    const updatedCourses = [...courses, newCourse]
    setCourses(updatedCourses)
    localStorage.setItem("educatorCourses", JSON.stringify(updatedCourses))

    // Reset form
    setCourseName("")
    setCourseDescription("")
    setExpectedStudents("20")
    setShowCreateCourse(false)
  }

  // Generate questions
  const generateQuestions = () => {
    if (!questionTopic.trim()) return

    setIsGenerating(true)

    setTimeout(() => {
      const normalizedTopic = questionTopic.toLowerCase()
      const difficultyLevel = difficulty === "easy" ? "easy" : difficulty === "hard" ? "hard" : "medium"

      let questions: string[] = []

      if (questionBank[normalizedTopic]) {
        questions = questionBank[normalizedTopic][difficultyLevel] || []
      } else {
        // Generic questions for unknown topics
        const genericQuestions = {
          easy: [
            `What are the basic concepts of ${questionTopic}?`,
            `Why is ${questionTopic} important in software development?`,
            `What are the main components of ${questionTopic}?`,
            `How do you get started with ${questionTopic}?`,
            `What are common use cases for ${questionTopic}?`,
          ],
          medium: [
            `Explain the key principles of ${questionTopic}.`,
            `What are the best practices when working with ${questionTopic}?`,
            `How do you troubleshoot common issues in ${questionTopic}?`,
            `Compare ${questionTopic} with similar technologies.`,
            `What are the performance considerations for ${questionTopic}?`,
          ],
          hard: [
            `Design a complex system using ${questionTopic}.`,
            `How would you scale ${questionTopic} for enterprise use?`,
            `What are the advanced features of ${questionTopic}?`,
            `How do you optimize ${questionTopic} for production?`,
            `Explain the internals and architecture of ${questionTopic}.`,
          ],
        }
        questions = genericQuestions[difficultyLevel] || genericQuestions.medium
      }

      // Select the requested number of questions
      const count = Number.parseInt(questionCount)
      const selectedQuestions = questions.slice(0, count)

      setGeneratedQuestions(selectedQuestions)

      // Save question set
      const newQuestionSet: QuestionSet = {
        id: Date.now().toString(),
        courseName: selectedCourse || "General",
        topic: questionTopic,
        difficulty,
        questions: selectedQuestions,
        createdAt: new Date().toISOString(),
      }

      const updatedQuestionSets = [...questionSets, newQuestionSet]
      setQuestionSets(updatedQuestionSets)
      localStorage.setItem("educatorQuestionSets", JSON.stringify(updatedQuestionSets))

      setIsGenerating(false)
    }, 1000)
  }

  // Download PDF
  const downloadQuestionsPDF = () => {
    if (generatedQuestions.length === 0) return

    const doc = new jsPDF()
    const pageHeight = doc.internal.pageSize.height
    let yPosition = 20

    // Title
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Course Interview Questions", 20, yPosition)
    yPosition += 10

    // Details
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Topic: ${questionTopic}`, 20, yPosition)
    yPosition += 7
    doc.text(`Course: ${selectedCourse || "General"}`, 20, yPosition)
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

    doc.save(`${questionTopic}-questions-${difficulty}.pdf`)
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-800">Educator Dashboard</h1>
            <p className="text-slate-600">Manage courses and create engaging interview questions for students</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{courses.length}</div>
                <p className="text-xs text-slate-500">Total courses</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Students</CardTitle>
                <Users className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {courses.reduce((acc, course) => acc + course.students, 0)}
                </div>
                <p className="text-xs text-slate-500">Across all courses</p>
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
                <BarChart3 className="h-4 w-4 text-slate-500" />
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
          {!showCreateCourse && !showGenerateQuestions && !showAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Course
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Set up a new course with custom interview questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowCreateCourse(true)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    Create Course
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Generate Questions
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Create AI-powered interview questions for any topic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowGenerateQuestions(true)}
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Generate Questions
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
                    Track student progress and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowAnalytics(true)}
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Create Course Interface */}
          {showCreateCourse && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">Create New Course</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateCourse(false)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <CardDescription className="text-slate-600">Set up a new course for your students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Course Name</label>
                    <Input
                      placeholder="e.g., Advanced JavaScript"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      className="border-slate-200 focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Expected Students</label>
                    <Select value={expectedStudents} onValueChange={setExpectedStudents}>
                      <SelectTrigger className="border-slate-200 focus:border-slate-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 Students</SelectItem>
                        <SelectItem value="20">20 Students</SelectItem>
                        <SelectItem value="30">30 Students</SelectItem>
                        <SelectItem value="50">50 Students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Course Description</label>
                  <textarea
                    placeholder="Describe what this course covers..."
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    className="w-full h-24 p-3 border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                <Button
                  onClick={createCourse}
                  disabled={!courseName.trim()}
                  className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Generate Questions Interface */}
          {showGenerateQuestions && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">Generate Questions</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowGenerateQuestions(false)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <CardDescription className="text-slate-600">
                  Create customized interview questions for your courses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Course (Optional)</label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="border-slate-200 focus:border-slate-400">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">No specific course</SelectItem>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.name}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Search Topic</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search topics..."
                        value={searchTopic}
                        onChange={(e) => setSearchTopic(e.target.value)}
                        className="pl-10 border-slate-200 focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Select Topic</label>
                    <Select value={questionTopic} onValueChange={setQuestionTopic}>
                      <SelectTrigger className="border-slate-200 focus:border-slate-400">
                        <SelectValue placeholder="Choose topic" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {filteredTopics.length > 0 ? (
                          filteredTopics.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="No topics found" disabled>
                            No topics found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Questions</label>
                    <Select value={questionCount} onValueChange={setQuestionCount}>
                      <SelectTrigger className="border-slate-200 focus:border-slate-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                        <SelectItem value="20">20 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  onClick={generateQuestions}
                  disabled={!questionTopic || isGenerating}
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

          {/* Analytics Interface */}
          {showAnalytics && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">Course Analytics</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowAnalytics(false)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <CardDescription className="text-slate-600">
                  Track your courses and question sets performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Course Performance */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Course Performance</h3>
                    <div className="space-y-3">
                      {courses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{course.name}</p>
                              <p className="text-sm text-slate-600">
                                Created {new Date(course.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-800">{course.students} students</p>
                            <p className="text-xs text-slate-500">{course.questionSets} question sets</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Question Sets */}
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
                              <p className="font-medium text-slate-800">{set.topic}</p>
                              <p className="text-sm text-slate-600">{set.courseName}</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <Badge
                              variant="secondary"
                              className={
                                set.difficulty === "hard"
                                  ? "bg-red-100 text-red-800"
                                  : set.difficulty === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }
                            >
                              {set.difficulty}
                            </Badge>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{set.questions.length} questions</p>
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
          {!showCreateCourse && !showGenerateQuestions && !showAnalytics && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">Recent Course Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.slice(-4).map((course, index) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{course.name}</p>
                          <p className="text-sm text-slate-600">Course created</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-800">{course.students} students</p>
                        <p className="text-xs text-slate-500">{new Date(course.createdAt).toLocaleDateString()}</p>
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

export default EducatorDashboard
