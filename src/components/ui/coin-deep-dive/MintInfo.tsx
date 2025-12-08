import { useMints } from "~/api/mints"
import { formatRomanDateRange } from "~/lib/utils/date-formatting"
import { DeepDiveCard } from "../DeepDiveCard"

type MintInfoProps = {
  mintName: string
}

export function MintInfo({ mintName }: MintInfoProps) {
  const { data: mints, isLoading, error } = useMints()

  if (isLoading) {
    return null // Don't show loading card, just wait for data
  }

  if (error || !mints) {
    return null
  }

  // Find the mint data that matches the coin's mint
  const mint = mints.find(
    (m) =>
      m.alt_names?.some(
        (name) => name.toLowerCase() === mintName.toLowerCase(),
      ) ?? m.name.toLowerCase() === mintName.toLowerCase(),
  )

  if (!mint?.flavour_text) {
    return null
  }

  // Format operation dates as separate lines, fallback to opened_by if no operation periods
  const subtitle =
    mint.operation_periods && mint.operation_periods.length > 0
      ? mint.operation_periods
          .map(
            ([startYear, endYear, emperor]) =>
              `${formatRomanDateRange(startYear, endYear)} (${emperor})`,
          )
          .join("\n")
      : (mint.opened_by ?? undefined)

  // Join mint marks as comma-separated footer
  const mintMarksFooter =
    mint.mint_marks && mint.mint_marks.length > 0
      ? mint.mint_marks.join(", ")
      : undefined

  return (
    <DeepDiveCard
      title={`${mint.name} Mint`}
      subtitle={subtitle}
      primaryInfo={mint.flavour_text}
      footer={mintMarksFooter}
      defaultOpen={false}
    />
  )
}
