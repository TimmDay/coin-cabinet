/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import createMDX from "@next/mdx"
import "./src/env.js"

/** @type {import("next").NextConfig} */
const config = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter"],
  },
})

export default withMDX(config)
