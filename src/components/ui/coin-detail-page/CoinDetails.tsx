type CoinDetailsProps = {
  coin: {
    civ: string
    civ_specific?: string | null
    denomination: string
    mint?: string | null
    mint_year_earliest?: number | null
    mint_year_latest?: number | null
    diameter?: number | null
    mass?: number | null
    die_axis?: string | null
    reference?: string | null
    provenance?: string | null
    sets?: string[] | null
    flavour_text?: string | null
  }
}

type DetailRowProps = {
  label: string
  value: string | number
  fullWidth?: boolean
}

function DetailRow({ label, value, fullWidth = false }: DetailRowProps) {
  return (
    <div className={`break-words ${fullWidth ? "col-span-full" : ""}`}>
      <span className="text-slate-400">{label}:</span>
      <span className="ml-2 text-slate-300">{value}</span>
    </div>
  )
}

export function CoinDetails({ coin }: CoinDetailsProps) {
  const yearDisplay = coin.mint_year_earliest
    ? `${coin.mint_year_earliest}${
        coin.mint_year_latest && coin.mint_year_latest !== coin.mint_year_earliest
          ? `-${coin.mint_year_latest}`
          : ""
      } CE`
    : null

  return (
    <section className="artemis-card h-fit p-6">
      <header className="mb-6">
        <h2 className="coin-title text-center text-xl lg:text-left">
          Coin Details
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-4 text-left lg:gap-3">
        <DetailRow label="Civilization" value={coin.civ} />
        
        {coin.civ_specific && (
          <DetailRow label="Specific" value={coin.civ_specific} />
        )}
        
        <DetailRow label="Denomination" value={coin.denomination} />
        
        {coin.mint && <DetailRow label="Mint" value={coin.mint} />}
        
        {yearDisplay && <DetailRow label="Year" value={yearDisplay} />}
        
        {coin.diameter && (
          <DetailRow label="Diameter" value={`${coin.diameter}mm`} />
        )}
        
        {coin.mass && <DetailRow label="Mass" value={`${coin.mass}g`} />}
        
        {coin.die_axis && <DetailRow label="Die Axis" value={coin.die_axis} />}
        
        {coin.reference && <DetailRow label="Reference" value={coin.reference} />}
        
        {coin.provenance && (
          <DetailRow label="Provenance" value={coin.provenance} />
        )}
        
        {coin.sets && coin.sets.length > 0 && (
          <DetailRow 
            label="Sets" 
            value={coin.sets.join(", ")} 
            fullWidth 
          />
        )}
      </div>

      {coin.flavour_text && (
        <footer className="mt-6 border-t border-slate-600 pt-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-300">
            Additional Information
          </h3>
          <p className="break-words italic text-slate-400 leading-relaxed">
            {coin.flavour_text}
          </p>
        </footer>
      )}
    </section>
  )
}