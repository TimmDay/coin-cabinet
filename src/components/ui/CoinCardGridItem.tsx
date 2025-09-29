import CloudinaryImage from "~/components/CloudinaryImage";

type CoinCardGridItemProps = {
  /** Cloudinary image source */
  imageSrc?: string;
  /** Coin title */
  title: string;
  /** Coin description */
  description: string;
  /** Click handler for opening modal */
  onClick?: () => void;
};

export function CoinCardGridItem({
  imageSrc,
  title,
  description,
  onClick,
}: CoinCardGridItemProps) {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <div
      className="group cursor-pointer text-center transition-all duration-300 outline-none"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex justify-center transition-transform duration-300 group-focus-within:scale-110 group-hover:scale-110">
        <CloudinaryImage src={imageSrc} />
      </div>
      <div className="mt-4 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
        <h3 className="coin-title text-lg">{title}</h3>
        <p className="coin-description mt-2 text-sm">{description}</p>
      </div>
    </div>
  );
}
