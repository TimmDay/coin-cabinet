type SearchableCoin = {
  nickname?: string | null
  denomination?: string | null
  legend_o?: string | null
  legend_r?: string | null
}

/**
 * True if the search text appears (ignoring case) in any of the coin's
 * nickname, denomination, obverse legend, reverse legend or deity names.
 * This is why the grid has no denomination dropdown: typing "denarius" works.
 * An empty query matches every coin.
 */
export function coinMatchesSearch(
  coin: SearchableCoin,
  deityNames: string,
  query: string,
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  return [
    coin.nickname ?? "",
    coin.denomination ?? "",
    coin.legend_o ?? "",
    coin.legend_r ?? "",
    deityNames,
  ].some((field) => field.toLowerCase().includes(q))
}
