import CloudinaryImage from "~/components/CloudinaryImage";

interface CoinCardProps {
  /** Cloudinary image source */
  imageSrc?: string;
  /** Coin title */
  title: string;
  /** Coin description */
  description: string;
}

export function CoinCard({ imageSrc, title, description }: CoinCardProps) {
  return (
    <div
      className="group text-center transition-all duration-300 outline-none"
      tabIndex={0}
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
