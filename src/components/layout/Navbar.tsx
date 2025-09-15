"use client";
import { NextLink as Link } from "./Link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Main", href: "/" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-16 items-center space-x-8 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.name} href={item.href} isActive={isActive}>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
