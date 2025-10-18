import { redirect } from "next/navigation"
import { CoinDetailPage } from "~/components/pages/CoinDetailPage"
import { extractIdFromSlug, isValidCoinSlug } from "~/lib/utils/url-helpers"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function CabinetSlugPage({ params }: PageProps) {
  const { slug } = await params

  // Check if this is a coin slug (starts with number-) or a set name
  if (isValidCoinSlug(slug)) {
    // This is a coin detail page
    const coinId = extractIdFromSlug(slug)
    return <CoinDetailPage coinId={coinId.toString()} />
  } else {
    // This is a set name that doesn't have its own page
    // Redirect to the main cabinet page or show 404
    redirect("/cabinet")
  }
}
