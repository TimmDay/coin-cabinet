import { formatRomanDateRange } from "~/lib/utils/date-formatting"
import { ROMAN_MINTS } from "../../map/constants/mints"

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

  return (
    <div className="bg-card border-border mb-6 rounded-lg border p-8">
      <div
        className={`grid grid-cols-1 gap-6 ${mint.mintMarks && mint.mintMarks.length > 0 ? "md:grid-cols-[auto_1fr_auto]" : "md:grid-cols-[auto_1fr]"}`}
      >
        {/* Left column - mint name and dates */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-center text-2xl tracking-widest text-gray-200 uppercase">
            {mint.displayName}
          </h3>

          {mint.operationDates.length > 0 && (
            <div className="mt-2 flex flex-1 flex-col items-center justify-evenly md:items-start">
              {mint.operationDates.map(
                ([startYear, endYear, emperor], index) => (
                  <div
                    key={index}
                    className="mb-1 flex flex-row items-center gap-2 text-sm text-gray-400"
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

        {/* Middle column - flavour text */}
        <div className="flex items-center">
          <p className="text-justify text-sm leading-relaxed text-gray-300">
            {mint.flavourText}
          </p>
        </div>

        {/* Right column - mint marks (only if available) */}
        {mint.mintMarks && mint.mintMarks.length > 0 && (
          <div className="flex flex-col items-center justify-center space-y-1 text-center md:items-end md:text-right">
            <div className="grid grid-cols-1 gap-1 2xl:grid-cols-2 2xl:gap-x-3 2xl:gap-y-1">
              {mint.mintMarks.map((mark, index) => (
                <div
                  key={index}
                  className="text-sm whitespace-nowrap text-gray-400"
                >
                  {mark}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
