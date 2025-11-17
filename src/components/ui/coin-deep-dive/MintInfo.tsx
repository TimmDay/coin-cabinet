import { formatRomanDateRange } from "~/lib/utils/date-formatting"
import { ROMAN_MINTS } from "../../../data/mints"
import { DeepDiveCard } from "../DeepDiveCard"

type MintInfoProps = {
  mintName: string
}

export function MintInfo({ mintName }: MintInfoProps) {
  // Find the mint data that matches the coin's mint
  const mint = ROMAN_MINTS.find(
    (m) =>
      m.mintNames.some(
        (name) => name.toLowerCase() === mintName.toLowerCase(),
      ) || m.displayName.toLowerCase() === mintName.toLowerCase(),
  )

  if (!mint?.flavourText) {
    return null
  }

  // Format operation dates as separate lines
  const operationDatesSubtitle =
    mint.operationDates.length > 0
      ? mint.operationDates
          .map(
            ([startYear, endYear, emperor]) =>
              `${formatRomanDateRange(startYear, endYear)} (${emperor})`,
          )
          .join("\n")
      : undefined

  // Join mint marks as comma-separated footer
  const mintMarksFooter =
    mint.mintMarks && mint.mintMarks.length > 0
      ? mint.mintMarks.join(", ")
      : undefined

  return (
    <DeepDiveCard
      title={`${mint.displayName} Mint`}
      subtitle={operationDatesSubtitle}
      primaryInfo={mint.flavourText}
      footer={mintMarksFooter}
      defaultOpen={false}
    />
  )
}
