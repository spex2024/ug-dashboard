"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardList, Home, Menu, Moon, Search, ShieldCheck, Sun, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Suspense } from "react"
import { UserProfile } from "@/components/features/user-profile"
import { useAuthStore } from "@/lib/auth-store"
import GreetingBell from "@/components/features/greetings"

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [theme, setTheme] = useState<"light" | "dark">("dark")
    const pathname = usePathname()
    const { user } = useAuthStore()

    // Check if a link is active
    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(`${path}/`)
    }

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        document.documentElement.classList.toggle("dark")
        localStorage.setItem("theme", newTheme)
    }

    // Set initial theme - default to dark
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null

        // Always default to dark if no theme is saved
        if (!savedTheme) {
            setTheme("dark")
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            setTheme(savedTheme)
            if (savedTheme === "dark") {
                document.documentElement.classList.add("dark")
            } else {
                document.documentElement.classList.remove("dark")
            }
        }
    }, [])

    // Handle user data persistence
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser && !user) {
            try {
                const parsedUser = JSON.parse(storedUser)
                // Update the auth store with the stored user data
                useAuthStore.setState({ user: parsedUser })
            } catch (error) {
                console.error("Failed to parse stored user data:", error)
            }
        }
    }, [user])

    // Store user data when it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user))
        }
    }, [user])

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-all duration-300">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white dark:bg-gray-900 shadow-lg rounded-r-2xl transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-16 h-12 rounded-full bg-cover bg-center border-2 border-[#FFD700] shadow-md"
                            style={{
                                backgroundImage:
                                    "url('https://res.cloudinary.com/ddwet1dzj/image/upload/v1745603414/samples/gE0ZW3qx_400x400_kyfgdz.jpg')",
                            }}
                        ></div>

                        <h2 className="text-sm font-bold ttext-[#8B4513] dark:text-gray-400 uppercase">
                            University Of Ghana Fire Station
                        </h2>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-5">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-10 py-6 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#E62538] dark:focus:ring-[#FF5A5F] focus:border-transparent"
                        />
                    </div>
                </div>

                <nav className="p-5 space-y-1 uppercase">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
                        Main
                    </p>
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                            isActive("/dashboard") && pathname === "/dashboard"
                                ? "bg-gradient-to-r from-[#C62A38] to-[#D4AF37] dark:from-gray-600 dark:to-gray-700 text-white font-medium shadow-md"
                                : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        <div
                            className={`p-2 rounded-lg ${isActive("/dashboard") && pathname === "/dashboard" ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`}
                        >
                            <Home
                                className={`h-4 w-4 ${isActive("/dashboard") && pathname === "/dashboard" ? "text-white" : "text-[#8B4513] dark:text-gray-400 group-hover:text-[#FFD700]"}`}
                            />
                        </div>
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/dashboard/staff"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                            isActive("/dashboard/staff")
                                ? "bg-gradient-to-r from-[#C62A38] to-[#D4AF37] dark:from-gray-600 dark:to-gray-700 text-white font-medium shadow-md"
                                : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        <div
                            className={`p-2 rounded-lg ${isActive("/dashboard/staff") ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`}
                        >
                            <Users
                                className={`h-4 w-4 ${isActive("/dashboard/staff") ? "text-white" : "text-[#8B4513] dark:text-gray-400 group-hover:text-[#FFD700]"}`}
                            />
                        </div>
                        <span>Staff</span>
                    </Link>

                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-3 mt-8 mb-3">
                        Admin
                    </p>

                    <Link
                        href="/dashboard/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                            isActive("/dashboard/admin")
                                ? "bg-gradient-to-r from-[#C62A38] to-[#D4AF37] dark:from-gray-600 dark:to-gray-700 text-white font-medium shadow-md"
                                : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        <div
                            className={`p-2 rounded-lg ${isActive("/dashboard/admin") ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`}
                        >
                            <ShieldCheck
                                className={`h-4 w-4 ${isActive("/dashboard/admin") ? "text-white" : "text-[#8B4513] dark:text-gray-400 group-hover:text-[#FFD700]"}`}
                            />
                        </div>
                        <span>Admin</span>
                    </Link>
                    <Link
                        href="/dashboard/logs"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                            isActive("/dashboard/logs")
                                ? "bg-gradient-to-r from-[#C62A38] to-[#D4AF37] dark:from-gray-600 dark:to-gray-700  text-white font-medium shadow-md"
                                : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        <div
                            className={`p-2 rounded-lg ${
                                isActive("/dashboard/logs") ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        >
                            <ClipboardList
                                className={`h-4 w-4 ${
                                    isActive("/dashboard/logs")
                                        ? "text-white"
                                        : "text-[#8B4513] dark:text-gray-400 group-hover:text-[#FFD700]"
                                }`}
                            />
                        </div>
                        <span>Activity Logs</span>
                    </Link>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <div className="flex-shrink-0">
                            <UserProfile />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user?.username || "Guest User"}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-between p-4 px-6 md:px-8 lg:px-10">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>

                            {/* Breadcrumbs moved to header */}
                            <div className="flex items-center space-x-2 text-sm">
                                <Link
                                    href="/dashboard"
                                    className="text-[#8B4513] dark:text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 flex items-center"
                                >
                                    <Home className="h-3.5 w-3.5 mr-1" />
                                    Dashboard
                                </Link>

                                {pathname !== "/dashboard" && (
                                    <>
                                        <span className="text-gray-500 dark:text-gray-400">/</span>
                                        {pathname.includes("/dashboard/staff") && (
                                            <Link
                                                href="/dashboard/staff"
                                                className="text-[#8B4513] dark:text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 flex items-center"
                                            >
                                                <Users className="h-3.5 w-3.5 mr-1" />
                                                Staff
                                            </Link>
                                        )}
                                        {pathname.includes("/dashboard/admin") && (
                                            <Link
                                                href="/dashboard/admin"
                                                className="text-[#8B4513] dark:text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 flex items-center"
                                            >
                                                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                                                Admin
                                            </Link>
                                        )}
                                        {pathname.includes("/dashboard/logs") && (
                                            <Link
                                                href="/dashboard/logs"
                                                className="text-[#8B4513] dark:text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 flex items-center"
                                            >
                                                <ClipboardList className="h-3.5 w-3.5 mr-1" />
                                                Activity Logs
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-10">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
                            </Button>
                            <GreetingBell />
                            <div className="hidden md:block">
                                <UserProfile />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950 transition-all duration-300">
                    <div className="max-w-7xl mx-auto">
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E62538] dark:border-[#FF5A5F]"></div>
                                </div>
                            }
                        >
                            {children}
                        </Suspense>
                    </div>
                </main>
            </div>
        </div>
    )
}
