"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Box, ClipboardList, Home, Settings, ShoppingCart, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Products",
    icon: Box,
    href: "/products",
    color: "text-violet-500",
  },
  {
    label: "Constraints",
    icon: Settings,
    href: "/constraints",
    color: "text-pink-700",
  },
  {
    label: "Manual Adjustment",
    icon: ClipboardList,
    href: "/manual-adjustment",
    color: "text-emerald-500",
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <span className="text-xl">IntelliStock</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 font-medium hover:bg-accent",
                pathname === route.href ? "bg-accent" : "transparent",
              )}
            >
              <route.icon className={cn("h-5 w-5", route.color)} />
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <ShoppingCart className="h-5 w-5 text-blue-700 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-blue-900 dark:text-blue-400">Pro Version</p>
            <p className="text-xs text-blue-700 dark:text-blue-500">Upgrade for more features</p>
          </div>
        </div>
      </div>
    </div>
  )
}
