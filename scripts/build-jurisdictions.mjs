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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const cacheDir = join(root, ".cache", "jurisdictions")
const outDir = join(root, "public", "data", "jurisdictions")

/** The slider's window. Nothing outside it is reachable, so everything clamps. */
const SLIDER_START = -200
const SLIDER_END = 1453

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
  coverage: { from: -200, to: 1453 },
  modified:
    "Filtered to Roman-world polities, clamped to 200 BC - AD 1453, the " +
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
    const realm = REALMS[p.Name]
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
  const tmp = join(cacheDir, "realms-full.geojson")
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

const member = ensureArchive()
const { features, spans } = buildRealms(member)
mkdirSync(outDir, { recursive: true })

const realmsPath = join(outDir, "realms.geojson")
simplify({ type: "FeatureCollection", features }, realmsPath, 4)

const sources = {
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
for (const [slug, span] of [...spans].sort((a, b) => a[1].start - b[1].start)) {
  console.log(`  ${slug.padEnd(22)} ${span.start} .. ${span.end}`)
}
console.log(`realms.geojson: ${(bytes / 1024).toFixed(0)} KB`)
