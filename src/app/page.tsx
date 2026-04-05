"use client"

import HomeNavbar from "~/components/layout/HomeNavbar"
import { FeaturedCoins } from "~/components/ui/FeaturedCoins"
import { FeaturedSets } from "~/components/ui/FeaturedSets"
import { PageTitle } from "~/components/ui/PageTitle"
import { featuredSets } from "~/data/sets"
import { useRandomCoins } from "~/hooks/useRandomCoins"
import text from "./translations/homepage"

export default function HomePage() {
  const { coins: featuredCoins, isLoading } = useRandomCoins(3)

  return (
    <>
      {/* Hide the root layout navbar and use HomeNavbar instead */}
      <style jsx global>{`
        .somnus-nav {
          display: none;
        }
      `}</style>
      <HomeNavbar />

      <main className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden">
        <div className="content-wrapper home">
          <PageTitle subtitle="to the Somnus Collection">Welcome</PageTitle>

          {/* Featured Coins Section */}
          <div className="w-full max-w-4xl">
            <FeaturedCoins
              title=""
              coins={featuredCoins}
              isLoading={isLoading}
            />
          </div>

          <div className="max-w-[580px]">
            <div className="mx-auto max-w-3xl justify-center lg:max-w-4xl">
              {homePageText(text.welcome)}
              {homePageText(text.thanks)}
            </div>
          </div>

          {/* Featured Sets Section */}
          <div className="w-full max-w-4xl">
            <FeaturedSets sets={featuredSets} />
          </div>
          {/* <div> */}
          {/* \TODO: contact form */}
          {/* </div> */}
        </div>
      </main>
    </>
  )
}

function homePageText(text: string) {
  return (
    <p className="body-text mx-auto mb-6 text-justify text-xl whitespace-pre-line">
      {text}
    </p>
  )
}
