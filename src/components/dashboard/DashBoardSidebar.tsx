"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Map, Settings, 
  LogOut, ChevronLeft, ChevronRight, ShieldCheck, 
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export function DashBoardSidebar({ className, onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const role = session?.user?.role;

  const userMenuItems = [
    { icon: LayoutDashboard, label: "Profile", href: "/dashboard/profile" },
    { icon: Users, label: "Manage Requests", href: "/dashboard/manage-requests" },
    { icon: Map, label: "My Travel Plans", href: "/dashboard/my-travel-plans" },
  ];

  const adminMenuItems = [
    { icon: ShieldCheck, label: "Admin Profile", href: "/adminDashboard/adminProfile" },
    { icon: Users, label: "User Management", href: "/adminDashboard/manage-users" },
    { icon: Map, label: "Manage Travel Plans", href: "/adminDashboard/manage-travel-plans" },
  ];

  const displayedItems = role === "ADMIN" ? adminMenuItems : userMenuItems;

  return (
    <div 
      className={cn(
        "hidden border-r bg-card lg:block h-screen sticky top-0 transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Enhanced Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3 top-12 z-50 flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-md transition-all hover:scale-110 hover:bg-accent",
          "hidden lg:flex" // Only show on desktop
        )}
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-primary" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-primary" />
        )}
      </button>

      <div className="flex flex-col h-full p-4">
        {/* Logo Section */}
       <Link href="/">
        <div className={cn(
          "flex items-center gap-3 px-2 py-4 mb-8 transition-all",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          <div className="gradient-sunset  h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <MapPin className="text-primary-foreground h-5 w-5" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-gradient-sunset">
              TravelBuddy
            </span>
          )}
        </div>
       </Link>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
          {displayedItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={onLinkClick}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 py-6 transition-all duration-200",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary hover:bg-primary/15" 
                    : "text-muted-foreground hover:text-foreground",
                  isCollapsed ? "justify-center px-0" : ""
                )}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", pathname === item.href && "text-primary")} />
                {!isCollapsed && <span className="text-sm font-semibold">{item.label}</span>}
              </Button>
            </Link>
          ))}
          
          <div className="my-4 border-t border-border/50 mx-2" />

         
        </nav>

        {/* Logout Section */}
        <div className="mt-auto pt-4 border-t">
          <Button 
            onClick={() => signOut()}
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors",
              isCollapsed ? "justify-center px-0" : ""
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="text-sm font-bold">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}