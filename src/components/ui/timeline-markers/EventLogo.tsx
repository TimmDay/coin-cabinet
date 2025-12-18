import NextImage from "next/image"
import type { Event as TimelineEvent } from "../../../data/timelines/types"

type EventLogoProps = {
  event: TimelineEvent
  size?: number
  top?: number
  left?: number
}

export function EventLogo({ event, size = 32, top, left }: EventLogoProps) {
  const getIconConfig = (
    eventKind: string,
  ): {
    src: string
    width: number
    height: number
    top?: number
    left?: number
  } | null => {
    switch (eventKind) {
      case "made-emperor":
        return {
          src: "/assets/icon-laurel.png",
          width: 44,
          height: 44,
          top: 2,
        }
      case "political":
        return { src: "/assets/icon-scroll.png", width: 28, height: 28 }
      case "birth":
        return {
          src: "/assets/icon-baby.png",
          width: size,
          height: size,
        }
      case "death":
        return { src: "/assets/icon-skull.png", width: size, height: size }
      case "military":
        return {
          src: "/assets/icon-sword.png",
          width: size,
          height: size,
        }
      case "revolt":
      case "unrest":
        return { src: "/assets/icon-fist.png", width: size, height: size }
      default:
        return null
    }
  }

  const iconConfig = getIconConfig(event.kind)

  if (!iconConfig) {
    return null
  }

  const positioningStyles = {
    ...(iconConfig.top !== undefined && { top: `${iconConfig.top}px` }),
    ...(iconConfig.left !== undefined && { left: `${iconConfig.left}px` }),
    ...(top !== undefined && { top: `${top}px` }),
    ...(left !== undefined && { left: `${left}px` }),
  }

  const hasPositioning =
    top !== undefined ||
    left !== undefined ||
    iconConfig.top !== undefined ||
    iconConfig.left !== undefined
  const positionClass = hasPositioning ? "absolute" : ""

  return (
    <NextImage
      src={iconConfig.src}
      alt=""
      width={iconConfig.width}
      height={iconConfig.height}
      className={`invert ${positionClass}`}
      style={positioningStyles}
    />
  )
}
