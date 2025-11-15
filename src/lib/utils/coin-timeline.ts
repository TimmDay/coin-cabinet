import { ROMAN_MINTS } from "~/components/map/constants/mints"
import type { Timeline } from "~/components/map/timelines/types"

type CoinData = {
  denomination: string
  mint?: string | null
  mint_year_earliest?: number | null
  mint_year_latest?: number | null
}

/**
 * Creates a timeline event for the minting of a coin using available coin data
 */
export function createCoinMintingEvent(coin: CoinData) {
  if (!coin.mint_year_earliest) {
    return null
  }

  // Find the matching mint data for coordinates
  const mintData = coin.mint
    ? ROMAN_MINTS.find(
        (m) =>
          m.mintNames.some(
            (name) => name.toLowerCase() === coin.mint!.toLowerCase(),
          ) || m.displayName.toLowerCase() === coin.mint!.toLowerCase(),
      )
    : null

  // Build description
  let description = `This ${coin.denomination} was minted`

  if (coin.mint) {
    description += ` at ${coin.mint}`
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
    place: coin.mint ?? "Unknown mint",
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
): Timeline {
  const coinEvent = createCoinMintingEvent(coin)

  if (!coinEvent) {
    return timeline
  }

  // Create a new timeline with the coin event added and sorted by year
  const eventsWithCoin = [...timeline.events, coinEvent]
  eventsWithCoin.sort((a, b) => a.year - b.year)

  return {
    ...timeline,
    events: eventsWithCoin,
  }
}
