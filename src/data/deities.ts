import type { DeepDiveCardProps } from "~/components/ui/DeepDiveCard"

type DeityData = Omit<DeepDiveCardProps, "className" | "defaultOpen">
export const DEITIES: Record<string, DeityData> = {
  concordia: {
    title: "Concordia",
    subtitle: "goddess of harmony and unity",
    primaryInfo:
      'Her name literally means "harmony" or "agreement" (from concordia, "with one heart"). She symbolized social order, political stability, and marital concord. She was the personified of an ideal, as opposed to a mythological figure.',
    secondaryInfo:
      "Often seen seated, wearing a long robe (stola). Holding a cornucopia (abundance) and a patera (libation dish), or sometimes two clasped hands or a caduceus (symbol of peace).",
    footer: "seated, stola, cornucopia, patera, caduceus",
    // sources: [
    //   {
    //     quote: "",
    //     source: "",
    //   },
    // ],
  },
  //TODO:
  victoria: {
    title: "Victoria",
    subtitle: "goddess of victory",
    primaryInfo: "Victoria was the Roman personification of victory.",
    secondaryInfo: "",
    footer: "",
  },
  //TODO:
  mars: {
    title: "Mars",
    subtitle: "god of war and agriculture",
    primaryInfo:
      "Mars was one of the most important Roman deities, second only to Jupiter. Originally an agricultural deity, he became primarily associated with war. He was the father of Romulus and Remus. The field of Mavors",
    secondaryInfo: "",
    footer: "",
  },
}

export type DeityId = keyof typeof DEITIES
