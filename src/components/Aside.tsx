import Image from "next/image"

type AsideProps = {
  title: string
  body: string
  icon?: string
}

/**
 * An aside/callout component with a cut-out corner design
 * Features a circular icon positioned in the cut-out corner
 * Uses site theme colors for consistent styling
 */
export function Aside({
  title,
  body,
  icon = "/assets/icon-torch.png",
}: AsideProps) {
  let iconFiddleClass = "aside-icon-torch"
  if (icon.endsWith("gladius.png")) {
    iconFiddleClass = "aside-icon-gladius"
  }

  return (
    <aside className="relative py-12 font-sans">
      {/* Main content box with cut-out corner */}
      <div className="aside-cutout-box border-border rounded-xl border bg-gray-200 p-5 pl-12">
        <div className="mb-3">
          <h3 className="m-0 text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-sm leading-relaxed text-gray-700">{body}</div>
      </div>

      {/* Icon positioned on top of the main content */}
      <div className="aside-icon-bg absolute -top-5 -left-5 z-10 flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
        <Image
          src={icon}
          alt=""
          width={28}
          height={28}
          className={iconFiddleClass}
        />
      </div>
    </aside>
  )
}
