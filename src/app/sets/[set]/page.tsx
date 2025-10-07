import { notFound } from "next/navigation"
import { Breadcrumb } from "~/components/ui/Breadcrumb"
import { PageTitle } from "~/components/ui/PageTitle"
import { createClient } from "~/lib/supabase-server"
import type { SomnusCollection } from "~/server/db/schema"
import { SetPageClient } from "./SetPageClient"

// Set metadata configuration
const setMetadata = {
  "severan-dynasty": {
    title: "Severan Dynasty",
    description: "Coins from the Severan Dynasty period (193-235 AD)",
    setFilter: "severan",
  },
  constantinian: {
    title: "Constantinian",
    description: "Coins from the Constantinian period (306-337 AD)",
    setFilter: "constantinian",
  },
  crisis: {
    title: "Third Century Crisis",
    description: "Coins from the Crisis period (235-284 AD)",
    setFilter: "crisis",
  },
  "imperial-women": {
    title: "Imperial Women",
    description: "Coins featuring Roman imperial women and empresses",
    setFilter: "imperial women",
  },
  "gordy-boys": {
    title: "Gordy Boys",
    description: "Special collection of the coins of Gordian III",
    setFilter: "gordy boys",
  },
} as const

type SetKey = keyof typeof setMetadata

export default async function SetPage({
  params,
}: {
  params: Promise<{ set: string }>
}) {
  const { set } = await params
  const setInfo = setMetadata[set as SetKey]

  if (!setInfo) {
    notFound()
  }

  // Use the same Supabase client approach as the working API route
  let coins: SomnusCollection[] = []

  try {
    const supabase = await createClient()

    // Fetch all coins using Supabase client (same as API route)
    const { data: allCoins, error } = await supabase
      .from("somnus_collection")
      .select("*")
      .order("reign_start", { ascending: true, nullsFirst: false })
      .order("mint_year_earliest", { ascending: true, nullsFirst: false })
      .order("diameter", { ascending: true, nullsFirst: false })

    if (error) {
      console.error("Supabase error:", error)
      coins = []
    } else {
      // Filter in JavaScript for the specific set
      coins = ((allCoins || []) as SomnusCollection[]).filter(
        (coin) => coin.sets?.includes(setInfo.setFilter) ?? false,
      )
      console.log(`Found ${coins.length} coins for set ${set}`)
    }
  } catch (error) {
    console.error(`Failed to fetch coins for set ${set}:`, error)
    coins = []
  }

  const breadcrumbItems = [
    { label: "Sets", href: "/sets" },
    { label: setInfo.title, href: `/sets/${set}` },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <PageTitle>{setInfo.title}</PageTitle>

      <p className="mb-8 text-center text-slate-300">{setInfo.description}</p>

      <SetPageClient coins={coins} setSlug={set} setTitle={setInfo.title} />
    </div>
  )
}
