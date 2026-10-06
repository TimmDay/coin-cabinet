"use client"

import { usePathname } from "next/navigation"
import { Footer } from "~/components/layout/Footer"
import { Breadcrumb } from "~/components/ui/Breadcrumb"

type PageWrapperProps = {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const isCoinDeepDivePage =
    pathname.startsWith("/cabinet/") && pathname !== "/cabinet"
  // The map wants its height: the breadcrumb and its margins cost about 100px
  // above a view whose whole job is to be looked at.
  const isMapPage = pathname === "/map"

  return (
    <div className="flex min-h-screen flex-col">
      {/* Breadcrumb - positioned under header, above page content */}
      {!isHomePage && !isCoinDeepDivePage && !isMapPage && (
        <div className="flex w-full justify-center pt-8 pb-6 md:pb-12">
          <Breadcrumb />
        </div>
      )}

      {/* Main page content */}
      <main id="main-content" className="container mx-auto flex-1 px-6 pb-8">
        {children}
      </main>

      <Footer />
    </div>
  )
}
