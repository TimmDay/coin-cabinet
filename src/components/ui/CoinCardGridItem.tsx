import CloudinaryImage from "~/components/CloudinaryImage";
import { formatYearRange } from "~/lib/utils/date-formatting";

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
  /** Coin diameter in millimeters */
  diameter?: number | null;
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
  diameter,
  view = "both",
  onClick,
}: CoinCardGridItemProps) {
  const handleClick = () => {
    onClick?.();
  };

  // Calculate proportional image size based on diameter for single-side views
  function calculateImageSize() {
    if (view === "both") {
      return 200; // Fixed size for dual-image view
    }

    const baseSize = 250; // pixels.
    const baseDiameter = 28; // mm. Largest is actually 32mm but tweaking the limit for space.

    if (!diameter || diameter <= 0 || diameter > baseDiameter) {
      return baseSize;
    }

    // Proportional scaling: (actual diameter / base diameter) * base size
    return Math.round((diameter / baseDiameter) * baseSize);
  }

  const imageSize = calculateImageSize();

  // Keep consistent container sizes but calculate dynamic text positioning
  function getContainerClasses() {
    if (view === "both") {
      return "h-[200px] w-[200px]";
    }
    return "h-[270px] w-[270px]";
  }

  // Calculate negative margin to pull text closer for smaller images
  function getTextMarginClass() {
    if (view === "both") {
      return "mt-4";
    }

    const maxImageSize = 250;
    const sizeDifference = maxImageSize - imageSize;
    const marginReduction = Math.floor(sizeDifference / 2);

    if (marginReduction >= 40) return "-mt-10"; // Very small coins - pull up more
    if (marginReduction >= 30) return "-mt-6"; // Small coins - pull up significantly
    if (marginReduction >= 20) return "-mt-4"; // Medium-small coins - pull up moderately
    if (marginReduction >= 10) return "-mt-2"; // Medium coins - pull up slightly
    return "mt-2"; // Large coins - reduce from mt-4 to mt-2
  }

  const containerClasses = getContainerClasses();
  const textMarginClass = getTextMarginClass();

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
          <div
            className={`flex flex-shrink-0 items-center justify-center ${containerClasses}`}
          >
            <CloudinaryImage
              src={obverseImageId ?? undefined}
              width={imageSize}
              height={imageSize}
            />
          </div>
        )}

        {/* Reverse Image */}
        {(view === "reverse" || view === "both") && (
          <div
            className={`flex flex-shrink-0 items-center justify-center ${containerClasses}`}
          >
            <CloudinaryImage
              src={reverseImageId ?? undefined}
              width={imageSize}
              height={imageSize}
            />
          </div>
        )}
      </div>
      <div
        className={`${textMarginClass} flex w-0 min-w-full flex-col items-center opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100`}
      >
        <p className="text-sm whitespace-nowrap text-slate-300">
          {civ.toUpperCase()}
          {nickname && `. ${nickname}`}
        </p>
        <p className="text-sm whitespace-nowrap text-slate-300">
          {denomination} {formatYearRange(mintYearEarliest, mintYearLatest)}
        </p>
      </div>
    </div>
  );
}
