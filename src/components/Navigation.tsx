"use client"

import { Button } from "./ui/button"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { LogOut, User, Brain } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const Navigation = () => {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "educator":
        return "Educator"
      case "jobseeker":
        return "Job Seeker"
      case "interviewer":
        return "Interviewer"
      default:
        return "User"
    }
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-slate-800" />
          <span className="text-xl font-bold text-slate-800">AI Interview Generator</span>
        </div>

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-slate-50">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-slate-500">{profile?.role ? getRoleDisplayName(profile.role) : ""}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-slate-600">
                <User className="w-4 h-4 mr-2" />
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-600">
                Role: {profile?.role ? getRoleDisplayName(profile.role) : "Not set"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  )
}

export default Navigation
