// maplibre-gl's worker script resolves its own URL via `import.meta.url` at
// runtime (see maplibre-gl/dist/maplibre-gl-dev.mjs's defaultWorkerUrl()) --
// that only produces a usable http(s) URL when the module is served as-is.
// Next.js's webpack bundling rewrites import.meta.url for bundled modules,
// so the auto-detected worker URL comes back empty and every vector/geojson
// source silently never finishes loading (raster sources still work, since
// they don't need the worker -- easy to miss until you check
// map.getSource(id).loaded()).
//
// Fix: serve the worker script as a static file and point maplibre-gl at it
// explicitly via setWorkerUrl() (see Map.tsx). This script copies it from
// node_modules into public/ so it's always in sync with the installed
// maplibre-gl version -- runs on every `pnpm install` via the postinstall
// script in package.json.
import { copyFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, "..", "node_modules", "maplibre-gl", "dist")
const publicDir = join(__dirname, "..", "public")

// maplibre-gl-worker.mjs imports from maplibre-gl-shared.mjs by relative
// path -- since the worker is loaded at runtime via a plain fetch/import()
// from /public (outside webpack's module graph), that import resolves
// against the served URL, so the shared chunk needs to be public too, not
// just the worker entry point.
const files = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]

for (const file of files) {
  const source = join(distDir, file)
  const dest = join(publicDir, file)

  if (!existsSync(source)) {
    console.warn(
      `${source} not found -- skipping copy (is maplibre-gl installed?)`,
    )
    continue
  }

  copyFileSync(source, dest)
  console.log(`Copied ${file} to ${dest}`)
}
