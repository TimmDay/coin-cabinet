import { type Metadata } from "next"
import { Poppins } from "next/font/google"
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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
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
