import { useArtifacts } from "~/api/artifacts"
import { MintDeepDiveCard } from "~/components/ui"
import {
  formatOpenYearRange,
  formatYear,
  formatYearRange,
  isYear,
} from "~/lib/utils/years"
import { formatPhysicalCharacteristics } from "~/lib/utils/physical-formatting"
import type { CoinDeity, CoinEnhanced, CoinPerson } from "~/types/api"
import { DeepDiveCard } from "../DeepDiveCard"

type DeepDiveCardsSectionProps = {
  coin: CoinEnhanced
}

/** "lived 214—275 CE", "born 214 CE", "died 275 CE", or "" for neither. */
function lifeYears(birth?: number | null, death?: number | null): string {
  if (isYear(birth) && isYear(death)) {
    return `lived ${formatYearRange(birth, death)}`
  }
  if (isYear(birth)) return `born ${formatYear(birth)}`
  if (isYear(death)) return `died ${formatYear(death)}`
  return ""
}

export function transformDeitiesToCards(
  deities: CoinDeity[] | undefined,
  artifacts: ReturnType<typeof useArtifacts>["data"],
) {
  return (
    deities?.map((deity) => {
      // A deity is pictured by its artifacts, which carry the alt text and
      // caption.
      const images = deity.artifact_ids.flatMap((id) => {
        const artifact = artifacts?.find((a) => a.id === id)
        return artifact?.img_src
          ? [
              {
                src: artifact.img_src,
                alt: artifact.img_alt ?? artifact.name,
                name: artifact.name,
                location:
                  artifact.location_name ??
                  artifact.institution_name ??
                  undefined,
                credit: artifact.img_credit ?? undefined,
              },
            ]
          : []
      })

      return {
        title: deity.name,
        subtitle: deity.subtitle ?? "",
        primaryInfo: deity.flavour_text ?? "",
        footer: deity.features_coinage?.map((f) => f.name).join(", ") ?? "",
        images: images.length ? images : undefined,
        citations: deity.citations,
      }
    }) ?? []
  )
}

export function transformHistoricalFiguresToCards(
  figures: CoinPerson[] | undefined,
  artifacts: ReturnType<typeof useArtifacts>["data"],
) {
  return (
    figures?.map((figure) => {
      const artifactId = figure.artifact_ids[0]
      const artifact = artifactId
        ? artifacts?.find((a) => a.id === artifactId)
        : undefined

      const reigned = formatOpenYearRange(figure.reign_start, figure.reign_end)
      const subtitle = [
        figure.authority,
        lifeYears(figure.birth, figure.death),
        reigned && `reigned ${reigned}`,
      ]
        .filter(Boolean)
        .join(", ")

      return {
        title: figure.name,
        subtitle,
        primaryInfo: figure.flavour_text ?? "",
        secondaryInfo: undefined,
        footer: figure.altNames?.length
          ? figure.altNames.join(", ")
          : (figure.full_name ?? ""),
        image: artifact?.img_src ?? undefined,
        altText: artifact?.img_alt ?? figure.name,
        caption: artifact?.flavour_text ?? undefined,
        citations: figure.citations,
      }
    }) ?? []
  )
}

function createCoinFlip(
  coin: CoinEnhanced,
  artifacts: ReturnType<typeof useArtifacts>["data"],
) {
  // Build civilization text
  const civText = coin.civ_specific
    ? `${coin.civ.toUpperCase()}, ${coin.civ_specific}`
    : coin.civ.toUpperCase()

  // Build physical characteristics string
  const physicalCharacteristics = formatPhysicalCharacteristics(
    { diameter: coin.diameter, mass: coin.mass, dieAxis: coin.die_axis },
    { style: "compact" },
  )

  const footerText = [
    civText,
    coin.mint?.name,
    formatYearRange(coin.mint_year_earliest, coin.mint_year_latest),
  ]
    .filter(Boolean)
    .join(" ")

  // Look up artifact for flavour image
  const artifactId = coin.flavour_img?.[0]
  const artifact =
    artifactId && artifacts ? artifacts.find((a) => a.id === artifactId) : null

  return {
    title: coin.reference ?? "Unknown Reference",
    subtitle: physicalCharacteristics ?? undefined,
    primaryInfo: coin.flavour_tag ?? undefined,
    secondaryInfo: coin.flavour_body ?? undefined,
    footer: footerText || undefined,
    image: artifact?.img_src ?? undefined,
    altText: artifact?.img_alt ?? undefined,
  }
}

export function DeepDiveCardsSection({ coin }: DeepDiveCardsSectionProps) {
  const { data: artifacts } = useArtifacts()

  const matchingDeities = transformDeitiesToCards(coin.deities, artifacts)
  const matchingHistoricalFigures = transformHistoricalFiguresToCards(
    coin.historical_figures,
    artifacts,
  )
  // Helper to create a DeepDive card
  const createCard = (
    id: string,
    props: React.ComponentProps<typeof DeepDiveCard>,
  ) => ({
    id,
    component: <DeepDiveCard defaultOpen={false} {...props} />,
  })

  const mint = coin.mint

  const cardsToRender = [
    // This Coin Card (always shown)
    createCard("coin", createCoinFlip(coin, artifacts)),

    // Deity cards
    ...matchingDeities
      .filter((deity) => deity.title?.trim())
      .map((deity, index) => createCard(`deity-${index}`, deity)),

    // Historical figure cards
    ...matchingHistoricalFigures
      .filter((figure) => figure.title?.trim())
      .map((figure, index) => createCard(`figure-${index}`, figure)),

    // Mint card (only if mint exists and has content)
    ...(mint?.flavour_text
      ? [{ id: "mint", component: <MintDeepDiveCard mint={mint} /> }]
      : []),
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      {/* A grid, not CSS columns. Each card is three subgrid rows (header,
          toggle, footer), so the cards of a row share those row heights: with
          the accordions closed their tops, chevrons and footers all line up.
          The wrapper is display: contents so the card is the grid item. The
          gap between rows of cards is the cards' bottom margin: a row gap would
          also open up inside every card. */}
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        {cardsToRender.map((card) => (
          <div key={card.id} className="contents">
            {card.component}
          </div>
        ))}
      </div>
    </div>
  )
}
