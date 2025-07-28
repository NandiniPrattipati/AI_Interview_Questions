import RoleSelection from "@/pages/RoleSelection"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function RoleSelectionPage() {
  return (
    <ProtectedRoute>
      <RoleSelection />
    </ProtectedRoute>
  )
}
