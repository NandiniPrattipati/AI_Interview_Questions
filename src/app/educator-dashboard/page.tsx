import EducatorDashboard from "@/components/EducatorDashboard"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function EducatorDashboardPage() {
  return (
    <ProtectedRoute requiredRole="educator">
      <EducatorDashboard />
    </ProtectedRoute>
  )
}
