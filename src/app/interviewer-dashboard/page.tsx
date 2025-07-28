import InterviewerDashboard from "@/components/InterviewerDashboard"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function InterviewerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="interviewer">
      <InterviewerDashboard />
    </ProtectedRoute>
  )
}
