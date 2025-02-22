"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/customers"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/customers" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Customers
      </Link>
      <Link
        href="/transactions"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/transactions" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Transactions
      </Link>
      <Link
        href="/reports"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/reports" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Reports
      </Link>
    </nav>
  )
}

