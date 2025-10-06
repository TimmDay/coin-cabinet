import { arrayOverlaps, asc } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Breadcrumb } from "~/components/ui/Breadcrumb"
import { PageTitle } from "~/components/ui/PageTitle"
import { db } from "~/server/db"
import { somnus_collection } from "~/server/db/schema"
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

  // Query database for coins with the specified set, ordered by reign_start
  const coins = await db
    .select()
    .from(somnus_collection)
    .where(arrayOverlaps(somnus_collection.sets, [setInfo.setFilter]))
    .orderBy(asc(somnus_collection.reign_start))

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
