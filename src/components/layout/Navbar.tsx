"use client";
import { NextLink as Link } from "./Link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
  { name: "Constantinian Family", href: "/coin-cabinet/sets/constantinian-family" },
  { name: "From Hoards", href: "/coin-cabinet/sets/from-hoards" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const handleCoinCabinetClick = () => {
    router.push("/coin-cabinet");
    setIsDropdownOpen(false);
  };

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
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button
          onClick={handleCoinCabinetClick}
          className={cn(
            "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200",
            isActive
              ? "border-purple-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          )}
        >
          Coin Cabinet
          <ChevronDown 
            className={cn(
              "ml-1 h-3 w-3 transition-transform duration-200",
              isDropdownOpen && "rotate-180"
            )} 
          />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute left-0 top-full z-50 w-96 rounded-md border bg-white shadow-lg -mt-0.5 pt-0.5">
            <div className="flex flex-col gap-1 p-4">
              {coinCabinetItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasSubmenu ? (
                    <div
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-150 cursor-pointer"
                      onMouseEnter={() => setIsSubmenuOpen(true)}
                      onMouseLeave={() => setIsSubmenuOpen(false)}
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
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span>{item.name}</span>
                    </NextLink>
                  )}
                  
                  {item.hasSubmenu && isSubmenuOpen && (
                    <div 
                      className="absolute left-full top-0 z-60 ml-1 w-64 rounded-md border bg-white shadow-lg"
                      onMouseEnter={() => setIsSubmenuOpen(true)}
                      onMouseLeave={() => setIsSubmenuOpen(false)}
                    >
                      <div className="flex flex-col gap-1 p-4">
                        {setsSubmenu.map((submenuItem) => (
                          <NextLink
                            key={submenuItem.name}
                            href={submenuItem.href}
                            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-150"
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
