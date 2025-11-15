export type Place = {
  lat: number
  lng: number
  place: string
}

export const PLACES = {
  rome: {
    lat: 41.9028,
    lng: 12.4964,
    place: "Rome",
  },
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
  lugdunum: {
    lat: 45.764,
    lng: 4.8357,
    place: "Lugdunum",
  },
  carthage: {
    lat: 36.853,
    lng: 10.323,
    place: "Carthage",
  },
  jerusalem: {
    lat: 31.7683,
    lng: 35.2137,
    place: "Jerusalem",
  },
  constantinople: {
    lat: 41.0082,
    lng: 28.9784,
    place: "Constantinople",
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
  shahba: {
    place: "Shahba, Arabia Petraea",
    lat: 32.8547,
    lng: 36.6287,
  },
  caesareaMauretania: {
    place: "Caesarea Mauretaniae (modern Cherchell, Algeria)",
    lat: 36.61,
    lng: 2.19,
  },
  caracallaAssassinationSite: {
    place: "Near Carrhae (on road from Edessa)",
    lat: 37.167,
    lng: 39.307,
    // source: "Cassius Dio 78.5–6; Herodian 4.12;",
  },
  nisibis: {
    place: "Nisibis",
    lat: 37.07,
    lng: 41.22,
  },
  chalcedon: {
    place: "Chalcedon",
    lat: 40.98,
    lng: 29.03,
  },
} as const

// Legacy exports for backward compatibility (can be removed later)
export const rome = PLACES.rome
export const alexandria = PLACES.alexandria
export const antioch = PLACES.antioch
export const lugdunum = PLACES.lugdunum
export const carthage = PLACES.carthage
export const jerusalem = PLACES.jerusalem
export const constantinople = PLACES.constantinople
export const verona = PLACES.verona
export const viminacium = PLACES.viminacium
