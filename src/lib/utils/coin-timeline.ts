import type { Timeline } from "~/data/timelines/types"
import type { Mint } from "~/database/schema-mints"

type CoinData = {
  denomination: string
  mint_id?: number | null
  mint_year_earliest?: number | null
  mint_year_latest?: number | null
}

/**
 * Creates a timeline event for the minting of a coin using available coin data
 */
export function createCoinMintingEvent(coin: CoinData, mints?: Mint[]) {
  if (!coin.mint_year_earliest) {
    return null
  }

  // Find the matching mint data by ID
  const mintData =
    coin.mint_id && mints ? mints.find((m) => m.id === coin.mint_id) : undefined

  // Build description
  let description = `This ${coin.denomination} was minted`

  if (mintData) {
    description += ` at ${mintData.name}`
  }

  // Handle date range logic
  if (coin.mint_year_earliest && coin.mint_year_latest) {
    if (coin.mint_year_earliest === coin.mint_year_latest) {
      // Same year - show just the year
      description += ` in ${coin.mint_year_earliest}`
    } else {
      // Different years - show range
      description += ` approximately ${coin.mint_year_earliest} to ${coin.mint_year_latest}`
    }
  } else if (coin.mint_year_earliest) {
    description += ` around ${coin.mint_year_earliest}`
  }

  return {
    kind: "coin-minted" as const,
    name: "Coin Minted",
    year: coin.mint_year_earliest,
    description,
    source: "",
    place: mintData?.name ?? "Unknown mint",
    lat: mintData?.lat,
    lng: mintData?.lng,
  }
}

/**
 * Adds a coin minting event to an existing timeline, sorted by year
 */
export function addCoinMintingEventToTimeline(
  timeline: Timeline,
  coin: CoinData,
  mints?: Mint[],
): Timeline {
  const coinEvent = createCoinMintingEvent(coin, mints)

  if (!coinEvent) {
    return timeline
  }

  // Create a new timeline with the coin event added and sorted by year
  const eventsWithCoin = [...timeline, coinEvent]
  eventsWithCoin.sort((a, b) => {
    // First sort by year
    if (a.year !== b.year) {
      return a.year - b.year
    }

    // For events in the same year, prioritize coin-minted events first
    if (a.kind === "coin-minted" && b.kind !== "coin-minted") {
      return -1 // a (coin-minted) comes before b
    }
    if (a.kind !== "coin-minted" && b.kind === "coin-minted") {
      return 1 // b (coin-minted) comes before a
    }

    // If both are coin-minted or both are not coin-minted, maintain original order
    return 0
  })

  return eventsWithCoin
}
