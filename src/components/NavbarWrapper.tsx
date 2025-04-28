"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const hideNavbarPaths = ["/login", "/register"]; // halaman yang gak mau munculin navbar
  const shouldHideNavbar = hideNavbarPaths.includes(pathname);

  if (shouldHideNavbar) return null;

  return <Navbar />;
}
