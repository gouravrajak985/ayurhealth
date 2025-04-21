"use client";

import { UserButton } from "@clerk/nextjs";
import { Leaf, Menu } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ModeToggle } from "@/components/dashboard/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Failed to fetch user');
        
        const user = await response.json();
        
        if (user.subscriptionStatus === 'unpaid' && !window.location.pathname.includes('/subscription')) {
          router.push('/subscription');
          toast.error('Please subscribe to access the dashboard');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, [router]);

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 border-b border-border bg-card flex items-center px-4 md:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 pt-10">
              <Sidebar className="border-0" />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-300 text-transparent bg-clip-text">AyurHealth.AI</span>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar className="hidden md:flex md:w-64 md:flex-col border-r" />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}