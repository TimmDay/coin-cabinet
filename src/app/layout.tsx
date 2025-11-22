import { type Metadata } from "next"
import { Geist } from "next/font/google"
import Navbar from "~/components/layout/Navbar"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { AuthProvider } from "~/components/providers/auth-provider"
import { ReactQueryProvider } from "~/components/providers/react-query-provider"
import { ScrollToTop } from "~/components/ui"
import "~/styles/globals.css"

export const metadata: Metadata = {
  title: "Somnus Collection",
  description: "The Somnus Coin Collection",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <AuthProvider>
          <ReactQueryProvider>
            <Navbar />
            <PageWrapper>{children}</PageWrapper>
            <ScrollToTop />
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
