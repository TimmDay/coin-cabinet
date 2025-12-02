const severanImages = [
  "z_severan_Tondo-Altes_Museum-Berlin-Germany_2017",
  "z_caracalla-geta-jacques-pajou",
]
const gordyImages = ["z_bust-gordianus-iii-louvre-ma1063-ba2c6c-1024_2"]
const imperialWomenImages = ["z_Julia_Domna_marble_bust_Yale_1920x1080"]
const crisisImages = ["z_PhilipItheArabjpg"]
const tetrachyImages = [
  "z_7952_-_Venezia_-_Tetrarchi_in_Piazza_San_Marco_-_Foto_Giovanni_Dall_Orto_8-Aug-2007",
]
const constantinianImages = ["z_helena_pubdom"]
const hoardsImages = [""]
const adoptiveEmperorsImages = [""]

const severanSet = {
  name: "Severan Dynasty",
  href: "/cabinet/severan-dynasty",
  description:
    "Coins from the Severan period (193-235 AD), featuring the imperial family that ruled during a time of military expansion and architectural achievement.",
  image: pickRandomImage(severanImages),
}

const gordySet = {
  name: "Gordy Boys",
  href: "/cabinet/gordy-boys",
  description:
    "From the ashes of the Thrax panic rose Gordian III. Many coins were minted. The Crisis was underway.",
  image: pickRandomImage(gordyImages),
}

const imperialWomenSet = {
  name: "Imperial Women",
  href: "/cabinet/imperial-women",
  description:
    "Celebrating the powerful women of the Roman Empire through their numismatic representations and imperial portraiture.",
  image: pickRandomImage(imperialWomenImages),
}

const crisisSet = {
  name: "Crisis",
  href: "/cabinet/crisis",
  description:
    "Turmoil in the Crisis of the Third Century. A rapid succession of emperors and usurpers and their coins reflect the political instability and economic chaos.",
  image: pickRandomImage(crisisImages),
}
const tetrachySet = {
  name: "Tetrachy",
  href: "/cabinet/tetrachy",
  description:
    "Coins from Diocletian's revolutionary four-ruler system that stabilized the empire and reformed its administration.",
  image: pickRandomImage(tetrachyImages),
}
const constantinianSet = {
  name: "Constantinian",
  href: "/cabinet/constantinian",
  description:
    "The transformative period of Constantine the Great, including the first Christian symbols on Roman coinage.",
  image: pickRandomImage(constantinianImages),
}
const hoardsSet = {
  name: "Hoards",
  href: "/cabinet/hoards",
  description:
    "Archaeological treasure finds that provide insight into ancient economic conditions and coin circulation patterns.",
  image: pickRandomImage(hoardsImages),
}

const adoptiveEmperorsSet = {
  name: "The Adoptive Emperors",
  href: "/cabinet/adoptive-emperors",
  description: "Five guys kept things pretty peaceful for 84 years.",
  image: pickRandomImage(adoptiveEmperorsImages),
}

const silverEmperorsSet = {
  name: "Roman Emperors in Silver",
  href: "/cabinet/silver-emperors",
  description:
    "The cleanest silver observe for each emperor in the Somnus Collection",
  image: pickRandomImage([]),
}

export const featuredSets = [severanSet, gordySet, imperialWomenSet]

export const romanSets = [
  adoptiveEmperorsSet,
  severanSet,
  gordySet,
  crisisSet,
  tetrachySet,
  constantinianSet,
  hoardsSet,
  imperialWomenSet,
  silverEmperorsSet,
]

function pickRandomImage(images: string[]) {
  return images[Math.floor(Math.random() * images.length)]
}
