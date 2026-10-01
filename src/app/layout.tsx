import { type Metadata } from "next"
import { Alegreya, Cinzel, Cormorant_Garamond } from "next/font/google"
import Navbar from "~/components/layout/Navbar"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { ReactQueryProvider } from "~/components/providers/react-query-provider"
import { ScrollToTop } from "~/components/ui"
import "~/styles/globals.css"

export const metadata: Metadata = {
  title: "Somnus Collection",
  description: "The Somnus Coin Collection",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

// Roman inscriptional capitals for headings (variable font, so every weight
// a heading asks for is real, not a synthesized bold).
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
})

// Soft classical serif for the somnus-styled subtitles.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-cormorant",
})

// Calligraphic text serif, open and readable: the body font for the whole app
// (set as --font-sans in globals.css).
const alegreya = Alegreya({
  subsets: ["latin"],
  variable: "--font-alegreya",
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${alegreya.variable}`}
    >
      <body>
        <ReactQueryProvider>
          <Navbar />
          <PageWrapper>{children}</PageWrapper>
          <ScrollToTop />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
