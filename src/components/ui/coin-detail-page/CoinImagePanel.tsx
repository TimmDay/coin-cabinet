import { CoinSide } from "./CoinSide"

type CoinImagePanelProps = {
  coin: {
    nickname?: string | null
    image_link_o?: string | null
    image_link_r?: string | null
    legend_o?: string | null
    legend_o_expanded?: string | null
    legend_o_translation?: string | null
    desc_o?: string | null
    legend_r?: string | null
    legend_r_expanded?: string | null
    legend_r_translation?: string | null
    desc_r?: string | null
  }
}

export function CoinImagePanel({ coin }: CoinImagePanelProps) {
  const coinName = coin.nickname ?? "Ancient Coin"

  return (
    <section className="space-y-6">
      {/* Side-by-Side Coin Images */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <CoinSide
          side="obverse"
          imageUrl={coin.image_link_o}
          coinName={coinName}
          legend={coin.legend_o}
          legendExpanded={coin.legend_o_expanded}
          legendTranslation={coin.legend_o_translation}
          description={coin.desc_o}
        />

        <CoinSide
          side="reverse"
          imageUrl={coin.image_link_r}
          coinName={coinName}
          legend={coin.legend_r}
          legendExpanded={coin.legend_r_expanded}
          legendTranslation={coin.legend_r_translation}
          description={coin.desc_r}
        />
      </div>
    </section>
  )
}