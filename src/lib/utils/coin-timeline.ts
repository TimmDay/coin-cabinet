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

  // Find the correct insertion point for the coin-minted event
  const eventsWithCoin = [...timeline]

  let insertIndex = eventsWithCoin.length // Default to end
  let lastMadeEmperorIndex = -1
  let firstEventInYearIndex = -1

  // Find the position of events in the same year
  for (let i = 0; i < eventsWithCoin.length; i++) {
    const event = eventsWithCoin[i]!

    if (event.year > coinEvent.year) {
      // We've moved past the coin's year
      break
    }

    if (event.year === coinEvent.year) {
      // Track the first event in this year
      if (firstEventInYearIndex === -1) {
        firstEventInYearIndex = i
      }

      // Track the last made-emperor event in this year
      if (event.kind === "made-emperor") {
        lastMadeEmperorIndex = i
      }
    }
  }

  // Determine insert position
  if (lastMadeEmperorIndex !== -1) {
    // Found made-emperor in this year, insert right after the last one
    insertIndex = lastMadeEmperorIndex + 1
  } else if (firstEventInYearIndex !== -1) {
    // No made-emperor, but found events in this year, insert before them
    insertIndex = firstEventInYearIndex
  }
  // else insertIndex stays at end (coin's year not found in timeline)

  eventsWithCoin.splice(insertIndex, 0, coinEvent)
  return eventsWithCoin
}
