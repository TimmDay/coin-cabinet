import { cn } from "~/lib/utils"

type AnimatedHamburgerIconProps = React.SVGAttributes<SVGElement> & {
  isOpen: boolean
}

export const AnimatedHamburgerIcon = ({
  className,
  isOpen,
  ...props
}: AnimatedHamburgerIconProps) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className={cn(
        "origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]",
        isOpen && "translate-x-0 translate-y-0 rotate-[315deg]",
      )}
    />
    <path
      d="M4 12H20"
      className={cn(
        "origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)]",
        isOpen && "rotate-45",
      )}
    />
    <path
      d="M4 12H20"
      className={cn(
        "origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]",
        isOpen && "translate-y-0 rotate-[135deg]",
      )}
    />
  </svg>
)
