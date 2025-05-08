"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const dashboardPage = "/dashboard";

  const hideNavbarPaths = [
    "/login",
    "/register",
    "/dashboard",
    `${dashboardPage}/bannersdata`,
    `${dashboardPage}/promosdata`,
    `${dashboardPage}/activitiesdata`,
    `${dashboardPage}/transactionsdata`,
    `${dashboardPage}/usersdata`,
  ]; // halaman yang gak mau munculin navbar
  const shouldHideNavbar = hideNavbarPaths.includes(pathname);

  if (shouldHideNavbar) return null;

  return <Navbar />;
}
