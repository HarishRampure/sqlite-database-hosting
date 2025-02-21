"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package, BarChart3, ShoppingCart, DollarSign, FileText, Box } from "lucide-react"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Products",
    href: "/products",
    icon: Box,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Sales",
    href: "/sales",
    icon: DollarSign,
  },
  {
    title: "Purchases",
    href: "/purchases",
    icon: ShoppingCart,
  }
  // {
  //   title: "Transactions",
  //   href: "/transactions",
  //   icon: FileText,
  // },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <ScrollArea className="w-64 border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Voise Chems</h2>
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

