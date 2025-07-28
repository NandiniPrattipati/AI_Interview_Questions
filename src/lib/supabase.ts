import { createClient } from "@supabase/supabase-js"

// These will be your Supabase project credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = "educator" | "jobseeker" | "interviewer"

export interface UserProfile {
  id: string
  email: string
  role: UserRole | null
  full_name?: string
  created_at: string
  updated_at: string
}
