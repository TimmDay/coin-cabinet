"use client"

import { usePathname } from "next/navigation"
import { Footer } from "~/components/layout/Footer"
import { Breadcrumb } from "~/components/ui/Breadcrumb"

type PageWrapperProps = {
  children: React.ReactNode;
};

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Breadcrumb - positioned under header, above page content */}
      {!isHomePage && (
        <div className="flex w-full justify-center pt-12 pb-2">
          <Breadcrumb />
        </div>
      )}

      {/* Main page content */}
      <main
        className={`container mx-auto flex-1 px-6 pb-8 ${isHomePage ? "pt-4" : ""}`}
      >
        {children}
      </main>

      <Footer />
    </div>
  )
}
