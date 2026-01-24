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

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Breadcrumb - positioned under header, above page content */}
      {!isHomePage && !isCoinDeepDivePage && (
        <div className="flex w-full justify-center pt-8 pb-6 md:pb-12">
          <Breadcrumb />
        </div>
      )}

      {/* Main page content */}
      <main className="container mx-auto flex-1 px-6 pb-8">{children}</main>

      <Footer />
    </div>
  )
}
