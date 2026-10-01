// Each set lists candidate images. The server and the first client render
// both show the first one (so they always match); SetPreviewCard then swaps in
// a random one after the page loads. Picking at random here, at module load,
// made the server and browser disagree and React warned about a hydration
// mismatch.
const severanImages = [
  "z_severan_Tondo-Altes_Museum-Berlin-Germany_2017__bg",
  "z_caracalla-geta-jacques-pajou",
]
const gordyImages = ["z_bust-gordianus-iii-louvre-ma1063-ba2c6c-1024_2"]
const imperialWomenImages = ["z_Julia_Domna_marble_bust_Yale_1920x1080"]
const crisisImages = ["z_PhilipItheArabjpg"]
const tetrachyImages = [
  "z_7952_-_Venezia_-_Tetrarchi_in_Piazza_San_Marco_-_Foto_Giovanni_Dall_Orto_8-Aug-2007",
]
const constantinianImages = ["z_helena_pubdom"]
const detectorFindsImages = [""]
const adoptiveEmperorsImages = [""]

const severanSet = {
  name: "Severan Dynasty",
  href: "/cabinet/severan-dynasty",
  description:
    "The African Emperor, the Syrian Empress, two loving brothers and three Julias.",
  image: severanImages,
}

const gordySet = {
  name: "Gordy Boys",
  href: "/cabinet/gordy-boys",
  description:
    "The boy who was chosen. Many coins were minted. Nothing could possiblay go wrong.",
  image: gordyImages,
}

const imperialWomenSet = {
  name: "Imperial Women",
  href: "/cabinet/imperial-women",
  description:
    // From this moment the country was transformed, and all things became subject to the control of a woman...
    "Hers was a rigorous, almost masculine despotism.",
  // Subject: Agrippina the Younger, wife of Claudius and mother of Nero.
  // Source: Tacitus, The Annals, Book 12, Chapter 7.
  image: imperialWomenImages,
}

const crisisSet = {
  name: "Crisis",
  href: "/cabinet/crisis",
  description:
    "Turmoil in the Crisis of the Third Century. A rapid succession of emperors and usurpers and their coins reflect the political instability and economic chaos.",
  image: crisisImages,
}
const tetrachySet = {
  name: "Tetrachy",
  href: "/cabinet/tetrachy",
  description:
    "Coins from Diocletian's revolutionary four-ruler system that stabilized the empire and reformed its administration.",
  image: tetrachyImages,
}
const constantinianSet = {
  name: "Constantinian",
  href: "/cabinet/constantinian",
  description:
    "The transformative period of Constantine the Great, including the first Christian symbols on Roman coinage.",
  image: constantinianImages,
}
const detectorFindsSet = {
  name: "Detector Finds",
  href: "/cabinet/detector-finds",
  description:
    "Coins recovered through detector finds, with provenance details that add context to where and how they were discovered.",
  image: detectorFindsImages,
}

const adoptiveEmperorsSet = {
  name: "The Adoptive Emperors",
  href: "/cabinet/adoptive-emperors",
  description: "Five guys kept things pretty peaceful for 84 years.",
  image: adoptiveEmperorsImages,
}

const silverEmperorsSet = {
  name: "Roman Emperors in Silver",
  href: "/cabinet/silver-emperors",
  description:
    "The cleanest silver observe for each emperor in the Somnus Collection",
  image: [],
}

export const featuredSets = [severanSet, gordySet, imperialWomenSet]

export const romanSets = [
  adoptiveEmperorsSet,
  severanSet,
  gordySet,
  crisisSet,
  tetrachySet,
  constantinianSet,
  detectorFindsSet,
  imperialWomenSet,
  silverEmperorsSet,
]
