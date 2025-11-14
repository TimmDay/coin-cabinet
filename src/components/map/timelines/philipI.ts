import { PLACES } from "../constants/places"
import type { Timeline } from "./types"

const proclamationPlace = {
  place: "On the frontier, somewhere near/around/between Circesium / Zaitha",
  lat: 34.81,
  lng: 41.19,
}

const philipTimeline: Timeline = {
  id: "philip-i",
  events: [
    {
      kind: "birth",
      name: "Born",
      year: 204,
      description: `Born in Shahba "around" 204. Later renamed Philippopolis`,
      ...PLACES.shahba,
    },
    {
      kind: "family",
      name: "Married Otacilia",
      year: 236,
      description:
        "Married Otacilia Severa, a daughter of gens Otacilia, an aristocratic family. Her father had several governing appointments. Place and year of marriage are best-guesstimates.",
      ...PLACES.rome,
    },
    {
      kind: "family",
      name: "Philip II is born",
      year: 238,
      description:
        "Son Phillipus II is born to Philip I and Otacilia Severa. A daughter was also born around this time, but her name is unknown. Perhaps in Antioch (best guess, somewhere east while Philip was in a military administrative role)",
      ...PLACES.antioch,
    },
    {
      kind: "political",
      name: "Praetorian Prefect",
      year: 243,
      description:
        "Appointed Praetorian Prefect, commander of the Praetorian Guard, after the death of Timesitheus due to illness.",
      ...proclamationPlace,
    },
    {
      kind: "made-emperor",
      name: "Emperor",
      year: 244,
      description:
        "Proclaimed emperor by his troops. Served as Consul for the first time either immediately before or after.",
      ...proclamationPlace,
    },
    {
      kind: "political",
      name: "Consul II",
      year: 247,
      description: "Served as Consul for the second time.",
    },
    {
      kind: "political",
      name: "Consul III",
      year: 248,
      description:
        "Served as Consul for the third time, with his son as his colleague and co-emperor.",
      ...PLACES.rome,
    },
    {
      kind: "other",
      name: "Millennium Games",
      year: 248,
      description:
        "Hosted Rome's 1000th anniversary Millennium Games, the Ludi Saeculares, with his son.",
      ...PLACES.rome,
    },
    {
      kind: "military",
      name: "Revolt!",
      year: 248,
      description:
        "A revolt broke out on the Danubian Frontier. Philip sent his trusted general Gaius Messius Quintus Decius to squash it.",
      ...PLACES.viminacium,
    },
    // rebuilt Shahba as Philippopolis,
    // notable constructions / ruins / tourist spots built
    // battles, treaties. Shapur
    {
      kind: "death",
      name: "Killed in Battle",
      year: 249,
      description:
        "Dies in battle against Decius, after he had been proclaimed emperor by his troops after suppressing the revolt.",
      ...PLACES.verona,
    },
  ],
}

export default philipTimeline
