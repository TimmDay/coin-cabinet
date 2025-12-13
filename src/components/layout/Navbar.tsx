"use client"
import { ChevronDown, ChevronRight } from "lucide-react"
import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { UserMenu } from "~/components/auth/UserMenu"
import { useAuth } from "~/components/providers/auth-provider"
import { useTypedFeatureFlag } from "~/lib/hooks/useFeatureFlag"
import { cn } from "~/lib/utils"
import { MobileNavigation } from "./MobileNavigation"
import {
  adminSubmenu,
  articlesSubmenu,
  cabinetRomanSubmenu,
  cabinetSubmenu,
  devArticlesSubmenu,
  navigationItems,
  yearInCoinsSubmenu,
  type SubmenuTypes,
} from "./navigation-schema"

const HOVER_DELAY = 200 // milliseconds
export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const isDevMode = useTypedFeatureFlag("dev")
  const isMapEnabled = useTypedFeatureFlag("map-feature")
  const [openSubmenu, setOpenSubmenu] = useState<SubmenuTypes | null>(null)
  const [openMainDropdown, setOpenMainDropdown] = useState<string | null>(null)
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mainDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMainDropdownEnter = (itemName: string) => {
    if (mainDropdownTimeoutRef.current) {
      clearTimeout(mainDropdownTimeoutRef.current)
    }
    setOpenMainDropdown(itemName)
  }

  const handleMainDropdownLeave = () => {
    mainDropdownTimeoutRef.current = setTimeout(() => {
      setOpenMainDropdown(null)
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

  // Keyboard navigation handlers for accessibility
  const handleKeyDown = (event: React.KeyboardEvent, itemName: string) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault()
        // Toggle the dropdown open/closed
        if (openMainDropdown === itemName) {
          setOpenMainDropdown(null)
          setOpenSubmenu(null)
        } else {
          setOpenMainDropdown(itemName)
        }
        break
      case "Escape":
        setOpenSubmenu(null)
        setOpenMainDropdown(null)
        break
      case "ArrowDown":
        event.preventDefault()
        // Open dropdown if closed
        if (openMainDropdown !== itemName) {
          setOpenMainDropdown(itemName)
        }
        // Focus on first menu item - implementation would need ref management
        break
      case "ArrowUp":
        event.preventDefault()
        // Open dropdown if closed
        if (openMainDropdown !== itemName) {
          setOpenMainDropdown(itemName)
        }
        // Focus on last menu item - implementation would need ref management
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
        setOpenMainDropdown(null)
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
        setOpenMainDropdown(null)
        setOpenSubmenu(null)
        break
      case "Escape":
        setOpenMainDropdown(null)
        setOpenSubmenu(null)
        break
    }
  }

  // Helper function to get the appropriate submenu items for nested submenus
  const getNestedSubmenuItems = (submenuType: SubmenuTypes) => {
    switch (submenuType) {
      case "yearInCoins":
        return yearInCoinsSubmenu
      case "cabinetRoman":
        return cabinetRomanSubmenu
      default:
        return []
    }
  }

  // Helper function to determine submenu type from item name
  const getSubmenuType = (itemName: string): SubmenuTypes | null => {
    switch (itemName) {
      case "Year in coins":
        return "yearInCoins"
      case "Roman":
        return "cabinetRoman"
      default:
        return null
    }
  }
  const getMainSubmenuItems = (itemName: string) => {
    switch (itemName) {
      case "Cabinet":
        return cabinetSubmenu
      case "Articles":
        // Combine regular articles with dev articles if feature flag is enabled
        return isDevMode
          ? [...articlesSubmenu, ...devArticlesSubmenu]
          : articlesSubmenu
      case "Admin":
        return adminSubmenu
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
      if (mainDropdownTimeoutRef.current) {
        clearTimeout(mainDropdownTimeoutRef.current)
      }
    }
  }, [])

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest("[data-dropdown]")) {
        setOpenMainDropdown(null)
        setOpenSubmenu(null)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMainDropdown(null)
        setOpenSubmenu(null)
      }
    }

    if (openMainDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [openMainDropdown])

  // Filter navigation items based on authentication status and feature flags
  const visibleNavItems = navigationItems.filter((item) => {
    // Only show "Admin" for authenticated users
    if (item.name === "Admin") {
      return !!user
    }
    // Only show "Map" when map feature flag is enabled
    if (item.name === "Map") {
      return isMapEnabled
    }
    return true
  })

  return (
    <nav
      className="somnus-nav z-overlay relative flex h-32 flex-col justify-center px-4 sm:px-6 lg:h-48 lg:justify-end lg:px-8"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Mobile navigation burger menu - vertically centered on mobile */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 sm:left-6 lg:hidden">
        <MobileNavigation />
      </div>

      {/* UserMenu fixed to top right */}
      <div className="absolute top-4 right-4 sm:right-6 lg:right-8">
        <UserMenu />
      </div>

      {/* Site Logo placeholder */}
      <div className="flex justify-center lg:mt-6 lg:mb-6">
        <NextLink href="/" className="transition-opacity hover:opacity-80">
          <div className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-slate-400">
            <span className="text-xs font-medium text-slate-600">LOGO</span>
          </div>
        </NextLink>
      </div>

      {/* Main navigation centered at bottom - hidden on mobile */}
      <div className="hidden items-center justify-center space-x-8 pb-4 lg:flex">
        <div className="flex items-center space-x-8">
          {visibleNavItems.map((item) => {
            const itemIsActive = pathname === item.href

            if (item.hasSubmenu) {
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleMainDropdownEnter(item.name)}
                  onMouseLeave={handleMainDropdownLeave}
                  data-dropdown={item.name.toLowerCase()}
                >
                  <button
                    onClick={() => router.push(item.href)}
                    onKeyDown={(e) => handleKeyDown(e, item.name)}
                    className={cn(
                      "inline-flex items-center border-b-2 px-1 pt-1 text-base font-normal transition-colors duration-200",
                      itemIsActive
                        ? "border-transparent text-slate-500"
                        : "hover:border-primary/50 border-transparent text-slate-300 hover:text-slate-500",
                    )}
                    aria-expanded={openMainDropdown === item.name}
                    aria-haspopup="menu"
                  >
                    {item.name}
                    <ChevronDown
                      className={cn(
                        "ml-1 h-3 w-3 transition-transform duration-200",
                        openMainDropdown === item.name && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {openMainDropdown === item.name && (
                    <div
                      className="somnus-card z-dropdown absolute top-full left-0 min-w-max shadow-lg"
                      onMouseEnter={() => handleMainDropdownEnter(item.name)}
                      onMouseLeave={handleMainDropdownLeave}
                    >
                      <div className="flex flex-col gap-1 p-4">
                        {getMainSubmenuItems(item.name).map((submenuItem) => (
                          <div key={submenuItem.name} className="relative">
                            {"hasSubmenu" in submenuItem &&
                            submenuItem.hasSubmenu ? (
                              <button
                                className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-base font-normal whitespace-nowrap text-slate-300 transition-colors duration-150 hover:bg-amber-500/10 hover:text-amber-300 focus:bg-amber-500/10 focus:text-amber-300 focus:outline-none"
                                onMouseEnter={() => {
                                  const submenuType = getSubmenuType(
                                    submenuItem.name,
                                  )
                                  if (submenuType) {
                                    handleSubmenuEnter(submenuType)
                                  }
                                }}
                                onMouseLeave={handleSubmenuLeave}
                                onKeyDown={(e) => {
                                  const submenuType = getSubmenuType(
                                    submenuItem.name,
                                  )
                                  if (submenuType) {
                                    handleSubmenuKeyDown(e, submenuType)
                                  }
                                }}
                                onClick={() => {
                                  router.push(submenuItem.href)
                                  setOpenMainDropdown(null)
                                  setOpenSubmenu(null)
                                }}
                                aria-haspopup="menu"
                                aria-expanded={
                                  openSubmenu ===
                                  getSubmenuType(submenuItem.name)
                                }
                              >
                                <span>{submenuItem.name}</span>
                                <ChevronRight
                                  className="h-3 w-3 text-gray-400"
                                  aria-hidden="true"
                                />
                              </button>
                            ) : (
                              <button
                                className="block w-full cursor-pointer rounded-md px-3 py-2 text-left text-base font-normal whitespace-nowrap text-slate-300 transition-colors duration-150 hover:bg-amber-500/10 hover:text-amber-300 focus:bg-amber-500/10 focus:text-amber-300 focus:outline-none"
                                onClick={() => {
                                  router.push(submenuItem.href)
                                  setOpenMainDropdown(null)
                                  setOpenSubmenu(null)
                                }}
                                onKeyDown={(e) =>
                                  handleSubmenuItemKeyDown(e, submenuItem.href)
                                }
                              >
                                {submenuItem.name}
                              </button>
                            )}

                            {"hasSubmenu" in submenuItem &&
                            submenuItem.hasSubmenu &&
                            getSubmenuType(submenuItem.name) &&
                            openSubmenu === getSubmenuType(submenuItem.name) ? (
                              <div
                                className="somnus-card z-dropdown absolute top-0 left-full ml-1 min-w-max shadow-lg"
                                onMouseEnter={() => {
                                  const submenuType = getSubmenuType(
                                    submenuItem.name,
                                  )
                                  if (submenuType) {
                                    handleSubmenuEnter(submenuType)
                                  }
                                }}
                                onMouseLeave={handleSubmenuLeave}
                                aria-label={`${submenuItem.name} submenu`}
                              >
                                <div className="flex flex-col gap-1 p-4">
                                  {getNestedSubmenuItems(openSubmenu!).map(
                                    (nestedItem) => (
                                      <button
                                        key={nestedItem.name}
                                        className="block w-full cursor-pointer rounded-md px-3 py-2 text-left text-base font-normal whitespace-nowrap text-slate-300 transition-colors duration-150 hover:bg-amber-500/10 hover:text-amber-300 focus:bg-amber-500/10 focus:text-amber-300 focus:outline-none"
                                        onClick={() => {
                                          router.push(nestedItem.href)
                                          setOpenMainDropdown(null)
                                          setOpenSubmenu(null)
                                        }}
                                        onKeyDown={(e) =>
                                          handleSubmenuItemKeyDown(
                                            e,
                                            nestedItem.href,
                                          )
                                        }
                                      >
                                        {nestedItem.name}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            ) : null}
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
