"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  UserCog,
  BarChart3,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Content", href: "/admin/content", icon: FileText },
  { label: "Users", href: "/admin/users", icon: UserCog },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatarColor: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] bg-sip-bg-secondary flex flex-col h-full border-r border-sip-border-subtle">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <Image
          src="/images/sip-logo-black.png"
          alt="SIP"
          width={40}
          height={40}
          className="invert brightness-200"
        />
        <span className="bg-sip-amber text-sip-bg-primary text-[10px] font-bold px-2 py-0.5 rounded">
          ADMIN
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-sip-amber/10 text-sip-amber font-medium"
                  : "text-sip-text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-sip-border-subtle">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-white"
            style={{ backgroundColor: user.avatarColor }}
          >
            {getInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-sip-text-muted truncate">
              {user.role.replace("_", " ")}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sip-text-muted hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
