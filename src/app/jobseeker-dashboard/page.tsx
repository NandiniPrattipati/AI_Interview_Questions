import JobSeekerDashboard from "@/components/JobSeekerDashboard"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function JobSeekerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="jobseeker">
      <JobSeekerDashboard />
    </ProtectedRoute>
  )
}
