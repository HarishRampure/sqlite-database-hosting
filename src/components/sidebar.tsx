"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, Users, Package, Factory, ShoppingCart, Wallet, CreditCard, FileText } from "lucide-react"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Production Flow",
    href: "/production",
    icon: Factory,
  },
  {
    title: "Sales & Collection",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Financial Resources",
    href: "/financial",
    icon: Wallet,
  },
  {
    title: "Expenses",
    href: "/expenses",
    icon: CreditCard,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-white lg:block dark:bg-white">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4 bg-white dark:bg-gray-100">
          <Link className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-700" href="/">
            <Package className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            <span className="">Voise Chem's IMS</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {sidebarNavItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-700 dark:hover:bg-gray-300",
                    pathname === item.href ? "bg-gray-200 dark:bg-gray-300" : "transparent",
                    "transition-all",
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-500" />
                  <span>{item.title}</span>
                </span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}
