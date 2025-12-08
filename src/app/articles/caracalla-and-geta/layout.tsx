import { createArticleLayout } from "../ArticleLayout"
import { metadata } from "./page"

const { generateMetadata, default: Layout } = createArticleLayout(metadata)

export { generateMetadata }
export default Layout
