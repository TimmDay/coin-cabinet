import { CoinDetailPage } from "~/components/pages/CoinDetailPage"
import { extractIdFromSlug } from "~/lib/utils/url-helpers"

type SetCoinPageProps = {
  params: Promise<{ set: string; slug: string }>
}

export default async function SetCoinPage({ params }: SetCoinPageProps) {
  const { slug } = await params
  const coinId = extractIdFromSlug(slug)

  return <CoinDetailPage coinId={coinId.toString()} />
}
