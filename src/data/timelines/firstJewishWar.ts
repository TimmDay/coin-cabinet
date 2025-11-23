import { PLACES } from "../places"
import type { Timeline } from "./types"

const firstjewishWarTimeline: Timeline = [
  {
    kind: "unrest",
    name: "Unrest flares",
    year: 66,
    description:
      "A local Greek sacrifices a bird at the entrance to the Synagogue, sparking riots. Religious, socioeconomic and ethnic tensions had been steadily rising under the Roman governorship of Judea - this was a spark.",
    source: "",
    ...PLACES.caesareaMaritima,
  },

  {
    kind: "unrest",
    name: "Unrest erupts",
    year: 66,
    description:
      "Roman governor Gessius Florus loots the Temple treasury and kills residents. In response, a rebel uprising kills the Roman garrison and officials flee.",
    source: "",
    ...PLACES.jerusalem,
  },
  {
    kind: "military",
    name: "Battle of Beth-Horon",
    year: 66,
    description:
      "The Roman governor of Syria, Cestius Gallus, invades Judea with Legio XII Fulminata. They are ambushed in the narrow passes of Beth-Horon by Jewish rebels (led by Simon Bar Giora, Eleazar ben Simon) and are comprehensively defeated. More than 6000 Roman soldiers are killed.",
    source: "",
    ...PLACES["Beth-Horon"],
  },
  {
    kind: "political",
    name: "Rebel Government",
    year: 66,
    description:
      "A provisional rebel government in Jerusalem established under High Priest Ananus ben Ananus. Year 1 revolt coins are minted",
    source: "",
    ...PLACES.jerusalem,
  },
  {
    kind: "military",
    name: "Rome responds",
    year: 67,
    description:
      "Emperor Nero dispatches Vespasian (with Titus) with three legions (V, X, XV) to suppress the revolt.",
    source: "",
    ...PLACES.rome,
  },
  {
    kind: "military",
    name: "Campaign in Galilee",
    year: 67,
    description:
      "Vespasian campaigns in Galilee. Key fortresses including Sepphoris and Tiberias submit, and siege tactics are used to capture Gamla and Jotapata (where the historian Josephus is captured). ",
    source: "",
    ...PLACES.jotapata,
  },
  {
    kind: "political",
    name: "Rebel infighting",
    year: 67,
    description:
      "Rebels and refugees flee to Jerusalem, where factional infighting is becoming a problem. Relations break down and lead to fighting between the forces of the rebel leaders Eleazar ben Simon, John of Gischala and Simon bar Giora, weakening their supplies and defences.",
    source: "",
    ...PLACES.jerusalem,
  },
  {
    kind: "military",
    name: "Nero dead",
    year: 68,
    description:
      "The emperor Nero commits suicide. Vespasian halts the campaign and starts making political moves.",
    source: "",
    ...PLACES.rome,
  },
  {
    kind: "political",
    name: "Vespasian emperor",
    year: 69,
    description:
      "Vespasian is declared emperor by the Eastern legions. He departs to fight for the throne in the year of the 4 emperors, first securing the grain supply in Egypt. He leaves Titus in command in Judea.",
    source: "",
    ...PLACES.alexandria,
  },
  {
    kind: "military",
    name: "Siege of Jerusalem",
    year: 70,
    description:
      "The Jewish rebel infighting is resolved and the factions re-unite. The siege of Jerusalem is lead by Titus. After months of fighting the city is breached and razed. The population flees, is killed or is enslaved.",
    source: "",
    ...PLACES.jerusalem,
  },
  {
    kind: "military",
    name: "Temple Destroyed",
    year: 70,
    description:
      "The Temple Mount is captured and the Second Temple is destroyed (an event still mourned today on the fast day of Tisha B'Av).",
    source: "",
    ...PLACES.jerusalem,
  },
  {
    kind: "political",
    name: "Triumph in Rome",
    year: 71,
    description:
      "Vespasian and Titus celebrate a triumph in Rome. Sacred artifacts from the Temple are paraded through the city. Images of this event can be seen on the Arch of Titus in Rome today.",
    source: "",
    ...PLACES.rome,
  },
  {
    kind: "other",
    name: "Jewish Tax",
    year: 71,
    description: "The punitive Fiscus Judaicus (Jewish tax) is established.",
    source: "",
    ...PLACES.jerusalem,
  },
  {
    kind: "military",
    name: "Scattered resistance",
    year: 72,
    description:
      "Jewish forces are scattered but do not give up. Resistance continues in fortresses such as Herodium, Machaerus and Masada.",
    source: "",
    ...PLACES.masada,
  },
  {
    kind: "military",
    name: "Fall of Masada",
    year: 73,
    description:
      "The final rebels commit mass suicide at the fortress at Masada, rather than be captured.",
    source: "",
    ...PLACES.masada,
  },
]

export default firstjewishWarTimeline

// Flavius Josephus, The Jewish War (Books II–VII)	Written c. 75–79 CE	Primary eyewitness account; Josephus served as commander in Galilee.

// Tacitus, Histories V	Written c. 105 CE	Roman senator’s summary of the war’s causes and fall of Jerusalem.

// Suetonius, Vespasian 4–8; Titus 5–7	Early 2nd century	Imperial biographies describing the Flavian campaign and triumph.

// Cassius Dio, Roman History 66	Early 3rd century	Retrospective narrative of the war’s scope and aftermath.
