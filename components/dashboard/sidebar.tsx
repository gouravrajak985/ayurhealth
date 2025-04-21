"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, LineChart, Home, Settings } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  
  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      label: "Tracker",
      href: "/tracker",
      icon: LineChart,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];
  
  return (
    <div className={cn("flex flex-col h-full bg-card text-card-foreground", className)}>
      <div className="py-6 space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all hover:text-primary",
                  (pathname === item.href || 
                   (item.href === "/chat" && pathname.startsWith("/chat/")) ||
                   (item.href === "/tracker" && pathname.startsWith("/tracker/")))
                    ? "bg-accent text-accent-foreground"
                    : "opacity-70"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}