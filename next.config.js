/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js"
import createMDX from "@next/mdx"

/** @type {import("next").NextConfig} */
const config = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  outputFileTracingRoot: process.cwd(),
  experimental: {
    mdxRs: process.env.NODE_ENV === "development", // Use Rust MDX for Turbopack compatibility in dev
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Wrap MDX and Next.js config together
export default withMDX(config)
