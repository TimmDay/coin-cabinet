import { notFound } from "next/navigation"
import { PageTitle } from "~/components/ui/PageTitle"
import { SetPageWrapper } from "./SetPageWrapper"

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
  tetrachy: {
    title: "Tetrachy",
    description: "Coins from the Tetrarchy period (293-313 AD)",
    setFilter: "tetrachy",
  },
  "gordy-boys": {
    title: "Gordy Boys",
    description: "Special collection of the coins of Gordian III",
    setFilter: "gordy boys",
  },
  hoards: {
    title: "Hoards",
    description: "Coins discovered in archaeological hoards and treasure finds",
    setFilter: "hoards",
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

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle>{setInfo.title}</PageTitle>

      <p className="mb-8 text-center text-slate-300">{setInfo.description}</p>

      <SetPageWrapper setInfo={setInfo} setSlug={set} />
    </div>
  )
}
