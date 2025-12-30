export const denominationOptions = [
  { value: "Denarius", label: "Denarius" },
  { value: "Antoninianus", label: "Antoninianus" },
  { value: "Sestertius", label: "Sestertius" },
  { value: "Follis", label: "Follis" },
  { value: "Dupondius / As", label: "Dupondius / As" },
  { value: "Aureus", label: "Aureus" },
  { value: "Solidus", label: "Solidus" },
  { value: "Tetradrachm", label: "Tetradrachm" },
  { value: "Drachm", label: "Drachm" },
  { value: "Obol", label: "Obol" },
  { value: "Prutah", label: "Prutah" },
  { value: "Æ1", label: "Æ1" },
  { value: "Æ2", label: "Æ2" },
  { value: "Æ3", label: "Æ3" },
  { value: "Æ4", label: "Æ4" },
  { value: "Decanummium", label: "Decanummium" },
  { value: "Æ", label: "Æ" },
  { value: "Other", label: "Other" },
]

export const authorityOptions = [
  { value: "Augustus", label: "Augustus" },
  { value: "Caesar", label: "Caesar" },
  { value: "Augusta", label: "Augusta" },
  { value: "King", label: "King" },
  { value: "Republican", label: "Republican" },
  { value: "Commemorative", label: "Commemorative" },
  { value: "Other", label: "Other" },
]

export const civilizationOptions = [
  { value: "Roman Imperial", label: "Roman Imperial" },
  { value: "Roman Republic", label: "Roman Republic" },
  { value: "Roman Provincial", label: "Roman Provincial" },
  { value: "Byzantine", label: "Byzantine" },
  { value: "Ancient Greece", label: "Ancient Greece" },
  { value: "Carthage", label: "Carthage" },
  { value: "Judea", label: "Judea" },
  { value: "Persian", label: "Persian" },
  { value: "Parthian", label: "Parthian" },
  { value: "Sassanian", label: "Sassanian" },
  { value: "Palmyrene Empire", label: "Palmyrene Empire" },
  { value: "Gallic Empire", label: "Gallic Empire" },
]

export const dieAxisOptions = [
  { value: "12h", label: "12h (↑↑)" },
  { value: "11h", label: "11h" },
  { value: "10h", label: "10h" },
  { value: "9h", label: "9h (←↑)" },
  { value: "8h", label: "8h" },
  { value: "7h", label: "7h" },
  { value: "6h", label: "6h (↓↓)" },
  { value: "5h", label: "5h" },
  { value: "4h", label: "4h" },
  { value: "3h", label: "3h (→↑)" },
  { value: "2h", label: "2h" },
  { value: "1h", label: "1h" },
]

// Civilization-specific options
export const civSpecificOptions = {
  "Ancient Greece": [
    { value: "Kingdom of Macedon", label: "Kingdom of Macedon" },
    { value: "Kingdom of Cappadocia", label: "Kingdom of Cappadocia" },
    { value: "Troas, Kebren", label: "Troas, Kebren" },
    { value: "other", label: "Other" },
  ],
  Carthage: [
    { value: "North Africa", label: "North Africa" },
    { value: "other", label: "Other" },
  ],
  "Roman Provincial": [
    { value: "Alexandria", label: "Alexandria" },
    { value: "Antioch", label: "Antioch" },
    { value: "Bithynia-Pontus", label: "Bithynia-Pontus" },
    { value: "Mesopotamia", label: "Mesopotamia" },
    { value: "Moesia Superior", label: "Moesia Superior" },
    { value: "Moesia Inferior", label: "Moesia Inferior" },
    { value: "other", label: "Other" },
  ],
}

export const setsOptions = [
  { value: "silver-emperors", label: "Roman Emperors" },
  { value: "imperial-women", label: "Imperial Women" },
  { value: "adoptive-emperors", label: "The Adoptive Emperors" },
  { value: "severan", label: "Severan Dynasty" },
  { value: "gordy-boys", label: "Gordy Boys" },
  { value: "crisis", label: "Crisis" },
  { value: "tetrachy", label: "Tetrachy" },
  { value: "constantinian", label: "Constantinian" },
  { value: "hoards", label: "Hoards" },
]
