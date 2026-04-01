import type { Metadata } from "next"
import { Barlow_Condensed, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
})

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Justin Jamssens — SCM Control Tower",
  description:
    "OT Cybersecurity Engineer with 5 years at GM building supply chain tools. Cyber breach simulator, Feynman active recall, and SCOR risk engine.",
  openGraph: {
    title: "Justin Jamssens — SCM Control Tower",
    description:
      "OT Cybersecurity Engineer with 5 years at GM building supply chain tools. Cyber breach simulator, Feynman active recall, and SCOR risk engine.",
    url: "https://scm-control-tower-qe01sqm10-jjamssens-projects.vercel.app",
    siteName: "Justin Jamssens",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Justin Jamssens — SCM Control Tower",
    description:
      "OT Cybersecurity Engineer with 5 years at GM building supply chain tools.",
  },
  metadataBase: new URL("https://scm-control-tower-qe01sqm10-jjamssens-projects.vercel.app"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
