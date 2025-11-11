type CoinFlavourProps = {
  flavourText: string
}

export function CoinFlavour({ flavourText }: CoinFlavourProps) {
  return (
    <div className="bg-card border-border mb-6 rounded-lg border p-8">
      <div className="flex items-center justify-center">
        <p className="text-justify text-sm leading-relaxed text-gray-300">
          {flavourText}
        </p>
      </div>
    </div>
  )
}
