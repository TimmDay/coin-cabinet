import CloudinaryImage from "~/components/CloudinaryImage";

type CoinCardGridItemProps = {
  /** Civilization of the coin */
  civ: string;
  /** Nickname or ruler name */
  nickname?: string;
  /** Denomination type */
  denomination: string;
  /** Earliest mint year */
  mintYearEarliest?: number | null;
  /** Latest mint year */
  mintYearLatest?: number | null;
  /** Obverse image identifier */
  obverseImageId?: string | null;
  /** Reverse image identifier */
  reverseImageId?: string | null;
  /** Which coin side(s) to display */
  view?: "obverse" | "reverse" | "both";
  /** Click handler for opening modal */
  onClick?: () => void;
};

export function CoinCardGridItem({
  civ,
  nickname,
  denomination,
  mintYearEarliest,
  mintYearLatest,
  obverseImageId,
  reverseImageId,
  view = "both",
  onClick,
}: CoinCardGridItemProps) {
  const handleClick = () => {
    onClick?.();
  };

  // Format the mint year range with proper BCE/CE handling
  const formatMintYearRange = () => {
    if (!mintYearEarliest || !mintYearLatest) return "";

    const earliest = mintYearEarliest;
    const latest = mintYearLatest;

    if (earliest > 0 && latest > 0) {
      // Both positive - use CE
      return `(${earliest}—${latest} CE)`;
    } else if (earliest < 0 && latest < 0) {
      // Both negative - use BCE, strip negative signs, keep chronological order
      return `(${Math.abs(earliest)}—${Math.abs(latest)} BCE)`;
    } else if (earliest < 0 && latest > 0) {
      // Crosses BCE/CE boundary
      return `(${Math.abs(earliest)} BCE—${latest} CE)`;
    }

    return "";
  };

  return (
    <div
      className="group w-fit cursor-pointer text-center transition-all duration-300 outline-none"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex justify-center gap-2 transition-transform duration-300 group-focus-within:scale-110 group-hover:scale-110">
        {/* Obverse Image */}
        {(view === "obverse" || view === "both") && (
          <div className="flex-shrink-0">
            <CloudinaryImage src={obverseImageId ?? undefined} />
          </div>
        )}

        {/* Reverse Image */}
        {(view === "reverse" || view === "both") && (
          <div className="flex-shrink-0">
            <CloudinaryImage src={reverseImageId ?? undefined} />
          </div>
        )}
      </div>
      <div className="mt-4 flex w-0 min-w-full flex-col items-center opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
        <p className="text-sm whitespace-nowrap text-slate-300">
          {civ.toUpperCase()}
          {nickname && `. ${nickname}`}
        </p>
        <p className="text-sm whitespace-nowrap text-slate-300">
          {denomination} {formatMintYearRange()}
        </p>
      </div>
    </div>
  );
}
