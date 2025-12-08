"use client"

import { useMemo } from "react"
import { useAllSomnusCoins } from "../../../api/somnus-collection"
import { BPImage } from "../../../components/ui/BPImage"
import { FeaturedCoins } from "../../../components/ui/FeaturedCoins"

/**
 * FeaturedCoinsWithData - Client-side wrapper that fetches coin data
 * Usage:
 * <FeaturedCoinsWithData />
 * <FeaturedCoinsWithData title="Custom Title" />
 */
type FeaturedCoinsWithDataProps = {
  title?: string
  className?: string
}

export function FeaturedCoinsWithData({ 
  title = "Featured Coins from the Collection",
  className = ""
}: FeaturedCoinsWithDataProps) {
  const { data: allCoins, isLoading } = useAllSomnusCoins()

  // Randomly select 3 coins with images
  const featuredCoins = useMemo(() => {
    if (!allCoins) return []

    // Filter coins that have obverse images
    const coinsWithImages = allCoins.filter(
      (coin) => coin.image_link_o && coin.image_link_o.trim() !== "",
    )

    if (coinsWithImages.length < 3) return []

    // Shuffle array and take first 3 (randomize on each render)
    const shuffled = [...coinsWithImages].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3).map((coin) => ({
      id: coin.id,
      nickname: coin.nickname,
      civ: coin.civ,
      denomination: coin.denomination,
      mintYearEarliest: coin.mint_year_earliest,
      mintYearLatest: coin.mint_year_latest,
      obverseImageId: coin.image_link_o,
      reverseImageId: coin.image_link_r,
      diameter: coin.diameter,
    }))
  }, [allCoins])

  return (
    <FeaturedCoins
      title={title}
      coins={featuredCoins}
      isLoading={isLoading}
      className={`mb-4 ${className}`}
    />
  )
}

type CoinComparisonProps = {
  before: {
    src: string
    alt: string
    caption: string
  }
  after: {
    src: string
    alt: string
    caption: string
  }
  title?: string
  className?: string
}

type ImageGridProps = {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  columns?: 2 | 3 | 4
  className?: string
}

/**
 * CoinComparison - Before/after or side-by-side coin images
 * Usage:
 * <CoinComparison
 *   title="Obverse vs Reverse"
 *   before={{ src: "coin-obverse", alt: "Obverse", caption: "Emperor portrait" }}
 *   after={{ src: "coin-reverse", alt: "Reverse", caption: "Victory goddess" }}
 * />
 */
export function CoinComparison({ before, after, title, className = "" }: CoinComparisonProps) {
  return (
    <div className={`my-8 ${className}`}>
      {title && (
        <h4 className="text-lg font-medium text-slate-300 mb-4 text-center">{title}</h4>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <BPImage
            src={before.src}
            alt={before.alt}
            caption={before.caption}
            layout="center"
          />
        </div>
        <div>
          <BPImage
            src={after.src}
            alt={after.alt}
            caption={after.caption}
            layout="center"
          />
        </div>
      </div>
    </div>
  )
}

/**
 * ImageGrid - Grid layout for multiple related images
 * Usage:
 * <ImageGrid
 *   columns={3}
 *   images={[
 *     { src: "coin1", alt: "Denarius", caption: "Silver denarius" },
 *     { src: "coin2", alt: "Aureus", caption: "Gold aureus" },
 *     { src: "coin3", alt: "Sestertius", caption: "Bronze sestertius" }
 *   ]}
 * />
 */
export function ImageGrid({ images, columns = 3, className = "" }: ImageGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  return (
    <div className={`my-8 ${className}`}>
      <div className={`grid gap-6 ${gridCols[columns]}`}>
        {images.map((image, index) => (
          <div key={index}>
            <BPImage
              src={image.src}
              alt={image.alt}
              caption={image.caption ?? ""}
              layout="center"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * ArticleImage - Enhanced wrapper around BPImage with article-specific styling
 * Usage:
 * <ArticleImage
 *   src="image-id"
 *   alt="Description"
 *   caption="Caption text"
 *   layout="right"
 *   size="large"
 * />
 */
type ArticleImageProps = {
  src: string
  alt: string
  caption: string
  layout?: "left" | "right" | "center"
  size?: "small" | "medium" | "large"
  className?: string
}

export function ArticleImage({ 
  src, 
  alt, 
  caption, 
  layout = "center", 
  size = "medium",
  className = "" 
}: ArticleImageProps) {
  const maxHeights = {
    small: 300,
    medium: 500,
    large: 800
  }

  return (
    <BPImage
      src={src}
      alt={alt}
      caption={caption}
      layout={layout}
      maxHeight={maxHeights[size]}
      className={className}
    />
  )
}