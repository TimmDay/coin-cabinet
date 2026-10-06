"use client"
import { ChevronDown, ChevronRight } from "lucide-react"
import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTypedFeatureFlag } from "~/lib/hooks/useFeatureFlag"
import { useFeatureFlagQuery } from "~/lib/hooks/useFeatureFlagQuery"
import { cn } from "~/lib/utils"
import {
  articlesSubmenu,
  cabinetRomanSubmenu,
  cabinetSubmenu,
  navigationItems,
  type SubmenuTypes,
} from "./navigation-schema"

const HOVER_DELAY = 200 // milliseconds

type DesktopNavProps = {
  /** Classes for the outer wrapper: where the links sit in the header */
  className: string
  /** Classes for the row of links */
  listClassName: string
  /** Which way dropdowns (and the nested submenu) open from their link */
  openToward?: "right" | "left"
}

/**
 * The desktop navigation links with their dropdown and nested submenu,
 * shared by the standard header (Navbar) and the homepage header
 * (HomeNavbar). The two differ only in where the links sit and which way the
 * menus open, so those come in as props; all the behaviour (hover with a
 * delay, keyboard support, outside click, Escape, feature-flag filtering) is
 * here once.
 */
export function DesktopNav({
  className,
  listClassName,
  openToward = "right",
}: DesktopNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isArticlesMode = useTypedFeatureFlag("articles")
  const withFeatureQuery = useFeatureFlagQuery()
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
        router.push(withFeatureQuery(href))
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
      case "cabinetRoman":
        return cabinetRomanSubmenu
      default:
        return []
    }
  }

  // Helper function to determine submenu type from item name
  const getSubmenuType = (itemName: string): SubmenuTypes | null => {
    switch (itemName) {
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
        return articlesSubmenu
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

  // Filter navigation items based on feature flags
  const visibleNavItems = navigationItems.filter((item) => {
    // "Articles" (and everything under it) is gated by its own flag
    if (item.name === "Articles") {
      return isArticlesMode
    }
    return true
  })

  return (
    <div className={className}>
      <div className={listClassName}>
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
                <NextLink
                  href={withFeatureQuery(item.href)}
                  onClick={(e) => {
                    // Only prevent default for left clicks to allow submenu behavior
                    if (e.button === 0) {
                      e.preventDefault()
                      router.push(withFeatureQuery(item.href))
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, item.name)}
                  className={cn(
                    "font-display inline-flex items-center border-b-2 px-1 pt-1 text-base font-normal tracking-widest uppercase transition-colors duration-200",
                    itemIsActive
                      ? "border-bronze text-bronze-light"
                      : "hover:border-bronze/60 text-ink hover:text-bronze-light border-transparent",
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
                </NextLink>

                {openMainDropdown === item.name && (
                  <div
                    className={`bg-dusk border-dusk-edge/60 z-dropdown absolute top-full ${openToward === "left" ? "right-0" : "left-0"} min-w-max rounded-lg border shadow-lg`}
                    onMouseEnter={() => handleMainDropdownEnter(item.name)}
                    onMouseLeave={handleMainDropdownLeave}
                  >
                    <div className="flex flex-col gap-1 p-4">
                      {getMainSubmenuItems(item.name).map((submenuItem) => (
                        <div key={submenuItem.name} className="relative">
                          {"hasSubmenu" in submenuItem &&
                          submenuItem.hasSubmenu ? (
                            <NextLink
                              href={withFeatureQuery(submenuItem.href)}
                              className="font-display text-ink hover:bg-dusk-edge/30 hover:text-bronze-light focus:bg-dusk-edge/30 focus:text-bronze-light flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-base font-normal tracking-widest whitespace-nowrap uppercase transition-colors duration-150 focus:outline-none"
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
                              onClick={(e) => {
                                if (e.button === 0) {
                                  e.preventDefault()
                                  router.push(
                                    withFeatureQuery(submenuItem.href),
                                  )
                                  setOpenMainDropdown(null)
                                  setOpenSubmenu(null)
                                }
                              }}
                              aria-haspopup="menu"
                              aria-expanded={
                                openSubmenu === getSubmenuType(submenuItem.name)
                              }
                            >
                              <span>{submenuItem.name}</span>
                              <ChevronRight
                                className="text-bronze h-3 w-3"
                                aria-hidden="true"
                              />
                            </NextLink>
                          ) : (
                            <NextLink
                              href={withFeatureQuery(submenuItem.href)}
                              className="font-display text-ink hover:bg-dusk-edge/30 hover:text-bronze-light focus:bg-dusk-edge/30 focus:text-bronze-light block w-full cursor-pointer rounded-md px-3 py-2 text-left text-base font-normal tracking-widest whitespace-nowrap uppercase transition-colors duration-150 focus:outline-none"
                              onClick={(e) => {
                                if (e.button === 0) {
                                  e.preventDefault()
                                  router.push(
                                    withFeatureQuery(submenuItem.href),
                                  )
                                  setOpenMainDropdown(null)
                                  setOpenSubmenu(null)
                                }
                              }}
                              onKeyDown={(e) =>
                                handleSubmenuItemKeyDown(e, submenuItem.href)
                              }
                            >
                              {submenuItem.name}
                            </NextLink>
                          )}

                          {"hasSubmenu" in submenuItem &&
                          submenuItem.hasSubmenu &&
                          getSubmenuType(submenuItem.name) &&
                          openSubmenu === getSubmenuType(submenuItem.name) ? (
                            <div
                              className={`bg-dusk border-dusk-edge/60 z-dropdown absolute top-0 ${openToward === "left" ? "right-full mr-1" : "left-full ml-1"} min-w-max rounded-lg border shadow-lg`}
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
                                    <NextLink
                                      key={nestedItem.name}
                                      href={withFeatureQuery(nestedItem.href)}
                                      className="font-display text-ink hover:bg-dusk-edge/30 hover:text-bronze-light focus:bg-dusk-edge/30 focus:text-bronze-light block w-full cursor-pointer rounded-md px-3 py-2 text-left text-base font-normal tracking-widest whitespace-nowrap uppercase transition-colors duration-150 focus:outline-none"
                                      onClick={(e) => {
                                        if (e.button === 0) {
                                          e.preventDefault()
                                          router.push(
                                            withFeatureQuery(nestedItem.href),
                                          )
                                          setOpenMainDropdown(null)
                                          setOpenSubmenu(null)
                                        }
                                      }}
                                      onKeyDown={(e) =>
                                        handleSubmenuItemKeyDown(
                                          e,
                                          nestedItem.href,
                                        )
                                      }
                                    >
                                      {nestedItem.name}
                                    </NextLink>
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
              href={withFeatureQuery(item.href)}
              className={cn(
                "font-display border-b-2 px-1 pt-1 text-base font-normal tracking-widest uppercase transition-colors duration-200",
                itemIsActive
                  ? "border-bronze text-bronze-light"
                  : "hover:border-bronze/60 text-ink hover:text-bronze-light border-transparent",
              )}
            >
              {item.name}
            </NextLink>
          )
        })}
      </div>
    </div>
  )
}
