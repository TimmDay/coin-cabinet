"use client"
import Image from "next/image"
import NextLink from "next/link"
import { useFeatureFlagQuery } from "~/lib/hooks/useFeatureFlagQuery"
import { DesktopNav } from "./DesktopNav"
import { MobileNavigation } from "./MobileNavigation"

export default function HomeNavbar() {
  const withFeatureQuery = useFeatureFlagQuery()

  return (
    <nav
      className="somnus-nav-home z-overlay relative right-1/2 left-1/2 mr-[-50vw] ml-[-50vw] flex w-screen flex-col items-center justify-center px-4 py-10 sm:px-6 lg:h-auto lg:px-8 lg:py-12"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Mobile navigation burger menu */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 sm:left-6 lg:hidden">
        <MobileNavigation />
      </div>

      {/* Large centered logo, nudged 8px right on desktop for visual alignment */}
      <div className="flex justify-center lg:translate-x-2">
        <NextLink href={withFeatureQuery("/")} className="">
          <div className="relative flex h-32 w-32 cursor-pointer items-center justify-center lg:h-40 lg:w-40">
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

      {/* Links: top right on desktop; menus open leftwards to stay on screen */}
      <DesktopNav
        className="hidden lg:absolute lg:top-6 lg:right-8 lg:flex lg:items-center"
        listClassName="flex flex-wrap items-center justify-center gap-x-8"
        openToward="left"
      />
    </nav>
  )
}
