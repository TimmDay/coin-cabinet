import Link from "next/link"

type SetPreviewCardProps = {
  name: string
  href: string
  description: string
  image?: string
}

export function SetPreviewCard({
  name,
  href,
  description,
  image: _image,
}: SetPreviewCardProps) {
  return (
    <Link
      href={href}
      className="group somnus-card p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      {/* Placeholder for future coin images */}
      <div className="mb-4 flex h-48 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/20">
        <div className="text-sm font-medium text-amber-300/60">{name}</div>
      </div>

      <h3 className="mb-3 text-xl font-semibold text-slate-200 transition-colors group-hover:text-amber-300">
        {name}
      </h3>

      <p className="coin-description text-sm leading-relaxed">{description}</p>

      <div className="mt-4 text-sm font-medium text-amber-400 transition-colors group-hover:text-amber-300">
        Explore Collection →
      </div>
    </Link>
  )
}
