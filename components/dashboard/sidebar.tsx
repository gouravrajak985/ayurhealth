"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, LineChart, Home, Settings, Leaf } from "lucide-react";
import { ModeToggle } from "@/components/dashboard/mode-toggle";
import { UserButton } from "@clerk/nextjs";

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
    <div className={cn("flex flex-col w-full h-full bg-card", className)}>
      <div className="flex-1 py-6">
      <div className="flex items-center gap-2 ml-3">
          <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-300 text-transparent bg-clip-text">
            AyurHealth.AI
          </span>
        </div>
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = 
              pathname === item.href || 
              (item.href === "/chat" && pathname.startsWith("/chat/")) ||
              (item.href === "/tracker" && pathname.startsWith("/tracker/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
              <ModeToggle />
              <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Mobile Only - Theme Toggle and User Button */}
      <div className="md:hidden p-4 border-t flex items-center gap-3">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}