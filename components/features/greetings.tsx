"use client"

import { useEffect, useState, useRef } from "react"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOfficerStore, type Officer } from "@/lib/officer"
import useAdminStore from "@/lib/admin-store"
import type { Admin } from "@/lib/admin" // Adjust the path to where your types are defined
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

// Type for notification items
type Notification = {
    id: string
    message: string
    timestamp: Date
    read: boolean
    officerId?: string
    adminId?: string
    type: "update" | "create" | "delete"
}

// Storage key for notifications
const STORAGE_KEY = "dashboard_notifications"

const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { message: "Good morning", icon: "🌅" }
    if (hour < 17) return { message: "Good afternoon", icon: "🌞" }
    if (hour < 20) return { message: "Good evening", icon: "🌇" }
    return { message: "Good night", icon: "🌙" }
}

// Helper function to load notifications from localStorage
const loadNotificationsFromStorage = (): Notification[] => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY)
        if (!savedData) return []

        return JSON.parse(savedData).map((n: {timestamp:Date}) => ({
            ...n,
            timestamp: new Date(n.timestamp),
        }))
    } catch (error) {
        console.error("Error loading notifications from storage:", error)
        return []
    }
}

// Helper function to save notifications to localStorage
const saveNotificationsToStorage = (notifications: Notification[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    } catch (error) {
        console.error("Error saving notifications to storage:", error)
    }
}

const GreetingBell = () => {
    const [greeting, setGreeting] = useState({ message: "", icon: "" })
    const [notifications, setNotifications] = useState<Notification[]>([])
    const { officers, fetchOfficers } = useOfficerStore()
    const { admins, fetchAdmins } = useAdminStore()
    const [adminName, setAdminName] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [initialized, setInitialized] = useState(false)

    // Refs to track previous state for comparison
    const prevOfficersRef = useRef<Officer[]>([])
    const prevAdminsRef = useRef<Admin[]>([])
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Set greeting based on time of day
    useEffect(() => {
        const greet = getGreeting()
        setGreeting(greet)
    }, [])

    // Load saved notifications on initial render
    useEffect(() => {
        const savedNotifications = loadNotificationsFromStorage()
        setNotifications(savedNotifications)
        setInitialized(true)
    }, [])

    // Save notifications whenever they change
    useEffect(() => {
        if (initialized) {
            saveNotificationsToStorage(notifications)
        }
    }, [notifications, initialized])

    // Initial data fetch
    useEffect(() => {
        fetchOfficers()
        fetchAdmins()

        // Set up polling for real-time updates
        pollingIntervalRef.current = setInterval(() => {
            fetchOfficers()
            fetchAdmins()
        }, 30000) // Poll every 30 seconds

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
            }
        }
    }, [fetchOfficers, fetchAdmins])

    // Get admin name
    useEffect(() => {
        if (admins && admins.length > 0) {
            // Assuming the current admin is the first one or has some identifier
            const currentAdmin = admins[0]
            setAdminName(currentAdmin?.fullName || "")
        }
    }, [admins])

    // Generate notifications by comparing current and previous officers and admins
    useEffect(() => {
        if (!initialized || !officers || !admins) return

        const newNotifications: Notification[] = []

        // Check for officer updates if officers exist
        if (officers.length > 0) {
            const prevOfficers = prevOfficersRef.current

            // Check for updates and new officers
            officers.forEach((officer) => {
                const prevOfficer = prevOfficers.find((p) => p._id === officer._id)

                if (!prevOfficer) {
                    // New officer created
                    const notificationId = `create-${officer._id}-${Date.now()}`
                    // Check if this notification already exists
                    if (!notifications.some((n) => n.id.startsWith(`create-${officer._id}`))) {
                        newNotifications.push({
                            id: notificationId,
                            message: `New officer added: ${officer.firstName || ""} ${officer.lastName || ""}`,
                            timestamp: new Date(),
                            read: false,
                            officerId: officer._id,
                            type: "create",
                        })
                    }
                } else if (JSON.stringify(prevOfficer) !== JSON.stringify(officer)) {
                    // Officer was updated
                    const notificationId = `update-${officer._id}-${Date.now()}`
                    newNotifications.push({
                        id: notificationId,
                        message: `Officer ${officer.firstName || ""} ${officer.lastName || ""} was updated`,
                        timestamp: new Date(),
                        read: false,
                        officerId: officer._id,
                        type: "update",
                    })
                }
            })

            // Check for deleted officers
            prevOfficers.forEach((prevOfficer) => {
                if (!officers.some((o) => o._id === prevOfficer._id)) {
                    const notificationId = `delete-${prevOfficer._id}-${Date.now()}`
                    newNotifications.push({
                        id: notificationId,
                        message: `Officer ${prevOfficer.firstName || ""} ${prevOfficer.lastName || ""} was removed`,
                        timestamp: new Date(),
                        read: false,
                        officerId: prevOfficer._id,
                        type: "delete",
                    })
                }
            })

            // Update the reference to current officers
            prevOfficersRef.current = [...officers]
        }

        // Check for admin updates if admins exist
        if (admins.length > 0) {
            const prevAdmins = prevAdminsRef.current

            // Check for updates and new admins
            admins.forEach((admin) => {
                const prevAdmin = prevAdmins.find((p) => p._id === admin._id)

                if (!prevAdmin) {
                    // New admin created
                    const notificationId = `create-admin-${admin._id}-${Date.now()}`
                    // Check if this notification already exists
                    if (!notifications.some((n) => n.id.startsWith(`create-admin-${admin._id}`))) {
                        newNotifications.push({
                            id: notificationId,
                            message: `New admin added: ${admin.fullName || ""}`,
                            timestamp: new Date(),
                            read: false,
                            adminId: admin._id,
                            type: "create",
                        })
                    }
                } else if (JSON.stringify(prevAdmin) !== JSON.stringify(admin)) {
                    // Admin was updated
                    const notificationId = `update-admin-${admin._id}-${Date.now()}`
                    newNotifications.push({
                        id: notificationId,
                        message: `Admin ${admin.fullName || ""} was updated`,
                        timestamp: new Date(),
                        read: false,
                        adminId: admin._id,
                        type: "update",
                    })
                }
            })

            // Check for deleted admins
            prevAdmins.forEach((prevAdmin) => {
                if (!admins.some((a) => a._id === prevAdmin._id)) {
                    const notificationId = `delete-admin-${prevAdmin._id}-${Date.now()}`
                    newNotifications.push({
                        id: notificationId,
                        message: `Admin ${prevAdmin.fullName || ""} was removed`,
                        timestamp: new Date(),
                        read: false,
                        adminId: prevAdmin._id,
                        type: "delete",
                    })
                }
            })

            // Update the reference to current admins
            prevAdminsRef.current = [...admins]
        }

        // Only update if we have new notifications
        if (newNotifications.length > 0) {
            // Play notification sound for new notifications
            const audio = new Audio("/notification-sound.mp3")
            audio.play().catch((e) => console.log("Audio play failed:", e))

            setNotifications((prev) => {
                const updated = [...newNotifications, ...prev]
                saveNotificationsToStorage(updated)
                return updated
            })
        }
    }, [officers, admins, initialized, notifications])

    const hasUnreadNotifications = notifications.some((notification) => !notification.read)

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }))
        setNotifications(updatedNotifications)
        saveNotificationsToStorage(updatedNotifications)
    }

    const markAsRead = (id: string) => {
        const updatedNotifications = notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
        )
        setNotifications(updatedNotifications)
        saveNotificationsToStorage(updatedNotifications)
    }

    const formatTime = (date: Date) => {
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 1) return "Just now"
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        return `${diffDays}d ago`
    }

    // Get notification icon based on type
    const getNotificationIcon = (type: Notification["type"]) => {
        switch (type) {
            case "create":
                return "🆕"
            case "update":
                return "🔄"
            case "delete":
                return "🗑️"
            default:
                return "📝"
        }
    }

    return (
        <div className="flex items-center gap-4">
            {/* Greeting Text */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                <span className="text-lg">{greeting.icon}</span>
                <span>
          {greeting.message}, {adminName || "Admin"} 👋
        </span>
            </div>

            {/* Notification Bell with Dropdown */}
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {hasUnreadNotifications && (
                            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
                {notifications.filter((n) => !n.read).length}
              </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between px-4 py-2">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        {hasUnreadNotifications && (
                            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
                                Mark all as read
                            </Button>
                        )}
                    </div>
                    <DropdownMenuSeparator />

                    <ScrollArea className="h-[300px]">
                        {notifications.length > 0 ? (
                            notifications
                                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                                .map((notification) => (
                                    <DropdownMenuItem key={notification.id} className="p-0 focus:bg-transparent">
                                        <div
                                            className={`flex items-start gap-2 w-full p-3 hover:bg-muted cursor-pointer ${
                                                !notification.read ? "bg-muted/50" : ""
                                            }`}
                                        >
                                            <div className="flex-shrink-0 mt-1">
                        <span role="img" aria-label={notification.type}>
                          {getNotificationIcon(notification.type)}
                        </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{notification.message}</p>
                                                <p className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</p>
                                            </div>
                                            {!notification.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        markAsRead(notification.id)
                                                    }}
                                                >
                                                    <Check className="h-4 w-4" />
                                                    <span className="sr-only">Mark as read</span>
                                                </Button>
                                            )}
                                        </div>
                                    </DropdownMenuItem>
                                ))
                        ) : (
                            <div className="py-6 text-center text-sm text-muted-foreground">No notifications</div>
                        )}
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default GreetingBell
