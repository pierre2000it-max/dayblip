import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gym Membership Calculator — Cost Per Visit | Dayblip",
  description: "Calculate the real cost per gym visit and see what your membership could grow to if invested. Humorous and honest. Free gym membership calculator.",
  alternates: { canonical: "https://www.dayblip.com/curiosity/gym-membership" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
