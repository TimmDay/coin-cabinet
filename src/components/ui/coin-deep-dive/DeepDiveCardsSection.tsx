import { useArtifacts } from "~/api/artifacts"
import { useMints } from "~/api/mints"
import { MintDeepDiveCard } from "~/components/ui"
import { formatYearRange } from "~/lib/utils/date-formatting"
import { formatPhysicalCharacteristics } from "~/lib/utils/physical-formatting"
import type { CoinEnhanced } from "~/types/api"
import { DeepDiveCard } from "../DeepDiveCard"

type DeepDiveCardsSectionProps = {
  coinData: CoinEnhanced
  deities: CoinEnhanced["deities"]
  historicalFigures: CoinEnhanced["historical_figures"]
}

function transformDeitiesToCards(
  deities: CoinEnhanced["deities"],
  artifacts: ReturnType<typeof useArtifacts>["data"],
) {
  return (
    deities?.map((deity) => {
      // Look up first artifact for image
      const artifactId = deity.artifact_ids?.[0]
      const artifact =
        artifactId && artifacts
          ? artifacts.find((a) => a.id === artifactId)
          : null

      return {
        title: deity.name,
        subtitle: deity.subtitle ?? "",
        primaryInfo: deity.flavour_text ?? "",
        footer: deity.features_coinage?.map((f) => f.name).join(", ") ?? "",
        image: artifact?.img_src ?? undefined,
        altText: artifact?.img_alt ?? deity.name ?? undefined,
        caption: artifact?.flavour_text ?? undefined,
      }
    }) ?? []
  )
}

function transformHistoricalFiguresToCards(
  figures: CoinEnhanced["historical_figures"],
  artifacts: ReturnType<typeof useArtifacts>["data"],
) {
  return (
    figures?.map((figure: unknown) => {
      const figureAny = figure as Record<string, unknown>

      // Look up first artifact for image
      const artifactIds = Array.isArray(figureAny.artifact_ids)
        ? (figureAny.artifact_ids as string[])
        : null
      const artifactId = artifactIds?.[0]
      const artifact =
        artifactId && artifacts
          ? artifacts.find((a) => a.id === artifactId)
          : null

      // Extract and validate numeric fields
      const birth = typeof figureAny.birth === "number" ? figureAny.birth : null
      const death = typeof figureAny.death === "number" ? figureAny.death : null
      const reignStart =
        typeof figureAny.reign_start === "number" ? figureAny.reign_start : null
      const reignEnd =
        typeof figureAny.reign_end === "number" ? figureAny.reign_end : null

      // Format year ranges
      const livedYears = formatYearRange(birth, death)
      const reignYears = formatYearRange(reignStart, reignEnd)

      // Build subtitle components
      const authorityText =
        (typeof figureAny.authority === "string" ? figureAny.authority : "") ??
        ""
      const lifeInfo = livedYears
        ? `lived ${livedYears.replace(/[()]/g, "")}`
        : ""
      const reignInfo = reignYears
        ? `reigned ${reignYears.replace(/[()]/g, "")}`
        : ""
      const subtitle = [authorityText, lifeInfo, reignInfo]
        .filter(Boolean)
        .join(", ")

      // Build footer from altNames or full_name
      const altNames = Array.isArray(figureAny.altNames)
        ? figureAny.altNames
        : []
      const fullName =
        typeof figureAny.full_name === "string" ? figureAny.full_name : ""
      const footerText = altNames.length > 0 ? altNames.join(", ") : fullName

      return {
        title: typeof figureAny.name === "string" ? figureAny.name : "",
        subtitle,
        primaryInfo:
          (typeof figureAny.flavour_text === "string"
            ? figureAny.flavour_text
            : "") ?? "",
        secondaryInfo: undefined,
        footer: footerText,
        image: artifact?.img_src ?? undefined,
        altText:
          artifact?.img_alt ??
          (typeof figureAny.name === "string" ? figureAny.name : ""),
        caption: artifact?.flavour_text ?? undefined,
      }
    }) ?? []
  )
}

function createCoinFlip(
  coin: CoinEnhanced,
  mints: ReturnType<typeof useMints>["data"],
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

  // Get mint name from mint_id
  const mint =
    coin.mint_id && mints ? mints.find((m) => m.id === coin.mint_id) : null
  const mintName = mint?.name

  const mintYearRange = formatYearRange(
    coin.mint_year_earliest,
    coin.mint_year_latest,
  )
  const mintYearRangeClean = mintYearRange.replace(/[()]/g, "")
  const mintInfo = [civText, mintName, mintYearRangeClean]
    .filter(Boolean)
    .join(" ")

  // Look up artifact for flavour image
  const artifactId = coin.flavour_img?.[0]
  const artifact =
    artifactId && artifacts ? artifacts.find((a) => a.id === artifactId) : null

  return {
    title: coin.reference ?? "Unknown Reference",
    subtitle: physicalCharacteristics ?? undefined,
    primaryInfo: [coin.provenance].filter(Boolean).join(" • ") || undefined,
    secondaryInfo: coin.flavour_desc ?? undefined,
    footer: mintInfo || undefined,
    image: artifact?.img_src ?? undefined,
    altText: artifact?.img_alt ?? undefined,
  }
}

export function DeepDiveCardsSection({
  coinData,
  deities,
  historicalFigures,
}: DeepDiveCardsSectionProps) {
  const { data: mints } = useMints()
  const { data: artifacts } = useArtifacts()

  // Helper function to get mint by ID
  const getMintById = (mintId: number | null | undefined) => {
    if (!mints || !mintId) return null
    return mints.find((m) => m.id === mintId) || null
  }

  // Transform data to cards format
  const matchingDeities = transformDeitiesToCards(deities, artifacts)
  const matchingHistoricalFigures = transformHistoricalFiguresToCards(
    historicalFigures,
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

  // Helper to create a mint card
  const createMintCard = (mintId: number) => {
    return {
      id: "mint",
      component: <MintDeepDiveCard mintId={mintId} />,
    }
  }

  // Build cards array with only cards that have content
  const mintId = coinData.mint_id
  const mint = getMintById(mintId)

  const cardsToRender = [
    // This Coin Card (always shown)
    createCard("coin", createCoinFlip(coinData, mints, artifacts)),

    // Deity cards
    ...matchingDeities
      .filter((deity) => deity.title?.trim())
      .map((deity, index) => createCard(`deity-${index}`, deity)),

    // Historical figure cards
    ...matchingHistoricalFigures
      .filter((figure) => figure.title?.trim())
      .map((figure, index) => createCard(`figure-${index}`, figure)),

    // Mint card (only if mint exists and has content)
    ...(mint?.flavour_text ? [createMintCard(mintId!)] : []),
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
        {cardsToRender.map((card) => (
          <div
            key={card.id}
            className="w-full md:w-[calc(50%-0.5rem)] md:flex-shrink-0"
          >
            {card.component}
          </div>
        ))}
      </div>
    </div>
  )
}
