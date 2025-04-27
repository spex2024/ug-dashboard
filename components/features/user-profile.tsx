"use client"

import { useState } from "react"
import { LogOut, User } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

// Default user data to ensure profile always displays
const defaultUser = {
    username: "Guest User",
    role: "guest",
    id: "guest",
}

export function UserProfile() {
    const { user, logout, isLoading } = useAuthStore()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const router = useRouter()

    // Use auth store user or fall back to default
    const displayUser = user || defaultUser

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await logout()
        setIsLoggingOut(false)
        router.push("/login")
    }

    // Get initials from username
    const initials = displayUser.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" alt={displayUser.username} />
                        <AvatarFallback className="bg-[#8B4513] dark:text-gray-700 text-white dark:bg-white border-2 border-gray-950 dark:border-gray-700" >
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DC143C]">
                        <span className="text-xs font-medium text-white">{initials}</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{displayUser.username}</p>
                        <p className="text-xs font-medium">
                            {displayUser.role.charAt(0).toUpperCase() + displayUser.role.slice(1)}
                        </p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                {user && (
                    <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={isLoggingOut || isLoading}
                        className="text-[#DC143C] focus:bg-[#DC143C]/10"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
