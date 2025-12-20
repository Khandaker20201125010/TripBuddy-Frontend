"use client";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DashBoardSidebar } from "../dashboard/DashBoardSidebar";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  // ✅ The useEffect is removed. We now handle the close logic via onClick in the sidebar.

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <VisuallyHidden.Root>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Mobile navigation for the user dashboard.
          </SheetDescription>
        </VisuallyHidden.Root>

        <div className="h-full">
          {/* ✅ Pass setOpen(false) to the sidebar to handle closing */}
          <DashBoardSidebar 
            onLinkClick={() => setOpen(false)} 
            className="flex border-none w-full" 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}