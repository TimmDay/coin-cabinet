import { PageTitle } from "./PageTitle"

type PageTitleWithSnapshotProps = {
  /** The main text of the title */
  children: string
  /** Optional subtitle text */
  subtitle?: string
  /** Additional CSS classes */
  className?: string
  /** Use purple accent instead of gold for auth pages */
  authPage?: boolean
  /** Coin snapshot to display to the right of the title */
  coinSnapshot: React.ReactNode
  /** Coin physical characteristics for mobile info display */
  coinPhysicalInfo?: {
    diameter?: number | null
    mass?: number | null
    dieAxis?: string | null
  }
}

export function PageTitleWithSnapshot({
  children,
  subtitle,
  className = "",
  authPage = false,
  coinSnapshot,
  coinPhysicalInfo,
}: PageTitleWithSnapshotProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Mobile: Stacked layout */}
      <div className="lg:hidden">
        <PageTitle
          subtitle={subtitle}
          authPage={authPage}
          coinPhysicalInfo={coinPhysicalInfo}
        >
          {children}
        </PageTitle>

        {/* Coin snapshot hidden on mobile */}
      </div>

      {/* Desktop: Title and snapshot side by side, centered */}
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-8">
        {/* Title section */}
        <div>
          <PageTitle subtitle={subtitle} authPage={authPage}>
            {children}
          </PageTitle>
        </div>

        {/* Coin snapshot section */}
        <div>{coinSnapshot}</div>
      </div>
    </div>
  )
}
