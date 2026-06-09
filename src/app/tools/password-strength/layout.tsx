import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Password Strength Checker — How Long to Crack Your Password? | Dayblip",
  description: "Check your password strength and see how long it would take to crack. Get specific tips to make your password stronger. All checking happens in your browser. Free.",
  alternates: { canonical: "https://www.dayblip.com/tools/password-strength" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
