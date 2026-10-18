import type { Mint } from "~/database/schema-mints"
import { formatOpenYearRange } from "~/lib/utils/years"
import { DeepDiveCard } from "../DeepDiveCard"

type MintDeepDiveCardProps = {
  mint: Mint
}

export function MintDeepDiveCard({ mint }: MintDeepDiveCardProps) {
  if (!mint.flavour_text) {
    return null
  }

  // Format operation dates as separate lines, fallback to opened_by if no operation periods
  const subtitle =
    mint.operation_periods && mint.operation_periods.length > 0
      ? mint.operation_periods
          .map(([startYear, endYear, emperor]) => {
            const years = formatOpenYearRange(startYear, endYear)
            return years && emperor ? `${years} (${emperor})` : years || emperor
          })
          .join("\n")
      : (mint.opened_by ?? undefined)

  // Join mint marks as comma-separated footer
  const mintMarksFooter =
    mint.mint_marks && mint.mint_marks.length > 0
      ? mint.mint_marks.join(", ")
      : undefined

  const images = mint.image_url
    ? [
        {
          src: mint.image_url,
          alt: mint.image_alt_text ?? mint.name,
          name: mint.name,
          credit: mint.image_credit ?? undefined,
        },
      ]
    : undefined

  return (
    <DeepDiveCard
      title={mint.name}
      subtitle={subtitle}
      primaryInfo={mint.flavour_text}
      images={images}
      footer={mintMarksFooter}
      citations={mint.citations}
      defaultOpen={false}
    />
  )
}
