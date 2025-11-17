type DeepDiveCardProps = {
  title: string
  subtitle?: string
  primaryInfo?: string
  secondaryInfo?: string
  footer?: string
  className?: string
  defaultOpen?: boolean
}

type DeityData = Omit<DeepDiveCardProps, "className" | "defaultOpen">

export const DEITIES = {
  concordia: {
    title: "Concordia",
    subtitle: "goddess of harmony and unity",
    primaryInfo:
      'Her name literally means "harmony" or "agreement" (from concordia, "with one heart"). She symbolized social order, political stability, and marital concord. She was the personified of an ideal, as opposed to a mythological figure.',
    secondaryInfo:
      "Often seen seated, wearing a long robe (stola). Holding a cornucopia (abundance) and a patera (libation dish), or sometimes two clasped hands or a caduceus (symbol of peace).",
    footer: "seated, stola, cornucopia, patera, caduceus",
  } satisfies DeityData,
  victoria: {
    title: "Victoria",
    subtitle: "goddess of victory",
    primaryInfo:
      "Victoria was the Roman personification of victory, both in military and civilian contexts. She was equivalent to the Greek goddess Nike. Often depicted crowning victorious generals or emperors, she represented triumph over enemies and success in endeavors.",
    secondaryInfo:
      "Usually shown with wings, holding a laurel wreath or palm branch. Sometimes depicted writing on a shield or standing on a globe. Often accompanies eagles or other symbols of Roman power.",
    footer: "winged, laurel wreath, palm branch, shield, globe",
  } satisfies DeityData,
  mars: {
    title: "Mars",
    subtitle: "god of war and agriculture",
    primaryInfo:
      "Mars was one of the most important Roman deities, second only to Jupiter. Originally an agricultural deity, he became primarily associated with war. He was the father of Romulus and Remus, making him a key figure in Roman foundation mythology.",
    secondaryInfo:
      "Typically depicted as a bearded warrior in armor, carrying a spear and shield. Sometimes shown with a helmet. Agricultural associations include depictions with farming tools or in pastoral settings.",
    footer: "armored warrior, spear, shield, helmet, agricultural tools",
  } satisfies DeityData,
} as const

export type DeityId = keyof typeof DEITIES
