// Builds the committed Jurisdiction layers for the map's year slider from
// upstream open-data sources. See CONTEXT.md for the vocabulary (Jurisdiction,
// Span, Basis year, Coverage, Attested/Inferred) and docs/adr/0001 for why
// Jurisdictions are keyed by a local slug rather than by a Pleiades id.
//
// Deliberately NOT wired into `prebuild`. The upstream archive is ~44MB
// compressed and ~165MB expanded; fetching and reparsing that on every Vercel
// build would be slow and would fail the moment GitHub rate-limits us. Instead
// this is run by hand (`pnpm data:jurisdictions`), and only its simplified
// output is committed. The download is cached under .cache/ (gitignored) so
// re-runs are cheap, and the upstream commit is recorded in the output so the
// provenance survives without the 165MB ever entering git history.
//
// Node needs a raised heap for the 165MB parse; the package.json script passes
// --max-old-space-size.
import { execFileSync } from "node:child_process"
import {
  isRegio,
  ITALIA,
  PLACEHOLDER_SPAN,
  PROVINCE_SPANS,
  SUCCESSORS,
  TIER_OVERRIDES,
} from "./province-spans.mjs"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { basename, dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const cacheDir = join(root, ".cache", "jurisdictions")
const outDir = join(root, "public", "data", "jurisdictions")

/** The slider's window. Nothing outside it is reachable, so everything clamps. */
const SLIDER_START = -400
const SLIDER_END = 1453

const PAZOUT = {
  key: "pazout",
  title:
    "Roman provinces AD 200 (Pazout correction of AWMC), via roman-road-networks",
  url: "https://github.com/MatteoMazzamurro/roman-road-networks",
  base: "https://raw.githubusercontent.com/MatteoMazzamurro/roman-road-networks/main/data/roman_provinces_simple/roman_provinces",
  licence: "CC BY-SA 4.0",
  licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  // Published as AD 200, but its contents date it to roughly 117-136, and the
  // Basis year is what the geometry actually depicts. Outside this window the
  // shapes are a reconstruction, which is what Coverage is for.
  coverage: { from: 117, to: 136 },
  basisYear: 117,
  modified:
    "Converted from shapefile, simplified, Iudaea given its Syria Palaestina " +
    "successor, Spans attached, and Roma separated onto the City Tier.",
  defects: [
    "Published as AD 200, but its contents date it to roughly AD 117-136: Dacia and Arabia present (after 106), no Mesopotamia or Armenia (after 117), Iudaea not yet Syria Palaestina (before the rename, which is dated after 132 with a diploma of 139 as the terminus).",
    "Syria is undivided, though the Severan split into Coele and Phoenice was around 194. Splitting it needs real geometry and is not attempted here.",
    "Britannia is undivided, though it was split around 197-216.",
    "Geometry is one snapshot reused across every Span, so a province's existence may be attested while its outline is not.",
  ],
}

const OHM = {
  key: "ohm",
  title: "OpenHistoricalMap",
  url: "https://www.openhistoricalmap.org/",
  licence: "CC0 1.0",
  licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  // Supplies Spans, not geometry, across the window queried.
  coverage: { from: -250, to: 700 },
  modified:
    "Dated administrative relations normalised onto Pazout's province names, " +
    "and merged where OHM splits a province Pazout keeps whole.",
  defects: [
    "Coverage is uneven: Anatolia and the Balkans are thin, and some entries are anachronistic carryovers.",
    "Some provinces appear at more than one admin level; duplicates were merged by name.",
  ],
}

// Not a Source in the bibliographic sense: a marker saying these dates have
// not been curated yet. Its Coverage is deliberately empty, so the resolver
// reports everything resting on it as Inferred.
const PLACEHOLDER = {
  key: "placeholder",
  title: "Spans not yet curated",
  // Not a bibliographic Source: nothing to cite and no licence to carry.
  placeholder: true,
  coverage: { from: 1, to: 0 },
  modified:
    "Provinces OpenHistoricalMap does not date are given the Principate " +
    "(27 BC to AD 284) as a placeholder, pending the cataloguer's dates.",
  defects: [
    "These Spans are a placeholder, not scholarship. A province resting on one appears across the Principate regardless of when it actually existed.",
  ],
}

const CLIOPATRIA = {
  key: "cliopatria",
  title: "Cliopatria (Seshat Global History Databank)",
  url: "https://github.com/Seshat-Global-History-Databank/cliopatria",
  archive:
    "https://raw.githubusercontent.com/Seshat-Global-History-Databank/cliopatria/main/cliopatria.geojson.zip",
  member: "cliopatria_polities_only_v021.geojson",
  licence: "CC BY 4.0",
  licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
  // Coverage is what the Source actually speaks to. Outside it, a claim is
  // Inferred rather than Attested -- the resolver derives that, so this range
  // is the single place to correct if the assessment changes.
  // Tracks the slider window rather than repeating it, so widening the window
  // cannot leave this claiming less than the data actually covers.
  coverage: { from: SLIDER_START, to: SLIDER_END },
  modified:
    "Filtered to Roman-world polities, clamped to 275 BC - AD 1453, the " +
    "eastern/Byzantine label switch merged into one Jurisdiction, and " +
    "geometry simplified.",
  defects: [
    "Dates the Gallic Empire 261-282; the standard dating is 260-274.",
    "Dates the Palmyrene Empire 261-269, which matches neither the 260-273 kingdom nor the 270-273 empire.",
    "Two Byzantine segments run past the fall of Constantinople (1440-1467, 1468-1474); truncated here at 1453.",
    "Byzantine Empire has no segments for 1227-1278 or 1402-1406; the successor states cover those years.",
    "Its Wikidata links are unreliable (Roman Empire -> Q12544, which is Byzantine Empire; Byzantine Empire -> Q112039853, which is Foreign relations of the Byzantine Empire), so they are not imported.",
  ],
}

// The non-Roman world: client kingdoms and rival powers, from the same
// Cliopatria download as the Roman chain, so no new source and no new licence.
//
// Role is a cataloguing judgement and several of these changed over time.
// Numidia was a client before Jugurtha and an enemy after; Armenia spent
// centuries as a buffer claimed by both Rome and Parthia; Pontus was an ally
// long before Mithridates. One Role per polity is a simplification, recorded
// here in one place so it is cheap for the cataloguer to revise.
//
// Two of these never render: the Achaemenid and Macedonian empires both end
// before the slider's 200 BC start, so they clamp away to nothing. They are
// listed anyway, so they appear on their own if the window is ever widened.
const OUTSIDERS = {
  Carthage: { slug: "carthage", name: "Carthage", role: "adversary" },
  "Achaemenid Empire": {
    slug: "achaemenid-empire",
    name: "Achaemenid Empire",
    role: "adversary",
  },
  "Macedonian Empire": {
    slug: "macedonian-empire",
    name: "Macedonian Empire",
    role: "adversary",
  },
  "Seleucid Empire": {
    slug: "seleucid-empire",
    name: "Seleucid Empire",
    role: "adversary",
  },
  "Ptolemaic Kingdom": {
    slug: "ptolemaic-kingdom",
    name: "Ptolemaic Kingdom",
    role: "adversary",
  },
  "Antigonid Macedonia": {
    slug: "antigonid-macedonia",
    name: "Antigonid Macedonia",
    role: "adversary",
  },
  "Parthian Empire": {
    slug: "parthian-empire",
    name: "Parthian Empire",
    role: "adversary",
  },
  "Sasanian Empire": {
    slug: "sasanian-empire",
    name: "Sasanian Empire",
    role: "adversary",
  },
  "Kingdom of Pontus": {
    slug: "kingdom-of-pontus",
    name: "Kingdom of Pontus",
    role: "adversary",
  },
  // Client kingdoms: inside Rome's orbit rather than opposing it.
  "Kingdom of Armenia": {
    slug: "kingdom-of-armenia",
    name: "Kingdom of Armenia",
    role: "client",
  },
  "Kingdom of Numidia": {
    slug: "kingdom-of-numidia",
    name: "Kingdom of Numidia",
    role: "client",
  },
  Nabataeans: { slug: "nabataeans", name: "Nabataeans", role: "client" },
}

// Upstream polity name -> local slug. Two names deliberately share a slug:
// Cliopatria's switch from "Eastern Roman Empire" to "Byzantine Empire" at 633
// is a segment boundary in their data, not a historical event. CONTEXT.md says
// a Jurisdiction is never renamed, so importing the switch literally would
// manufacture a Succession and a Change year that never happened.
const REALMS = {
  "Roman Republic": { slug: "roman-republic", name: "Roman Republic" },
  "Roman Empire": { slug: "roman-empire", name: "Roman Empire" },
  "Western Roman Empire": {
    slug: "western-roman-empire",
    name: "Western Roman Empire",
  },
  "Eastern Roman Empire": {
    slug: "eastern-roman-empire",
    name: "Eastern Roman Empire",
    altNames: ["Byzantine Empire"],
  },
  "Byzantine Empire": {
    slug: "eastern-roman-empire",
    name: "Eastern Roman Empire",
    altNames: ["Byzantine Empire"],
  },
  "Gallic Empire": { slug: "gallic-empire", name: "Gallic Empire" },
  "Palmyrene Empire": { slug: "palmyrene-empire", name: "Palmyrene Empire" },
  "Nicaean Empire": { slug: "nicaean-empire", name: "Nicaean Empire" },
  "Despotate of Epirus": {
    slug: "despotate-of-epirus",
    name: "Despotate of Epirus",
  },
  "Empire of Trebizond": {
    slug: "empire-of-trebizond",
    name: "Empire of Trebizond",
  },
  "Latin Empire": { slug: "latin-empire", name: "Latin Empire" },
}

function ensureArchive() {
  mkdirSync(cacheDir, { recursive: true })
  const zip = join(cacheDir, "cliopatria.geojson.zip")
  const member = join(cacheDir, CLIOPATRIA.member)
  if (existsSync(member)) return member

  if (!existsSync(zip)) {
    console.log("Downloading Cliopatria archive (~44MB)...")
    execFileSync("curl", ["-sSL", "-o", zip, CLIOPATRIA.archive], {
      stdio: "inherit",
    })
  }
  console.log("Expanding archive...")
  execFileSync("unzip", ["-o", "-q", zip, CLIOPATRIA.member, "-d", cacheDir])
  return member
}

function upstreamCommit() {
  // Records which upstream revision the committed output came from, so the
  // provenance survives without the source file being in git.
  const out = execFileSync("curl", [
    "-sSL",
    "https://api.github.com/repos/Seshat-Global-History-Databank/cliopatria/commits/main",
  ])
  return JSON.parse(out.toString()).sha?.slice(0, 10) ?? "unknown"
}

/** Clamp a segment to the slider window, or null if it falls wholly outside. */
function clamp(from, to) {
  const start = Math.max(from, SLIDER_START)
  const end = Math.min(to, SLIDER_END)
  return start > end ? null : { start, end }
}

function buildRealms(member) {
  console.log("Parsing Cliopatria (this takes a moment)...")
  const raw = JSON.parse(readFileSync(member, "utf8"))

  const features = []
  const spans = new Map()

  for (const f of raw.features) {
    const p = f.properties
    // POLITY only. The file also carries RELATION features describing
    // alliances and allegiances ("(Allegiance of Ostrogothic Kingdom to
    // Eastern Roman Empire)") -- those are relationships, not Jurisdictions.
    if (p.Type !== "POLITY") continue
    const realm = REALMS[p.Name] ?? OUTSIDERS[p.Name]
    if (!realm) continue

    const window = clamp(p.FromYear, p.ToYear)
    if (!window) continue

    features.push({
      type: "Feature",
      properties: {
        slug: realm.slug,
        name: realm.name,
        ...(realm.altNames ? { altNames: realm.altNames } : {}),
        tier: "realm",
        kind: "realm",
        // Roman unless the polity came from the outsiders table.
        role: realm.role ?? "roman",
        source: CLIOPATRIA.key,
        // Each Cliopatria segment carries its own geometry for its own years,
        // so the Basis year is the segment's own start -- unlike the province
        // layer, where one snapshot's shape is reused across many Spans.
        basisYear: window.start,
        segmentStart: window.start,
        segmentEnd: window.end,
      },
      geometry: f.geometry,
    })

    const span = spans.get(realm.slug)
    spans.set(realm.slug, {
      start: Math.min(span?.start ?? window.start, window.start),
      end: Math.max(span?.end ?? window.end, window.end),
    })
  }

  // The Span is a property of the Jurisdiction, not of one segment, so it can
  // only be known after every segment has been seen.
  for (const f of features) {
    const span = spans.get(f.properties.slug)
    f.properties.spanStart = span.start
    f.properties.spanEnd = span.end
  }

  features.sort(
    (a, b) =>
      a.properties.segmentStart - b.properties.segmentStart ||
      a.properties.slug.localeCompare(b.properties.slug),
  )
  return { features, spans }
}

function simplify(collection, outPath, percentage) {
  const tmp = join(cacheDir, `${basename(outPath, ".geojson")}-full.geojson`)
  writeFileSync(tmp, JSON.stringify(collection))
  execFileSync(
    join(root, "node_modules", ".bin", "mapshaper"),
    [
      tmp,
      // `keep-shapes` stops small islands collapsing to nothing. Deliberately
      // no `-clean`: it treats the smaller polygons as slivers and drops
      // them, which silently discarded over half the segments.
      "-simplify",
      `${percentage}%`,
      "keep-shapes",
      "-o",
      "format=geojson",
      "precision=0.001",
      outPath,
    ],
    { stdio: "inherit" },
  )
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\(regio [ivx]+\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function ensureProvinceShapefile() {
  mkdirSync(cacheDir, { recursive: true })
  const shp = join(cacheDir, "roman_provinces.shp")
  if (existsSync(shp)) return shp

  console.log("Downloading Pazout province shapefile (~53MB)...")
  for (const ext of ["shp", "dbf", "shx", "prj"]) {
    execFileSync(
      "curl",
      [
        "-sSL",
        "-o",
        join(cacheDir, `roman_provinces.${ext}`),
        `${PAZOUT.base}.${ext}`,
      ],
      { stdio: "inherit" },
    )
  }
  return shp
}

function buildProvinces() {
  const shp = ensureProvinceShapefile()
  const converted = join(cacheDir, "provinces-converted.geojson")

  // Convert only. All simplification happens in one later pass, so there is a
  // single place that controls fidelity rather than two compounding ones.
  execFileSync(
    join(root, "node_modules", ".bin", "mapshaper"),
    [shp, "-o", "format=geojson", converted],
    { stdio: "inherit" },
  )

  const raw = JSON.parse(readFileSync(converted, "utf8"))
  const features = []
  const byName = new Map()

  for (const f of raw.features) {
    const name = String(f.properties?.province ?? "").trim()
    if (!name) continue
    byName.set(name, f.geometry)

    const span = PROVINCE_SPANS[name]
    const window = clamp(
      span?.start ?? PLACEHOLDER_SPAN.start,
      span?.end ?? PLACEHOLDER_SPAN.end,
    )
    if (!window) continue

    const tier = TIER_OVERRIDES[name] ?? "province"

    features.push({
      type: "Feature",
      properties: {
        slug: slugify(name),
        name,
        tier,
        kind: tier === "city" ? "city" : isRegio(name) ? "regio" : "province",
        source: PAZOUT.key,
        spanSource: span?.source ?? PLACEHOLDER.key,
        basisYear: PAZOUT.basisYear,
        segmentStart: window.start,
        segmentEnd: window.end,
        spanStart: window.start,
        spanEnd: window.end,
      },
      geometry: f.geometry,
    })
  }

  // Italy before the regiones: the eleven districts merged back into the one
  // undivided Italia they were carved out of.
  const regioGeometries = raw.features
    .filter((f) => isRegio(String(f.properties?.province ?? "").trim()))
    .map((f) => f.geometry)
    .filter((g) => g && "coordinates" in g)

  if (regioGeometries.length > 0) {
    const window = clamp(ITALIA.start, ITALIA.end)
    if (window) {
      features.push({
        type: "Feature",
        properties: {
          slug: ITALIA.slug,
          name: ITALIA.name,
          tier: "province",
          kind: "territory",
          source: PAZOUT.key,
          spanSource: ITALIA.source,
          basisYear: PAZOUT.basisYear,
          segmentStart: window.start,
          segmentEnd: window.end,
          spanStart: window.start,
          spanEnd: window.end,
        },
        geometry: {
          type: "MultiPolygon",
          // Collecting the districts' rings is enough: they tile Italy, so the
          // union reads as one shape once drawn, without needing a real
          // polygon union and the topology repair that would come with it.
          coordinates: regioGeometries.flatMap((g) =>
            g.type === "Polygon" ? [g.coordinates] : g.coordinates,
          ),
        },
      })
    }
  }

  // A rename ends one Jurisdiction and begins its successor over the same
  // ground, so the successor reuses the predecessor's geometry.
  for (const succ of SUCCESSORS) {
    const geometry = byName.get(succ.from)
    if (!geometry) continue
    const window = clamp(succ.start, succ.end)
    if (!window) continue
    features.push({
      type: "Feature",
      properties: {
        slug: succ.slug,
        name: succ.name,
        tier: "province",
        kind: "province",
        source: PAZOUT.key,
        spanSource: succ.source,
        basisYear: PAZOUT.basisYear,
        segmentStart: window.start,
        segmentEnd: window.end,
        spanStart: window.start,
        spanEnd: window.end,
        succeeds: slugify(succ.from),
      },
      geometry,
    })
  }

  features.sort(
    (a, b) =>
      a.properties.segmentStart - b.properties.segmentStart ||
      a.properties.slug.localeCompare(b.properties.slug),
  )
  return features
}

const member = ensureArchive()
const { features, spans } = buildRealms(member)
mkdirSync(outDir, { recursive: true })

const realmsPath = join(outDir, "realms.geojson")
simplify({ type: "FeatureCollection", features }, realmsPath, 4)

const provinceFeatures = buildProvinces()
const provincesPath = join(outDir, "provinces.geojson")
// Province outlines are read at regional zoom at most, so 0.3% is ample; it
// keeps all 59 Jurisdictions and the layer gzips to about 60KB.
simplify(
  { type: "FeatureCollection", features: provinceFeatures },
  provincesPath,
  0.3,
)

const describe = (s) => ({
  title: s.title,
  ...(s.placeholder ? { placeholder: true } : {}),
  ...(s.url ? { url: s.url } : {}),
  ...(s.licence ? { licence: s.licence, licenceUrl: s.licenceUrl } : {}),
  retrieved: new Date().toISOString().slice(0, 10),
  coverage: s.coverage,
  modified: s.modified,
  defects: s.defects,
})

const sources = {
  [PAZOUT.key]: describe(PAZOUT),
  [OHM.key]: describe(OHM),
  [PLACEHOLDER.key]: describe(PLACEHOLDER),
  [CLIOPATRIA.key]: {
    title: CLIOPATRIA.title,
    url: CLIOPATRIA.url,
    licence: CLIOPATRIA.licence,
    licenceUrl: CLIOPATRIA.licenceUrl,
    upstreamCommit: upstreamCommit(),
    retrieved: new Date().toISOString().slice(0, 10),
    coverage: CLIOPATRIA.coverage,
    modified: CLIOPATRIA.modified,
    defects: CLIOPATRIA.defects,
  },
}
writeFileSync(
  join(outDir, "sources.json"),
  JSON.stringify(sources, null, 2) + "\n",
)

const bytes = readFileSync(realmsPath).length
console.log(`\nJurisdictions: ${features.length} segments`)
const roleOf = new Map(
  features.map((f) => [f.properties.slug, f.properties.role]),
)
for (const [slug, span] of [...spans].sort((a, b) => a[1].start - b[1].start)) {
  console.log(
    `  ${slug.padEnd(22)} ${String(span.start).padStart(5)} .. ${String(span.end).padEnd(5)}  ${roleOf.get(slug)}`,
  )
}
const missing = Object.entries(OUTSIDERS)
  .filter(([, o]) => !spans.has(o.slug))
  .map(([name]) => name)
if (missing.length > 0) {
  console.log(
    `  (outside the slider window, nothing drawn: ${missing.join(", ")})`,
  )
}
console.log(`realms.geojson: ${(bytes / 1024).toFixed(0)} KB`)

const attested = provinceFeatures.filter(
  (f) => f.properties.spanSource !== PLACEHOLDER.key,
).length
console.log(
  `\nProvince Tier: ${provinceFeatures.length} Jurisdictions ` +
    `(${attested} with attested Spans, ${provinceFeatures.length - attested} on placeholders)`,
)
console.log(
  `provinces.geojson: ${(readFileSync(provincesPath).length / 1024).toFixed(0)} KB`,
)
