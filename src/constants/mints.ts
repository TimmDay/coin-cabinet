/**
 * Roman mint locations with their coordinates
 * These represent major minting centers throughout the Roman Empire
 */

export type Mint = {
  mintName: string
  lat: number
  lng: number
}

export const ROMAN_MINTS: Mint[] = [
  {
    mintName: "Rome",
    lat: 41.9028,
    lng: 12.4964,
  },
  {
    mintName: "Alexandria",
    lat: 31.2001,
    lng: 29.9187,
  },
  {
    mintName: "Antioch",
    lat: 36.2021,
    lng: 36.1604,
  },
  {
    mintName: "Lugdunum",
    lat: 45.764,
    lng: 4.8357,
  },
]
