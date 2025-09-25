"use client";
import { NextLink as Link } from "./Link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import NextLink from "next/link";
import {
  coinCabinetItems,
  setsSubmenu,
  romanSubmenu,
  simpleTopLevel,
  type SubmenuTypes,
} from "./navigation-schema";
import { UserMenu } from "~/components/auth/UserMenu";

const HOVER_DELAY = 200; // milliseconds
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<SubmenuTypes | null>(null);
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCoinCabinetClick = () => {
    router.push("/coin-cabinet");
    setIsDropdownOpen(false);
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
      setOpenSubmenu(null); // Also close submenu when main dropdown closes
    }, HOVER_DELAY);
  };

  const handleSubmenuEnter = (itemName: SubmenuTypes) => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
    setOpenSubmenu(itemName);
  };

  const handleSubmenuLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setOpenSubmenu(null);
    }, HOVER_DELAY);
  };

  // Keyboard navigation handlers
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        setIsDropdownOpen(false);
        setOpenSubmenu(null);
        break;
      case "ArrowDown":
        if (!isDropdownOpen) {
          event.preventDefault();
          setIsDropdownOpen(true);
        }
        break;
      case "ArrowUp":
        if (isDropdownOpen) {
          event.preventDefault();
          setIsDropdownOpen(false);
          setOpenSubmenu(null);
        }
        break;
    }
  };

  const handleSubmenuKeyDown = (
    event: React.KeyboardEvent,
    itemName: SubmenuTypes,
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        setOpenSubmenu(itemName);
        break;
      case "ArrowRight":
        event.preventDefault();
        setOpenSubmenu(itemName);
        break;
      case "ArrowLeft":
        if (openSubmenu === itemName) {
          event.preventDefault();
          setOpenSubmenu(null);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        setOpenSubmenu(null);
        break;
    }
  };

  const handleSubmenuItemKeyDown = (
    event: React.KeyboardEvent,
    href: string,
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        router.push(href);
        setIsDropdownOpen(false);
        setOpenSubmenu(null);
        break;
      case "Escape":
        setIsDropdownOpen(false);
        setOpenSubmenu(null);
        break;
    }
  };

  // Helper function to get the appropriate submenu items
  const getSubmenuItems = (itemName: string) => {
    switch (itemName) {
      case "Sets":
        return setsSubmenu;
      case "Roman":
        return romanSubmenu;
      default:
        return [];
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown="coin-cabinet"]')) {
        setIsDropdownOpen(false);
        setOpenSubmenu(null);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setOpenSubmenu(null);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isDropdownOpen]);

  const isActive = pathname.startsWith("/coin-cabinet");

  return (
    <nav
      className="flex h-16 items-center justify-between space-x-8 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center space-x-8">
      {simpleTopLevel.map((item) => {
        const itemIsActive = pathname === item.href;
        return (
          <Link key={item.name} href={item.href} isActive={itemIsActive}>
            {item.name}
          </Link>
        );
      })}

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
            "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200",
            isActive
              ? "border-purple-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
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
            className="absolute top-full left-0 z-50 -mt-0.5 min-w-max rounded-md border bg-white pt-0.5 shadow-lg"
            role="menu"
            aria-labelledby="coin-cabinet-button"
          >
            <div className="flex flex-col gap-1 p-4">
              {coinCabinetItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasSubmenu ? (
                    <div
                      className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 focus:outline-none"
                      onMouseEnter={() =>
                        handleSubmenuEnter(item.name as SubmenuTypes)
                      }
                      onMouseLeave={handleSubmenuLeave}
                      onKeyDown={(e) =>
                        handleSubmenuKeyDown(e, item.name as SubmenuTypes)
                      }
                      onClick={() => {
                        router.push(item.href);
                        setIsDropdownOpen(false);
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
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 focus:outline-none"
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <span>{item.name}</span>
                    </NextLink>
                  )}

                  {item.hasSubmenu && openSubmenu === item.name && (
                    <div
                      className="absolute top-0 left-full z-60 ml-1 min-w-max rounded-md border bg-white shadow-lg"
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
                            className="block cursor-pointer rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 focus:outline-none"
                            onClick={() => {
                              router.push(submenuItem.href);
                              setIsDropdownOpen(false);
                              setOpenSubmenu(null);
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
      </div>
      
      <UserMenu />
    </nav>
  );
}
