"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LeafIcon,
  LayoutDashboardIcon,
  CalendarCheckIcon,
  UsersIcon,
  ClipboardListIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { signOut } from "@/lib/auth-client"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/requests", label: "Requests", icon: ClipboardListIcon },
  { href: "/appointments", label: "Appointments", icon: CalendarCheckIcon },
  { href: "/clients", label: "Clients", icon: UsersIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 min-h-screen border-r bg-sidebar shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <LeafIcon className="size-5 text-primary" />
        <div>
          <div className="font-semibold text-sm leading-tight">Flow Massage</div>
          <div className="text-xs text-muted-foreground">Admin Dashboard</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground/70 hover:bg-muted hover:text-sidebar-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-muted hover:text-sidebar-foreground transition-colors w-full"
        >
          <LogOutIcon className="size-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
