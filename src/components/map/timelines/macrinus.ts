import { PLACES } from "../constants/places"
import type { Timeline } from "./types"

// Macrinus was the first Roman emperor from the equestrian class, not the senatorial elite.

// He never visited Rome during his reign as emperor; he ruled from the East (Syria/Antioch region).

//His tenure was short — only about 14 months (April 217 to June 218).

// Key issues in his reign: fiscal reforms (trying to undo his predecessor’s heavy spending), peace with Parthia (but at cost/diplomatic disadvantage), and increasing military discontent.

// His overthrow shows the power of the military and the role of dynastic legitimacy: the armies preferred Elagabalus (via Julia Maesa’s influence) and turned on Macrinus.

// After his death, the Roman Senate declared Macrinus and his son enemies (damnatio memoriae) — their names erased, images destroyed.

// TODO: check all the sources

const macrinusTimeline: Timeline = {
  id: "macrinus",
  events: [
    {
      kind: "birth",
      name: "Born",
      year: 164,
      description: `Born in Caesarea Mauretaniae (modern Cherchell, Algeria)`,
      source: "Historia Augusta, Macr. 1;",
      ...PLACES.caesareaMauretania,
    },
    {
      kind: "political",
      name: "Legal Career",
      year: 190,
      description:
        "Begins a two decade legal and administrative career trajectory in Rome, serving in roles such as an equestrian procurator, lawyer and assessor.",
      source: "Cassius Dio 78.12",
      ...PLACES.rome,
    },
    {
      kind: "political",
      name: "Praetorian Prefect",
      year: 212,
      description:
        "Appointed Praetorian Prefect under Emperor Caracalla. One responsibility was occasionally sorting the Emperor's mail.",
      source: "Cassius Dio 78.11–13",
      ...PLACES.rome,
    },
    {
      kind: "political",
      name: "Caracalla Assassinated",
      year: 217,
      description:
        "Caracalla assassinated while taking a piss on the side of the road. ",
      source: "Cassius Dio 78.5–6; Herodian 4.12;",
      ...PLACES.caracallaAssassinationSite,
    },
    {
      kind: "made-emperor",
      name: "Emperor",
      year: 217,
      description:
        "Proclaimed emperor by the army, three days after Caracalla's death..",
      source: "Cassius Dio 78.7; Herodian 5.1;",
      ...PLACES.caracallaAssassinationSite,
    },
    {
      kind: "military",
      name: "Battle of Nisibis",
      year: 217,
      description:
        "Artabanus IV of Parthia defeats the Romans. Macrinus negotiates peace at the price of a heavy indemnity",
      source: "",
      ...PLACES.nisibis,
    },
    {
      kind: "political",
      name: "Elevates son to Caesar",
      year: 217,
      description:
        "Elevates his son Diadumenian Caesar, while ruling from Antioch.",
      source: "Herodian 5.2; Dio 78.15",
      ...PLACES.antioch,
    },

    {
      kind: "military",
      name: "Revolt and Battle",
      year: 218,
      description:
        "in May Julia Maesa (the sister to the mother of Caracalla), via her daughter Julia Soaemias and grandson Elagabalus, initiate a revolt by falsely proclaiming Elagabalus as the son of Caracalla and spreading money around so nobody asks questions. In June, Macrinus is defeated at the Battle of Antioch.",
      source: "",
      ...PLACES.antioch,
    },
    {
      kind: "made-emperor",
      name: "Diadumenian elevated,",
      year: 218,
      description:
        "Macrinus elevates his son Diadumenian to Augustus during the retreat - perhaps to try and secure the loyalty of the troops transporting him.",
      source: "",
      ...PLACES.antioch,
    },
    {
      kind: "death",
      name: "Captured and Executed",
      year: 218,
      description:
        "Ran after his defeat but was captured and killed. His son is captured elsewhere, en route to Parthia, and is killed.",
      source: "",
      ...PLACES.chalcedon,
    },
  ],
}

export default macrinusTimeline
