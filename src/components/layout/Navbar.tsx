"use client"
import Image from "next/image"
import NextLink from "next/link"
import { useFeatureFlagQuery } from "~/lib/hooks/useFeatureFlagQuery"
import { DesktopNav } from "./DesktopNav"
import { MobileNavigation } from "./MobileNavigation"

export default function Navbar() {
  const withFeatureQuery = useFeatureFlagQuery()

  return (
    <nav
      className="somnus-nav z-overlay relative flex h-32 flex-col justify-center px-4 sm:px-6 lg:h-20 lg:flex-row lg:items-center lg:justify-between lg:px-8"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Mobile navigation burger menu - vertically centered on mobile */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 sm:left-6 lg:hidden">
        <MobileNavigation />
      </div>

      {/* Site Logo - centered on mobile, left on desktop */}
      <div className="flex justify-center lg:order-1 lg:justify-start">
        <NextLink href={withFeatureQuery("/")} className="">
          <div className="relative flex h-20 w-20 cursor-pointer items-center justify-center lg:h-12 lg:w-12">
            <Image
              src="/assets/logo-white.svg"
              alt="Coin Cabinet Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
        </NextLink>
      </div>

      {/* Links: centered inline on desktop */}
      <DesktopNav
        className="hidden items-center justify-center space-x-8 pb-4 lg:order-2 lg:flex lg:pb-0"
        listClassName="flex items-center space-x-8"
        openToward="right"
      />
    </nav>
  )
}
