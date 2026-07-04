import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Countdown {
  id: string
  slug: string
  event_name: string
  event_date: string
  message: string | null
  theme: "dark" | "light"
  created_at: string
  view_count: number
  photo_url: string | null
  delete_token: string | null
}
