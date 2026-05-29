import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Dayblip",
    default: "Dayblip | Countdown & Date Tools",
  },
  description:
    "Free countdown timers, date calculators and curiosity tools. Find out how many days until any event, what happened on your birthday, and more.",
  keywords: [
    "countdown timer",
    "days until christmas",
    "age calculator",
    "date calculator",
    "how many days until",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
