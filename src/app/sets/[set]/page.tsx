"use client"

import { useParams, useRouter } from "next/navigation"
import { Breadcrumb } from "~/components/ui/Breadcrumb"
import { CoinCardGridItem } from "~/components/ui/CoinCardGridItem"
import { PageTitle } from "~/components/ui/PageTitle"
import { ViewModeControls } from "~/components/ui/ViewModeControls"
import { generateSetCoinUrl } from "~/lib/utils/url-helpers"

// Mock data for sets - in real app this would come from database
const setData = {
  "severan-dynasty": {
    title: "Severan Dynasty",
    description: "Coins from the Severan Dynasty period (193-235 AD)",
    coins: [
      {
        id: 1,
        civ: "Roman",
        nickname: "Septimius Severus",
        denomination: "Denarius",
        mint_year_earliest: 193,
        mint_year_latest: 211,
        image_link_o: "roman_severus_denarius_o",
        image_link_r: "roman_severus_denarius_r",
        diameter: 19,
      },
      {
        id: 2,
        civ: "Roman",
        nickname: "Caracalla",
        denomination: "Aureus",
        mint_year_earliest: 198,
        mint_year_latest: 217,
        image_link_o: "roman_caracalla_aureus_o",
        image_link_r: "roman_caracalla_aureus_r",
        diameter: 20,
      },
      {
        id: 3,
        civ: "Roman",
        nickname: "Julia Domna",
        denomination: "Denarius",
        mint_year_earliest: 193,
        mint_year_latest: 217,
        image_link_o: "roman_julia_domna_denarius_o",
        image_link_r: "roman_julia_domna_denarius_r",
        diameter: 18,
      },
    ],
  },
  constantinian: {
    title: "Constantinian",
    description: "Coins from the Constantinian period (306-337 AD)",
    coins: [
      {
        id: 4,
        civ: "Roman",
        nickname: "Constantine I",
        denomination: "Solidus",
        mint_year_earliest: 306,
        mint_year_latest: 337,
        image_link_o: "roman_constantine_solidus_o",
        image_link_r: "roman_constantine_solidus_r",
        diameter: 21,
      },
      {
        id: 5,
        civ: "Roman",
        nickname: "Crispus",
        denomination: "Follis",
        mint_year_earliest: 317,
        mint_year_latest: 326,
        image_link_o: "roman_crispus_follis_o",
        image_link_r: "roman_crispus_follis_r",
        diameter: 22,
      },
      {
        id: 6,
        civ: "Roman",
        nickname: "Helena",
        denomination: "Follis",
        mint_year_earliest: 324,
        mint_year_latest: 330,
        image_link_o: "roman_helena_follis_o",
        image_link_r: "roman_helena_follis_r",
        diameter: 20,
      },
    ],
  },
}

export default function SetPage() {
  const router = useRouter()
  const params = useParams<{ set: string }>()
  const set = params.set
  const setInfo = setData[set as keyof typeof setData]

  if (!setInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Set Not Found</h1>
          <p className="mt-4 text-slate-400">
            The set &quot;{set}&quot; could not be found.
          </p>
        </div>
      </div>
    )
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

      <ViewModeControls viewMode="both" onViewModeChange={() => undefined} />

      <div className="flex flex-wrap justify-center gap-x-12">
        {setInfo.coins.map((coin, index) => (
          <CoinCardGridItem
            key={coin.id}
            civ={coin.civ}
            nickname={coin.nickname}
            denomination={coin.denomination}
            mintYearEarliest={coin.mint_year_earliest}
            mintYearLatest={coin.mint_year_latest}
            obverseImageId={coin.image_link_o}
            reverseImageId={coin.image_link_r}
            diameter={coin.diameter}
            view="both"
            onClick={() => {
              const url = generateSetCoinUrl(set, coin.id, coin.nickname)
              router.push(url)
            }}
            index={index + 1}
          />
        ))}
      </div>
    </div>
  )
}
