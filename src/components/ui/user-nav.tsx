"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserNav() {
  const { data: session } = useSession();
  const router = useRouter(); // Add router for navigation

  const handleLogout = async () => {
    try {
      // Sign out and redirect to login page
      await signOut({ 
        callbackUrl: "/login",
        redirect: true // This ensures NextAuth handles the redirect
      });
      
      // Optional: Force a hard redirect if needed
      // window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback redirect
      router.push("/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border">
            <AvatarImage 
              src={session?.user?.image || ""} 
              alt={session?.user?.name || "User"} 
            />
            <AvatarFallback>
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email || "No email"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/">
            <DropdownMenuItem>Home</DropdownMenuItem>
          </Link>
          <Link href="/dashboard/profile">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href="/my-travel-plans">
            <DropdownMenuItem>My Travel Plans</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer focus:text-red-700"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}