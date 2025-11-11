import { formatRomanDateRange } from "~/lib/utils/date-formatting"
import { ROMAN_MINTS } from "../map/constants/mints"

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

  if (!mint) {
    return null
  }

  return (
    <div className="bg-card border-border mb-6 rounded-lg border p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left column - 33% width on desktop */}
        <div className="flex flex-col">
          <div className="mb-3 text-center">
            <h3 className="text-accent-foreground text-lg font-bold">
              Mint: {mint.displayName}
            </h3>
          </div>

          {mint.operationDates.length > 0 && (
            <div className="flex flex-1 flex-col items-center justify-center">
              {mint.operationDates.map(
                ([startYear, endYear, emperor], index) => (
                  <div
                    key={index}
                    className="text-muted-foreground mb-1 flex flex-row items-center gap-2 text-sm"
                  >
                    <div className="font-medium whitespace-nowrap">
                      {formatRomanDateRange(startYear, endYear)}
                    </div>
                    <div className="text-xs italic"> {emperor}</div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {/* Right column - 67% width on desktop */}
        <div className="md:col-span-2">
          {mint.flavourText && (
            <div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {mint.flavourText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
