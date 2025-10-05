"use client"
import { ChevronDown, ChevronRight } from "lucide-react"
import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { UserMenu } from "~/components/auth/UserMenu"
import { useAuth } from "~/components/providers/auth-provider"
import { cn } from "~/lib/utils"
import {
  coinCabinetItems,
  mainSetsSubmenu,
  navigationItems,
  romanSubmenu,
  setsSubmenu,
  type SubmenuTypes,
} from "./navigation-schema"

const HOVER_DELAY = 200 // milliseconds
export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<SubmenuTypes | null>(null)
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleCoinCabinetClick = () => {
    router.push("/coin-cabinet")
    setIsDropdownOpen(false)
  }

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setIsDropdownOpen(true)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
      setOpenSubmenu(null) // Also close submenu when main dropdown closes
    }, HOVER_DELAY)
  }

  const handleSubmenuEnter = (itemName: SubmenuTypes) => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current)
    }
    setOpenSubmenu(itemName)
  }

  const handleSubmenuLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setOpenSubmenu(null)
    }, HOVER_DELAY)
  }

  // Keyboard navigation handlers
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        setIsDropdownOpen(false)
        setOpenSubmenu(null)
        break
      case "ArrowDown":
        if (!isDropdownOpen) {
          event.preventDefault()
          setIsDropdownOpen(true)
        }
        break
      case "ArrowUp":
        if (isDropdownOpen) {
          event.preventDefault()
          setIsDropdownOpen(false)
          setOpenSubmenu(null)
        }
        break
    }
  }

  const handleSubmenuKeyDown = (
    event: React.KeyboardEvent,
    itemName: SubmenuTypes,
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault()
        setOpenSubmenu(itemName)
        break
      case "ArrowRight":
        event.preventDefault()
        setOpenSubmenu(itemName)
        break
      case "ArrowLeft":
        if (openSubmenu === itemName) {
          event.preventDefault()
          setOpenSubmenu(null)
        }
        break
      case "Escape":
        setIsDropdownOpen(false)
        setOpenSubmenu(null)
        break
    }
  }

  const handleSubmenuItemKeyDown = (
    event: React.KeyboardEvent,
    href: string,
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault()
        router.push(href)
        setIsDropdownOpen(false)
        setOpenSubmenu(null)
        break
      case "Escape":
        setIsDropdownOpen(false)
        setOpenSubmenu(null)
        break
    }
  }

  // Helper function to get the appropriate submenu items
  const getSubmenuItems = (itemName: string) => {
    switch (itemName) {
      case "Sets":
        return setsSubmenu
      case "Roman":
        return romanSubmenu
      default:
        return []
    }
  }

  // Helper function to get main navigation submenu items
  const getMainSubmenuItems = (itemName: string) => {
    switch (itemName) {
      case "Sets":
        return mainSetsSubmenu
      default:
        return []
    }
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current)
      }
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [])

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-dropdown="coin-cabinet"]')) {
        setIsDropdownOpen(false)
        setOpenSubmenu(null)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false)
        setOpenSubmenu(null)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isDropdownOpen])

  const isActive = pathname.startsWith("/coin-cabinet")

  // Filter navigation items based on authentication status
  const visibleNavItems = navigationItems.filter((item) => {
    // Only show "Admin" for authenticated users
    if (item.name === "Admin") {
      return !!user
    }
    return true
  })

  return (
    <nav
      className="somnus-nav relative flex h-48 flex-col justify-end px-4 sm:px-6 lg:px-8"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* UserMenu fixed to top right */}
      <div className="absolute top-4 right-4 sm:right-6 lg:right-8">
        <UserMenu />
      </div>

      {/* Site Logo placeholder */}
      <div className="mt-6 mb-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-400">
          <span className="text-xs font-medium text-slate-600">LOGO</span>
        </div>
      </div>

      {/* Main navigation centered at bottom */}
      <div className="flex items-center justify-center space-x-8 pb-4">
        <div className="flex items-center space-x-8">
          <div
            className="relative"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
            data-dropdown="coin-cabinet"
          >
            <button
              onClick={handleCoinCabinetClick}
              onKeyDown={handleKeyDown}
              className={cn(
                "inline-flex items-center border-b-2 px-1 pt-1 text-base font-normal transition-colors duration-200",
                isActive
                  ? "border-transparent text-slate-500"
                  : "hover:border-primary/50 border-transparent text-slate-300 hover:text-slate-500",
              )}
              aria-expanded={isDropdownOpen}
              aria-haspopup="menu"
              aria-label="Coin Cabinet menu"
              id="coin-cabinet-button"
            >
              Coin Cabinet
              <ChevronDown
                className={cn(
                  "ml-1 h-3 w-3 transition-transform duration-200",
                  isDropdownOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            {isDropdownOpen && (
              <div
                className="somnus-card absolute top-full left-0 z-50 -mt-0.5 min-w-max pt-0.5 shadow-lg"
                role="menu"
                aria-labelledby="coin-cabinet-button"
              >
                <div className="flex flex-col gap-1 p-4">
                  {coinCabinetItems.map((item) => (
                    <div key={item.name} className="relative">
                      {item.hasSubmenu ? (
                        <div
                          className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-base font-normal whitespace-nowrap text-slate-300 transition-colors duration-150 hover:bg-amber-500/10 hover:text-amber-300 focus:bg-amber-500/10 focus:text-amber-300 focus:outline-none"
                          onMouseEnter={() =>
                            handleSubmenuEnter(item.name as SubmenuTypes)
                          }
                          onMouseLeave={handleSubmenuLeave}
                          onKeyDown={(e) =>
                            handleSubmenuKeyDown(e, item.name as SubmenuTypes)
                          }
                          onClick={() => {
                            router.push(item.href)
                            setIsDropdownOpen(false)
                          }}
                          role="menuitem"
                          tabIndex={0}
                          aria-haspopup="menu"
                          aria-expanded={openSubmenu === item.name}
                          aria-label={`${item.name} submenu`}
                        >
                          <span>{item.name}</span>
                          <ChevronRight
                            className="h-3 w-3 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                      ) : (
                        <NextLink
                          href={item.href}
                          className="flex items-center justify-between rounded-md px-3 py-2 text-base font-normal whitespace-nowrap text-slate-300 transition-colors duration-150 hover:bg-amber-500/10 hover:text-amber-300 focus:bg-amber-500/10 focus:text-amber-300 focus:outline-none"
                          onClick={() => setIsDropdownOpen(false)}
                          role="menuitem"
                          tabIndex={0}
                        >
                          <span>{item.name}</span>
                        </NextLink>
                      )}

                      {item.hasSubmenu && openSubmenu === item.name && (
                        <div
                          className="somnus-card absolute top-0 left-full z-60 ml-1 min-w-max shadow-lg"
                          onMouseEnter={() =>
                            handleSubmenuEnter(item.name as SubmenuTypes)
                          }
                          onMouseLeave={handleSubmenuLeave}
                          role="menu"
                          aria-label={`${item.name} submenu`}
                        >
                          <div className="flex flex-col gap-1 p-4">
                            {getSubmenuItems(item.name).map((submenuItem) => (
                              <div
                                key={submenuItem.name}
                                className="block cursor-pointer rounded-md px-3 py-2 text-base font-normal whitespace-nowrap text-slate-300 transition-colors duration-150 hover:bg-amber-500/10 hover:text-amber-300 focus:bg-amber-500/10 focus:text-amber-300 focus:outline-none"
                                onClick={() => {
                                  router.push(submenuItem.href)
                                  setIsDropdownOpen(false)
                                  setOpenSubmenu(null)
                                }}
                                onKeyDown={(e) =>
                                  handleSubmenuItemKeyDown(e, submenuItem.href)
                                }
                                role="menuitem"
                                tabIndex={0}
                              >
                                {submenuItem.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {visibleNavItems.map((item) => {
            const itemIsActive = pathname === item.href

            if (item.hasSubmenu) {
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() =>
                    handleSubmenuEnter(item.name as SubmenuTypes)
                  }
                  onMouseLeave={handleSubmenuLeave}
                >
                  <button
                    onClick={() => router.push(item.href)}
                    className={cn(
                      "inline-flex items-center border-b-2 px-1 pt-1 text-base font-normal transition-colors duration-200",
                      itemIsActive
                        ? "border-transparent text-slate-500"
                        : "hover:border-primary/50 border-transparent text-slate-300 hover:text-slate-500",
                    )}
                    aria-expanded={openSubmenu === item.name}
                    aria-haspopup="menu"
                  >
                    {item.name}
                    <ChevronDown
                      className={cn(
                        "ml-1 h-3 w-3 transition-transform duration-200",
                        openSubmenu === item.name && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {openSubmenu === item.name && (
                    <div
                      className="somnus-card absolute top-full left-0 z-50 -mt-0.5 min-w-max pt-0.5 shadow-lg"
                      role="menu"
                    >
                      <div className="flex flex-col gap-1 p-4">
                        {getMainSubmenuItems(item.name).map((submenuItem) => (
                          <div
                            key={submenuItem.name}
                            className="block cursor-pointer rounded-md px-3 py-2 text-base font-normal whitespace-nowrap text-slate-300 transition-colors duration-150 hover:bg-amber-500/10 hover:text-amber-300 focus:bg-amber-500/10 focus:text-amber-300 focus:outline-none"
                            onClick={() => {
                              router.push(submenuItem.href)
                              setOpenSubmenu(null)
                            }}
                            role="menuitem"
                            tabIndex={0}
                          >
                            {submenuItem.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            return (
              <NextLink
                key={item.name}
                href={item.href}
                className={cn(
                  "border-b-2 px-1 pt-1 text-base font-normal transition-colors duration-200",
                  itemIsActive
                    ? "border-transparent text-slate-500"
                    : "hover:border-primary/50 border-transparent text-slate-300 hover:text-slate-500",
                )}
              >
                {item.name}
              </NextLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
