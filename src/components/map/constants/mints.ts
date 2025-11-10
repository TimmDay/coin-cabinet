/**
 * Roman mint locations with their coordinates
 * These represent major minting centers throughout the Roman Empire
 */

export type Mint = {
  mintNames: string[]
  displayName: string
  lat: number
  lng: number
  operationDates: [number, number, string][]
  mintMarks: string[]
  coinageMaterials: string[]
  referenceLinks: string[]
  openedBy: string
  flavourText: string
}

export const ROMAN_MINTS: Mint[] = [
  {
    mintNames: ["Rome", "Roma"],
    displayName: "Rome",
    lat: 41.9028,
    lng: 12.4964,
    operationDates: [],
    mintMarks: [],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText: "",
  },
  {
    mintNames: ["Alexandria"],
    displayName: "Alexandria",
    lat: 31.2001,
    lng: 29.9187,
    operationDates: [],
    mintMarks: [],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText: "",
  },
  {
    mintNames: ["Antioch"],
    displayName: "Antioch",
    lat: 36.2021,
    lng: 36.1604,
    operationDates: [],
    mintMarks: [],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText: "",
  },
  {
    mintNames: ["Lugdunum", "Leon", "Lyon"],
    displayName: "Lugdunum",
    lat: 45.764,
    lng: 4.8357,
    operationDates: [
      [-15, 90, "Augustus"],
      [195, 197, "Clodius Albinus"],
      [294, 423, "Diocletian"],
    ],
    mintMarks: ["PLG", "LVG", "LVGD", "LG", "PLON", "SLG"],
    coinageMaterials: ["bronze", "silver", "gold"],
    referenceLinks: [
      "https://www.aeternitas-numismatics.com/single-post/Roman-imperial-mints-Lugdunum?utm_source=chatgpt.com",
    ],
    openedBy: "Augustus",
    flavourText:
      "The mint at Lugdunam (modern day Lyon) supplied coins to pay the legions in Gaul, along the Rhine frontier, and provided distribution for the western provinces. Having a mint at this key location meant that it could receive gold and silver shipments directly from the mines in Hispania, without having to ship it all the way to Rome and then ship the coinage back north again",
  },
  {
    mintNames: ["Trier", "Treveri"],
    displayName: "Treveri (Trier)",
    lat: 49.7596,
    lng: 6.6441,
    operationDates: [],
    mintMarks: [],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText: "",
  },
  {
    mintNames: ["Viminacium"],
    displayName: "Viminacium",
    lat: 44.7342,
    lng: 21.2095,
    operationDates: [],
    mintMarks: [],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText: "",
  },
  {
    mintNames: ["Heraclea"],
    displayName: "Heraclea",
    lat: 41.2858,
    lng: 31.4183,
    operationDates: [],
    mintMarks: [],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText: "",
  },
  {
    mintNames: ["Thessalonica", "Θεσσαλονίκη"],
    displayName: "Thessalonica (Θεσσαλονίκη)",
    lat: 40.6401,
    lng: 22.9444,
    operationDates: [],
    mintMarks: ["THES", "TES", "ΘΕC"],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText:
      "A major urban, administrative, and military hub on the Via Egnatia and near the coast of the Aegean Sea. Struck coinage to serve the Balkans, Illyricum, and the Danube frontier.",
  },
  {
    mintNames: ["Singara"],
    displayName: "Singara",
    lat: 36.8333,
    lng: 41.8167,
    operationDates: [],
    mintMarks: [],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText: "",
  },
  {
    mintNames: ["Jerusalem"],
    displayName: "Jerusalem",
    lat: 31.7683,
    lng: 35.2137,
    operationDates: [],
    mintMarks: [],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText: "",
  },
  {
    mintNames: ["Nicea"],
    displayName: "Nicea",
    lat: 40.4272,
    lng: 29.7192,
    operationDates: [],
    mintMarks: [],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText: "",
  },
  {
    mintNames: ["Kebren"],
    displayName: "Κεβρήν (Kebren)",
    lat: 39.7333,
    lng: 26.1167,
    operationDates: [],
    mintMarks: [],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText: "",
  },
  {
    mintNames: ["Eusebeia-Mazaca"],
    displayName: "Eusebeia-Mazaca",
    lat: 38.7312,
    lng: 35.4787,
    operationDates: [],
    mintMarks: [],
    coinageMaterials: [],
    referenceLinks: [],
    openedBy: "",
    flavourText: "",
  },
]
