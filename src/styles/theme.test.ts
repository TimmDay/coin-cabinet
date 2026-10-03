import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

// The site's colours are role tokens (see docs/THEME.md), not raw Tailwind
// palette classes. This fails when one creeps back in.

const PALETTE_CLASS =
  /\b(?:text|bg|border(?:-[trblxyse])?|ring|ring-offset|from|to|via|fill|stroke|divide|outline|placeholder|caret|accent|decoration|shadow)-(?:slate|gray|stone|zinc|neutral|purple|violet|indigo|blue|sky|cyan|teal|emerald|green|lime|yellow|amber|orange|red|rose|pink|fuchsia)-\d{2,3}\b/g

// Status colours stay raw: red for an error, green for an enabled flag.
const STATUS = /^(?:red|green)-/

// Files that use raw colours on purpose:
const ALLOWED_FILES = new Set([
  // the stone-and-parchment note, a paper drawn in its own gradient
  "src/components/ui/TooltipLaurel.tsx",
  // keys that data files pass in to pick an icon filter
  "src/components/ui/Timeline.tsx",
])

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      return name === "data" ? [] : sourceFiles(path)
    }
    return /\.(ts|tsx)$/.test(name) && !/\.test\./.test(name) ? [path] : []
  })
}

describe("theme", () => {
  it("uses role tokens, not raw palette classes", () => {
    const root = process.cwd()
    const found: string[] = []

    for (const path of sourceFiles(join(root, "src"))) {
      const relative = path.slice(root.length + 1)
      if (ALLOWED_FILES.has(relative)) continue

      for (const match of readFileSync(path, "utf8").matchAll(PALETTE_CLASS)) {
        const colour = match[0].replace(/^.*?-((?:[a-z]+)-\d+)$/, "$1")
        if (!STATUS.test(colour)) found.push(`${relative}: ${match[0]}`)
      }
    }

    expect(found).toEqual([])
  })
})
