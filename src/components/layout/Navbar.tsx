"use client";
import { NextLink as Link } from "./Link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import NextLink from "next/link";

const navigation = [
  { name: "Main", href: "/" },
  { name: "About", href: "/about" },
];

const coinCabinetItems = [
  { name: "Roman", href: "/coin-cabinet/roman" },
  { name: "Greek", href: "/coin-cabinet/greek" },
  { name: "Year in coins", href: "/coin-cabinet/year-in-coins" },
  { name: "Sets", href: "/coin-cabinet/sets", hasSubmenu: true },
  { name: "Ex Collection", href: "/coin-cabinet/ex-collection" },
];

const setsSubmenu = [
  { name: "Severan Period", href: "/coin-cabinet/sets/severan-period" },
  { name: "Imperial Women", href: "/coin-cabinet/sets/imperial-women" },
  { name: "First Tetrachy", href: "/coin-cabinet/sets/first-tetrachy" },
  {
    name: "Constantinian Family",
    href: "/coin-cabinet/sets/constantinian-family",
  },
  { name: "From Hoards", href: "/coin-cabinet/sets/from-hoards" },
];

const HOVER_DELAY = 200; // milliseconds
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
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
      setIsSubmenuOpen(false); // Also close submenu when main dropdown closes
    }, HOVER_DELAY);
  };

  const handleSubmenuEnter = () => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
    setIsSubmenuOpen(true);
  };

  const handleSubmenuLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setIsSubmenuOpen(false);
    }, HOVER_DELAY);
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

  const isActive = pathname.startsWith("/coin-cabinet");

  return (
    <nav className="flex h-16 items-center space-x-8 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {navigation.map((item) => {
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
      >
        <button
          onClick={handleCoinCabinetClick}
          className={cn(
            "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200",
            isActive
              ? "border-purple-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
          )}
        >
          Coin Cabinet
          <ChevronDown
            className={cn(
              "ml-1 h-3 w-3 transition-transform duration-200",
              isDropdownOpen && "rotate-180",
            )}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 z-50 -mt-0.5 min-w-max rounded-md border bg-white pt-0.5 shadow-lg">
            <div className="flex flex-col gap-1 p-4">
              {coinCabinetItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasSubmenu ? (
                    <div
                      className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-900"
                      onMouseEnter={handleSubmenuEnter}
                      onMouseLeave={handleSubmenuLeave}
                      onClick={() => {
                        router.push(item.href);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className="h-3 w-3 text-gray-400" />
                    </div>
                  ) : (
                    <NextLink
                      href={item.href}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-900"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span>{item.name}</span>
                    </NextLink>
                  )}

                  {item.hasSubmenu && isSubmenuOpen && (
                    <div
                      className="absolute top-0 left-full z-60 ml-1 min-w-max rounded-md border bg-white shadow-lg"
                      onMouseEnter={handleSubmenuEnter}
                      onMouseLeave={handleSubmenuLeave}
                    >
                      <div className="flex flex-col gap-1 p-4">
                        {setsSubmenu.map((submenuItem) => (
                          <NextLink
                            key={submenuItem.name}
                            href={submenuItem.href}
                            className="block rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-900"
                            onClick={() => {
                              setIsDropdownOpen(false);
                              setIsSubmenuOpen(false);
                            }}
                          >
                            {submenuItem.name}
                          </NextLink>
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
    </nav>
  );
}
