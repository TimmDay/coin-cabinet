// Spans for the Province Tier.
//
// Geometry is a single AD 117-ish snapshot (see build-jurisdictions.mjs), so
// nothing here changes a shape. These say only WHEN each Jurisdiction existed,
// which is what stops the map drawing Dacia in 100 BC.
//
// `ohm` spans are attested: they come from dated administrative relations in
// OpenHistoricalMap, retrieved 2026-10-05, normalised onto Pazout's names and
// merged where OHM splits a province that Pazout keeps whole.
//
// `placeholder` spans are NOT scholarship. They run the length of the Roman
// era in this corpus, 275 BC to AD 476, and the labels carry an asterisk.
//
// Deliberately wide. A narrow placeholder is worse than a wide one, because
// every Jurisdiction sharing it begins and ends on the same day, and a reader
// scrubbing the slider sees sixteen provinces appear at once and reads it as
// an event. The earlier value of 27 BC to AD 284 did exactly that twice: it
// looked like Augustus's provincial settlement at one end and like the empire
// collapsing under Diocletian at the other. Spanning the era instead means
// these never pop in or out mid-slider, and the one edge that remains, 476,
// is a real one.
export const PLACEHOLDER_SPAN = { start: -275, end: 476 }

export const PROVINCE_SPANS = {
  // Attested by OpenHistoricalMap.
  "Africa Proconsularis": { start: -146, end: 698, source: "ohm" },
  "Alpes Cottiae": { start: 63, end: 476, source: "ohm" },
  "Alpes Graiae": { start: 63, end: 476, source: "ohm" },
  "Alpes Poeninae": { start: 63, end: 476, source: "ohm" },
  "Alpes Maritimae": { start: 63, end: 476, source: "ohm" },
  Aquitania: { start: -27, end: 476, source: "ohm" },
  Aegyptus: { start: -27, end: 641, source: "ohm" },
  Arabia: { start: 106, end: 300, source: "ohm" },
  Baetica: { start: -14, end: 409, source: "ohm" },
  Belgica: { start: -22, end: 476, source: "ohm" },
  // OHM splits Britannia across three consecutive relations.
  Britannia: { start: 43, end: 407, source: "ohm" },
  Creta: { start: -67, end: 297, source: "ohm" },
  Cyrene: { start: -67, end: 297, source: "ohm" },
  // OHM carries Dacia as five overlapping sub-provinces; this is their union.
  Dacia: { start: 106, end: 275, source: "ohm" },
  Dalmatia: { start: 8, end: 480, source: "ohm" },
  "Germania Inferior": { start: 85, end: 350, source: "ohm" },
  "Germania Superior": { start: 85, end: 476, source: "ohm" },
  "Hispania Citerior": { start: -197, end: -27, source: "ohm" },
  Iudaea: { start: 6, end: 132, source: "ohm" },
  Lugdunensis: { start: -27, end: 476, source: "ohm" },
  Lusitania: { start: -28, end: 409, source: "ohm" },
  "Mauretania Caesariensis": { start: 42, end: 585, source: "ohm" },
  "Mauretania Tingitana": { start: 42, end: 429, source: "ohm" },
  "Moesia Inferior": { start: 86, end: 290, source: "ohm" },
  "Moesia Superior": { start: 86, end: 271, source: "ohm" },
  Narbonensis: { start: -121, end: 476, source: "ohm" },
  Noricum: { start: -16, end: 476, source: "ohm" },
  Raetia: { start: -15, end: 476, source: "ohm" },
  Sicilia: { start: -241, end: 476, source: "ohm" },
  Syria: { start: -64, end: 198, source: "ohm" },
  // The eleven Augustan regiones, all 7 to 292 in OHM.
  "Aemilia (Regio VIII)": { start: 7, end: 292, source: "ohm" },
  "Apulia et Calabria (Regio II)": { start: 7, end: 292, source: "ohm" },
  "Bruttium et Lucania (Regio III)": { start: 7, end: 292, source: "ohm" },
  "Etruria (Regio VII)": { start: 7, end: 292, source: "ohm" },
  "Latium et Campania (Regio I)": { start: 7, end: 292, source: "ohm" },
  "Liguria (Regio IX)": { start: 7, end: 292, source: "ohm" },
  "Picenum (Regio V)": { start: 7, end: 292, source: "ohm" },
  "Samnium (Regio IV)": { start: 7, end: 292, source: "ohm" },
  "Transpadana (Regio XI)": { start: 7, end: 292, source: "ohm" },
  "Umbria (Regio VI)": { start: 7, end: 292, source: "ohm" },
  "Venetia et Histria (Regio X)": { start: 7, end: 292, source: "ohm" },

  // The city existed for the whole of the slider's range. Its outline is still
  // the AD 117 snapshot, so it reports as Inferred on geometry; the placeholder
  // marker here says only that no source was cited for the dates.
  Roma: { start: -275, end: 1453, source: "placeholder" },
}

/**
 * Italy before Augustus divided it.
 *
 * Italia was not a province: it was Roman soil, governed directly rather than
 * through a governor, which is what provincial status meant. It belongs on the
 * administrative-area Tier all the same, because it shares its boundaries with
 * the provinces around it.
 *
 * Its Span stops where the regiones begin, so the two never overlap and the
 * map tells the real sequence: undivided Roman Italy, then eleven numbered
 * districts from AD 7, then nothing once Diocletian turned Italy into
 * provinces in 292, which is geometry this corpus does not have.
 */
export const ITALIA = {
  name: "Italia",
  slug: "italia",
  start: -275,
  end: 6,
  source: "placeholder",
}

/**
 * Jurisdictions that succeed one of Pazout's features over the same ground.
 * The rename of Iudaea is a Succession, not a relabel, so it gets its own
 * Jurisdiction sharing the predecessor's geometry.
 *
 * The Severan split of Syria is deliberately absent: Coele Syria and Syria
 * Phoenice divide the territory, so reusing the whole Syria outline for both
 * would draw each of them over the other's ground. That needs real geometry.
 */
export const SUCCESSORS = [
  {
    from: "Iudaea",
    name: "Syria Palaestina",
    slug: "syria-palaestina",
    start: 136,
    end: 390,
    source: "ohm",
  },
]

/** Pazout features that are not provinces. */
export const TIER_OVERRIDES = {
  Roma: "city",
}

/** The eleven regiones belong to no Tier; they are an optional overlay. */
export const isRegio = (name) => / \(Regio [IVX]+\)$/.test(name)
