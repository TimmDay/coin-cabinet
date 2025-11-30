type Place = {
  lat: number
  lng: number
  place: string
  altNames?: string[]
  etymology?: string
}

export const PLACES: Record<string, Place> = {
  alexandria: {
    lat: 31.2001,
    lng: 29.9187,
    place: "Alexandria",
  },
  antioch: {
    lat: 36.2021,
    lng: 36.1604,
    place: "Antioch",
  },
  "Beth-Horon": {
    place: "Beth-Horon",
    lat: 31.8772, // 31°52′38″N from Wikipedia
    lng: 35.1186, // 35°7′7″E from Wikipedia
    altNames: ["Bethoron", "Beit Horon", "Ὡρωνείν", "בֵית־חוֹרֹ֔ן"],
    etymology:
      "House of Horon (Canaanite deity). The Hebrew name Bethoron is derived from the name of an Egypto-Canaanite deity, Horon, mentioned in Ugaritic literature. The city is mentioned among the cities and towns smitten by Sheshonq I in his inscription at the Temple of Karnak as Batae Houarn",
  },
  caesareaMauretania: {
    place: "Caesarea Mauretaniae (modern Cherchell, Algeria)",
    lat: 36.61,
    lng: 2.19,
  },
  caesareaMaritima: {
    place: "Caesarea Maritima",
    lat: 32.5, // 32°30′0″N from Wikipedia
    lng: 34.8917, // 34°53′30″E from Wikipedia
    altNames: [
      "Caesarea Maritima",
      "Caesarea Palaestinae",
      "Caesarea Stratonis",
      "قيصرية",
      "Καισάρεια",
      "קיסריה",
    ],
  },
  caracallaAssassinationSite: {
    place: "Near Carrhae (on road from Edessa)",
    lat: 37.167,
    lng: 39.307,
    // source: "Cassius Dio --; Herodian --;",
  },
  carthage: {
    lat: 36.853,
    lng: 10.323,
    place: "Carthage",
  },
  chalcedon: {
    place: "Chalcedon",
    lat: 40.98,
    lng: 29.03,
  },
  constantinople: {
    lat: 41.0082,
    lng: 28.9784,
    place: "Constantinople",
  },
  jerusalem: {
    lat: 31.7683,
    lng: 35.2137,
    place: "Jerusalem",
  },
  jotapata: {
    place: "Jotapata",
    lat: 32.8322, // 32°49′56″N 35°16′39″E
    lng: 35.2775,
    altNames: ["Yodfat", "Iotapata", "Jotapatha", "יוֹדְפַת"],
  },
  lugdunum: {
    lat: 45.764,
    lng: 4.8357,
    place: "Lugdunum",
  },
  masada: {
    place: "Masada",
    lat: 31.3156,
    lng: 35.3539,
  },
  nisibis: {
    place: "Nisibis",
    lat: 37.07,
    lng: 41.22,
  },
  praetorianCamp: {
    place: "Praetorian Camp, Rome",
    lat: 41.8947,
    lng: 12.4853,
  },
  rome: {
    lat: 41.9028,
    lng: 12.4964,
    place: "Rome",
  },
  shahba: {
    place: "Shahba, Arabia Petraea",
    lat: 32.8547,
    lng: 36.6287,
  },
  verona: {
    place: "Verona",
    lat: 45.4384,
    lng: 10.9922,
  },
  viminacium: {
    place: "Viminacium",
    lat: 44.73,
    lng: 21.2,
  },
} as const
