import { CoinDetailPage } from "~/components/pages/CoinDetailPage"
import { extractIdFromSlug } from "~/lib/utils/url-helpers"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function CoinPage({ params }: PageProps) {
  const { slug } = await params
  const coinId = extractIdFromSlug(slug)

  return <CoinDetailPage coinId={coinId.toString()} />
}
