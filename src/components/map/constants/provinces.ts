/**
 * Roman province names extracted from provinces.geojson
 * These represent all available provinces that can be displayed on the map.
 *
 * This list is used as the source of truth for:
 * - Type checking province selection arrays
 * - Validating province names
 * - Implementing Select All/Clear All functionality
 * - Default province visibility state
 */

// TODO: add the Severus splits both here and in the geojson file.
// He divided Syria into two provinces, Syria Coele and Syria Phoenice, around 194 CE
// Britannia was also divided into Britannia Superior and Britannia Inferior, although the formal establishment of the split in Britannia is debated and may have occurred under his son, Caracalla.

// Syria Coele
// Syria Phoenice
// Britannia Superior
// Britannia Inferior

type ProvinceData = {
  name: string
  dateEstablished?: string
  dateDissolved?: string
  capital?: string
  stationedLegions?: string[]
}

const provincesData: ProvinceData[] = [
  {
    name: "Achaia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Aegyptus",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Africa Proconsularis",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Alpes Cottiae",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Alpes Graiae et Poeninae",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Alpes Maritimae",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Aquitania",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Arabia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Armenia Mesopotamia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Asia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Baetica",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Belgica",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Bithynia et Pontus",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Britannia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Cilicia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Creta et Cyrene",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Cyprus",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Dacia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Dalmatia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Galatia et Cappadocia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Germania Inferior",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Germania Superior",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Iudaea",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Lugdunensis",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Lusitania",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Lycia et Pamphylia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Macedonia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Mauretania Caesariensis",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Mauretania Tingitana",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Moesia Inferior",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Moesia Superior",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Narbonensis",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Noricum",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Numidia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Pannonia Inferior",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Pannonia Superior",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Raetia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Sardinia et Corsica",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Sicilia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Syria",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Tarraconensis",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "Thracia",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  // Roman numerals - administrative regions / military districts

  {
    name: "I",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "II",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "III",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "IV",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "V",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "VI",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "VII",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "VIII",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "IX",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "X",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
  {
    name: "XI",
    dateEstablished: undefined,
    dateDissolved: undefined,
    capital: undefined,
    stationedLegions: undefined,
  },
]

export const ROMAN_PROVINCES = provincesData.map(
  (province) => province.name,
) as readonly string[]

export type RomanProvince = (typeof ROMAN_PROVINCES)[number]

/**
 * Check if a string is a valid Roman province name
 */
export const isValidProvince = (name: string): name is RomanProvince => {
  return ROMAN_PROVINCES.includes(name)
}

/**
 * Filter an array of strings to only include valid province names
 */
export const filterValidProvinces = (names: string[]): RomanProvince[] => {
  return names.filter(isValidProvince)
}
