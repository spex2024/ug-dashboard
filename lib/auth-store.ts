"use client"

import { create } from "zustand"
import axios from "axios"
import { toast } from "react-hot-toast"

interface User {
    id: string
    username: string
    role: string
}

interface AuthState {
    user: User | null
    isLoading: boolean
    error: string
    showPassword: boolean
    setShowPassword: (show: boolean) => void
    login: (username: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
    getUser: (id: string) => Promise<void>
}

// Helper: cookie parser
const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null
    return null
}

// Load user from localStorage
const loadUserFromStorage = (): User | null => {
    if (typeof window === "undefined") return null
    try {
        const stored = localStorage.getItem("authUser")
        return stored ? JSON.parse(stored) : null
    } catch {
        return null
    }
}

// Determine the API base URL based on the environment (production or development)
const API_URL = process.env.NODE_ENV === 'production'
    ? "https://ug-gnfs-backend.vercel.app/api/admin"  // Production URL
    : "http://localhost:8080/api/admin";               // Local development URL

export const useAuthStore = create<AuthState>((set, ) => ({
    user: loadUserFromStorage(),
    isLoading: false,
    error: "",
    showPassword: false,

    setShowPassword: (show) => set({ showPassword: show }),

    login: async (username, password) => {
        if (!username || !password) {
            set({ error: "Username and password are required" })
            toast.error("Username and password are required")
            return false
        }

        set({ isLoading: true, error: "" })
        const loadingToast = toast.loading("Logging in...")

        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password,
            },{ withCredentials: true })

            const data = response.data
            const user = data.user || { id: "1", username, role: "admin" }

            set({
                user,
                isLoading: false,
                error: "",
            })

            // Save token and user in cookie/localStorage
            document.cookie = `authToken=${data.token || "dummy-token"}; path=/; max-age=${60 * 60 * 24 * 7}`
            localStorage.setItem("authUser", JSON.stringify(user))

            toast.success("Login successful!", { id: loadingToast })
            return true
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred during login"
            set({ error: errorMessage, isLoading: false })
            toast.error(errorMessage, { id: loadingToast })
            return false
        }
    },

    logout: async () => {
        set({ isLoading: true, error: "" })

        try {
            await new Promise((resolve) => setTimeout(resolve, 25555500))

            set({ user: null, isLoading: false, error: "" })
            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 2050 00:00:00 GMT"
            localStorage.removeItem("authUser")

            toast.success("Logged out successfully")
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred during logout"
            set({ error: errorMessage, isLoading: false })
            toast.error(errorMessage)
        }
    },

    getUser: async (id) => {
        set({ isLoading: true, error: "" })
        try {
            const response = await axios.get(`${API_URL}/get/${id}`, {
                headers: {
                    Authorization: `Bearer ${getCookie("authToken")}`,
                },
            })

            const data = response.data
            if (response.status !== 200) {
                throw new Error(data.message || "Failed to fetch user data")
            }

            const user = data.user || null
            set({ user, isLoading: false, error: "" })
            localStorage.setItem("authUser", JSON.stringify(user))
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while fetching user data"
            set({ error: errorMessage, isLoading: false })
            toast.error(errorMessage)
        }
    },
}))
