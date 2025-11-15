import { PLACES } from "../constants/places"
import type { Timeline } from "./types"

const aquiliaSeveraTimeline: Timeline = {
  id: "aquilia-severa",
  events: [
    {
      kind: "birth",
      name: "Born",
      year: 200,
      description: `Julia Aquilia Severa is born, likely in the early 200s, probably in Rome, but there are no records.`,
      source: "",
      ...PLACES.rome,
    },
    {
      kind: "political",
      name: "A Vestal Virgin",
      year: 219,
      description:
        "At some point before this year she becomes a Vestal Virgin. A sacred position, the chastity of which is believed to be connected to the divine protection of Rome.",
      source: "",
      ...PLACES.rome,
    },
    {
      kind: "made-emperor",
      name: "Marriage",
      year: 220,
      description:
        "Becomes an Augusta with her controversial marriage to Elagabalus (his second wife). As a high priest of Elagabal, Elagabalus may have been trying to unite his religion with Vesta to promote it in Rome.",
      source: "",
      ...PLACES.rome,
    },
    {
      kind: "political",
      name: "Divorce",
      year: 221,
      description:
        "After massive public outcry due to a marriage to a chaste religious figure, Elagabalus divorces Aquilia and marries Annia Faustina (third wife) for political legitimacy for his family (Julia Maesa might have had something to say about this).",
      source: "",
      ...PLACES.rome,
    },
    {
      kind: "political",
      name: "Remarried",
      year: 221,
      description:
        "Elagabalus asserts his will by re-marrying Aquilia Severa (4th wife) shortly after divorcing her. Roman society is again shocked.",
      source: "",
      ...PLACES.rome,
    },
    {
      kind: "political",
      name: "Elagabalus Assassinated",
      year: 222,
      description:
        "Elagabalus and his mother Julia Soaemias are assassinated by the Praetorians... quite likely with the encouragement of his grandmother Julia Maesa.",
      source: "",
      ...PLACES.praetorianCamp,
    },

    // Aquilia's fate after this event is unknown.
    {
      kind: "other",
      name: "Unknown",
      year: 222,
      description: "Julia Aquilia Severa is lost to the historical record.",
      source: "",
      ...PLACES.rome,
    },
  ],
}

export default aquiliaSeveraTimeline
