"use client"

import { ArrowLeft, ChevronRight, Menu, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { UserMenu } from "~/components/auth/UserMenu"
import { useAuth } from "~/components/providers/auth-provider"
import { useTypedFeatureFlag } from "~/lib/hooks/useFeatureFlag"
import { cn } from "~/lib/utils"
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

type MenuItem = {
  name: string
  href: string
  hasSubmenu?: boolean
}

type MenuLevel = {
  title: string
  items: MenuItem[]
  parentName?: string
}

export function MobileNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const isDevMode = useTypedFeatureFlag("dev")
  const isMapEnabled = useTypedFeatureFlag("map-feature")

  const [isOpen, setIsOpen] = useState(false)
  const [menuStack, setMenuStack] = useState<MenuLevel[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [animatingInIndex, setAnimatingInIndex] = useState<number | null>(null)

  // Mount effect for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Helper functions to get submenu items (same as desktop navbar)
  const getMainSubmenuItems = (itemName: string): MenuItem[] => {
    switch (itemName) {
      case "Cabinet":
        return cabinetSubmenu
      case "Articles":
        return isDevMode
          ? [...articlesSubmenu, ...devArticlesSubmenu]
          : articlesSubmenu
      case "Admin":
        return adminSubmenu
      default:
        return []
    }
  }

  const getNestedSubmenuItems = (submenuType: SubmenuTypes): MenuItem[] => {
    switch (submenuType) {
      case "yearInCoins":
        return yearInCoinsSubmenu
      case "cabinetRoman":
        return cabinetRomanSubmenu
      default:
        return []
    }
  }

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

  // Filter navigation items based on authentication and feature flags
  const visibleNavItems = navigationItems.filter((item) => {
    if (item.name === "Admin") return !!user
    if (item.name === "Map") return isMapEnabled
    return true
  })

  // Initialize with main menu using useMemo to prevent re-creation
  const mainMenu: MenuLevel = useMemo(
    () => ({
      title: "Menu",
      items: visibleNavItems.map((item) => ({
        name: item.name,
        href: item.href,
        hasSubmenu: item.hasSubmenu,
      })),
    }),
    [visibleNavItems],
  )

  // Initialize menu stack on first open
  useEffect(() => {
    if (isOpen && menuStack.length === 0) {
      setMenuStack([mainMenu])
    }
  }, [isOpen, menuStack.length, mainMenu])

  const openMenu = () => {
    setIsOpen(true)
    setMenuStack([mainMenu])
  }

  const closeMenu = () => {
    setIsOpen(false)
    // Clear menu stack after animation completes
    setTimeout(() => {
      setMenuStack([])
    }, 300)
  }

  const navigateToSubmenu = async (item: MenuItem) => {
    if (!item.hasSubmenu) {
      // Navigate to the page and close menu
      router.push(item.href)
      closeMenu()
      return
    }

    let submenuItems: MenuItem[] = []
    const submenuType = getSubmenuType(item.name)

    if (submenuType) {
      submenuItems = getNestedSubmenuItems(submenuType)
    } else {
      submenuItems = getMainSubmenuItems(item.name)
    }

    setIsAnimating(true)

    // Get submenu items...
    const newLevel: MenuLevel = {
      title: item.name,
      items: submenuItems,
      parentName: menuStack[menuStack.length - 1]?.title,
    }

    // Set the new menu index as animating in from the right
    const newMenuIndex = menuStack.length
    setAnimatingInIndex(newMenuIndex)

    // Add to stack (new menu will initially render off-screen to the right)
    setMenuStack((prev) => [...prev, newLevel])

    // Small delay to ensure the new menu is rendered off-screen, then slide it in
    setTimeout(() => {
      setAnimatingInIndex(null)
    }, 50)

    // Reset animation flag after full transition
    setTimeout(() => setIsAnimating(false), 350)
  }

  const goBack = async () => {
    if (menuStack.length <= 1) return

    setIsAnimating(true)
    setMenuStack((prev) => prev.slice(0, -1))

    // Reset animation flag after transition
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleItemClick = (item: MenuItem) => {
    if (item.hasSubmenu) {
      void navigateToSubmenu(item)
    } else {
      router.push(item.href)
      closeMenu()
    }
  }

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const currentMenu = menuStack[menuStack.length - 1]
  const isMainMenu = menuStack.length <= 1

  // Portal content for overlay and menu
  const portalContent = mounted && (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "z-mobile-nav fixed inset-0 bg-black/50 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Slide-in menu */}
      <div
        className={cn(
          "z-mobile-nav fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-slate-900 shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={isMainMenu ? closeMenu : goBack}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
              aria-label={isMainMenu ? "Close navigation" : "Go back"}
              disabled={isAnimating}
            >
              {isMainMenu ? (
                <X className="h-4 w-4" />
              ) : (
                <ArrowLeft className="h-4 w-4" />
              )}
            </button>
            {!isMainMenu && (
              <h2 className="text-lg font-semibold text-slate-100">
                {currentMenu?.title}
              </h2>
            )}
          </div>
        </div>

        {/* Menu content with sliding animation */}
        <div className="relative h-full overflow-hidden">
          {menuStack.map((menu, index) => {
            const isCurrentMenu = index === menuStack.length - 1
            const isAnimatingIn = animatingInIndex === index

            // Determine position and opacity based on menu level and animation state
            let transformClass = ""
            let opacityClass = ""

            if (isCurrentMenu) {
              // Current menu: slide in from right if it's a new submenu
              transformClass = isAnimatingIn
                ? "translate-x-full"
                : "translate-x-0"
              opacityClass = isAnimatingIn ? "opacity-0" : "opacity-100"
            } else {
              // All non-current menus: slide completely off to the left
              transformClass = "-translate-x-full"
              opacityClass = "opacity-0"
            }
            return (
              <div
                key={`${menu.title}-${index}`}
                className={cn(
                  "absolute top-0 left-0 h-full w-full transition-all duration-300 ease-out",
                  transformClass,
                  opacityClass,
                )}
                data-opacity={
                  index === menuStack.length - 1 ? "full" : "partial"
                }
              >
                <nav className="space-y-1 p-4" role="navigation">
                  {menu.items.map((item) => {
                    const isActive = pathname === item.href

                    return (
                      <button
                        key={item.name}
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors duration-200",
                          isActive
                            ? "bg-amber-500/20 text-amber-300"
                            : "text-slate-300 hover:bg-slate-800 hover:text-slate-100",
                        )}
                        disabled={isAnimating}
                      >
                        <span className="font-medium">{item.name}</span>
                        {item.hasSubmenu && (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>
            )
          })}
        </div>

        {/* Footer with user menu - only show on main menu */}
        {isMainMenu && (
          <div className="absolute right-0 bottom-0 left-0 border-t border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Account</span>
              <UserMenu />
            </div>
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile burger button - only show on mobile */}
      <button
        onClick={openMenu}
        className="flex items-center justify-center p-2 text-slate-300 hover:text-slate-100 lg:hidden"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Portal the overlay and menu to document.body */}
      {mounted &&
        typeof window !== "undefined" &&
        createPortal(portalContent, document.body)}
    </>
  )
}
