"use client"
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "../ui/mobile-sidebar";
import { UserNav } from "../ui/user-nav";
import { SessionProvider } from "next-auth/react";

export function DashBoardNavbar() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-background/95 backdrop-blur px-4 md:px-6">
            <MobileSidebar /> {/* A Sheet component from shadcn for mobile users */}

            <div className="ml-auto flex items-center gap-4">
                <Button variant="outline" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
                </Button>
                <div className="h-8 w-px bg-border" />
                <SessionProvider>
                    <UserNav />
                </SessionProvider> {/* shadcn Avatar + DropdownMenu */}
            </div>
        </header>
    );
}