"use client"
import { usePathname } from "next/navigation"
import HomeNavbar from "./HomeNavbar"
import Navbar from "./Navbar"

export function NavbarSwitch() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return isHomePage ? <HomeNavbar /> : <Navbar />
}
