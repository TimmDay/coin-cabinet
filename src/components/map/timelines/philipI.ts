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
        "Proclaimed emperor by his troops after the death of Gordian III. Served as Consul for the first time either immediately before or after.",
      ...proclamationPlace,
    },
    {
      kind: "military",
      name: "Peace terms",
      year: 244,
      description:
        "Paid a large sum of money to Shapur I to end hostilities... suggesting that the Sassanid rock reliefs and inscriptions depicting Gordian III's death by battle wounds may well have validity, and perhaps Philip was not actually a murderous plotter?",
      ...proclamationPlace,
    },

    //https://www.cais-soas.com/CAIS/History/Sasanian/shapour_I.htm
    {
      kind: "political",
      name: "Consul II",
      year: 247,
      description: "Served as Consul for the second time.",
      ...PLACES.rome,
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
    // rebuilt Shahba as Philippopolis, 245/46?
    // notable constructions / ruins / tourist spots built
    {
      kind: "death",
      name: "Killed in Battle",
      year: 249,
      description:
        "Dies in battle against his own general Decius, after Decius had been proclaimed emperor by his troops after suppressing the revolt.",
      ...PLACES.verona,
    },
  ],
}

export default philipTimeline
