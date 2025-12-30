"use client"

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "../ui/mobile-sidebar";
import { UserNav } from "../ui/user-nav";
import { SessionProvider } from "next-auth/react";
import { useNotifications } from "@/hooks/connections/useNotifications";
import NotificationPanel from "../NotificationIcon/NotificationPanel";
import { AnimatePresence } from "framer-motion";

export function DashBoardNavbar() {
    // 1. Notification State & Ref
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const { totalNotifications } = useNotifications();

    // 2. Click Outside logic
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notificationRef]);

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-background/95 backdrop-blur px-4 md:px-6">
            <MobileSidebar />

            <div className="ml-auto flex items-center gap-4">
                {/* 3. Wrap Bell and Panel in a relative div */}
                <div className="relative" ref={notificationRef}>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="relative rounded-full"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell className="h-5 w-5" />
                        {totalNotifications > 0 && (
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
                        )}
                    </Button>

                    {/* 4. Notification Panel with Animation */}
                    <AnimatePresence>
                        {showNotifications && (
                            <div className="absolute right-0 mt-2">
                                <NotificationPanel
                                    isOpen={showNotifications}
                                    onClose={() => setShowNotifications(false)}
                                />
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-8 w-px bg-border" />
                
                <SessionProvider>
                    <UserNav />
                </SessionProvider>
            </div>
        </header>
    );
}