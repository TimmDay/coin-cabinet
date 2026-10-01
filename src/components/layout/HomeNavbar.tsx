"use client"
import { ChevronDown, ChevronRight } from "lucide-react"
import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTypedFeatureFlag } from "~/lib/hooks/useFeatureFlag"
import { useFeatureFlagQuery } from "~/lib/hooks/useFeatureFlagQuery"
import { cn } from "~/lib/utils"
import { MobileNavigation } from "./MobileNavigation"
import {
  articlesSubmenu,
  cabinetRomanSubmenu,
  cabinetSubmenu,
  navigationItems,
  type SubmenuTypes,
} from "./navigation-schema"

const HOVER_DELAY = 200 // milliseconds

export default function HomeNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isDevMode = useTypedFeatureFlag("dev")
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
      setOpenSubmenu(null)
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

  const handleKeyDown = (event: React.KeyboardEvent, itemName: string) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault()
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
        if (openMainDropdown !== itemName) {
          setOpenMainDropdown(itemName)
        }
        break
      case "ArrowUp":
        event.preventDefault()
        if (openMainDropdown !== itemName) {
          setOpenMainDropdown(itemName)
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

  const getNestedSubmenuItems = (submenuType: SubmenuTypes) => {
    switch (submenuType) {
      case "cabinetRoman":
        return cabinetRomanSubmenu
      default:
        return []
    }
  }

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

  const visibleNavItems = navigationItems.filter((item) => {
    if (item.name === "Map" || item.name === "Feature Flags") {
      return isDevMode
    }
    if (item.name === "Articles") {
      return isArticlesMode
    }
    return true
  })

  return (
    <nav
      className="somnus-nav-home z-overlay relative right-1/2 left-1/2 mr-[-50vw] ml-[-50vw] flex w-screen flex-col items-center justify-center px-4 py-10 sm:px-6 lg:h-auto lg:px-8 lg:py-12"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Mobile navigation burger menu */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 sm:left-6 lg:hidden">
        <MobileNavigation />
      </div>

      {/* Large centered logo, nudged 8px right on desktop for visual alignment */}
      <div className="flex justify-center lg:translate-x-2">
        <NextLink href={withFeatureQuery("/")} className="">
          <div className="flex h-32 w-32 cursor-pointer items-center justify-center lg:h-40 lg:w-40">
            <img
              src="/assets/logo-white.svg"
              alt="Coin Cabinet Logo"
              className="h-full w-full object-contain"
            />
          </div>
        </NextLink>
      </div>

      {/* Centered navigation items */}
      <div className="hidden lg:absolute lg:top-6 lg:right-8 lg:flex lg:items-center">
        <div className="flex flex-wrap items-center justify-center gap-x-8">
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
                      if (e.button === 0) {
                        e.preventDefault()
                        router.push(withFeatureQuery(item.href))
                      }
                    }}
                    onKeyDown={(e) => handleKeyDown(e, item.name)}
                    className={cn(
                      "inline-flex items-center border-b-2 px-1 pt-1 font-display text-base font-normal tracking-widest uppercase transition-colors duration-200",
                      itemIsActive
                        ? "border-bronze text-bronze-light"
                        : "hover:border-bronze/60 text-heading hover:text-bronze-light border-transparent",
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
                      className="bg-dusk border-dusk-edge/60 z-dropdown rounded-lg border absolute top-full right-0 min-w-max shadow-lg"
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
                                className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left font-display text-base font-normal tracking-widest whitespace-nowrap uppercase text-heading transition-colors duration-150 hover:bg-dusk-edge/30 hover:text-bronze-light focus:bg-dusk-edge/30 focus:text-bronze-light focus:outline-none"
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
                                    router.push(withFeatureQuery(submenuItem.href))
                                    setOpenMainDropdown(null)
                                    setOpenSubmenu(null)
                                  }
                                }}
                                aria-haspopup="menu"
                                aria-expanded={
                                  openSubmenu ===
                                  getSubmenuType(submenuItem.name)
                                }
                              >
                                <span>{submenuItem.name}</span>
                                <ChevronRight
                                  className="h-3 w-3 text-bronze"
                                  aria-hidden="true"
                                />
                              </NextLink>
                            ) : (
                              <NextLink
                                href={withFeatureQuery(submenuItem.href)}
                                className="block w-full cursor-pointer rounded-md px-3 py-2 text-left font-display text-base font-normal tracking-widest whitespace-nowrap uppercase text-heading transition-colors duration-150 hover:bg-dusk-edge/30 hover:text-bronze-light focus:bg-dusk-edge/30 focus:text-bronze-light focus:outline-none"
                                onClick={(e) => {
                                  if (e.button === 0) {
                                    e.preventDefault()
                                    router.push(withFeatureQuery(submenuItem.href))
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
                                className="bg-dusk border-dusk-edge/60 z-dropdown rounded-lg border absolute top-0 right-full mr-1 min-w-max shadow-lg"
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
                                        className="block w-full cursor-pointer rounded-md px-3 py-2 text-left font-display text-base font-normal tracking-widest whitespace-nowrap uppercase text-heading transition-colors duration-150 hover:bg-dusk-edge/30 hover:text-bronze-light focus:bg-dusk-edge/30 focus:text-bronze-light focus:outline-none"
                                        onClick={(e) => {
                                          if (e.button === 0) {
                                            e.preventDefault()
                                            router.push(withFeatureQuery(nestedItem.href))
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
                  "border-b-2 px-1 pt-1 font-display text-base font-normal tracking-widest uppercase transition-colors duration-200",
                  itemIsActive
                    ? "border-bronze text-bronze-light"
                    : "hover:border-bronze/60 text-heading hover:text-bronze-light border-transparent",
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
