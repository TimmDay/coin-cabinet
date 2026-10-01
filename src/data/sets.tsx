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

export const featuredSets = [severanSet, gordySet, imperialWomenSet]
