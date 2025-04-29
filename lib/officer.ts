import { create } from "zustand"
import axios, { AxiosError } from "axios"

export type Officer = {
    _id: string
    firstName?: string
    middleName?: string
    lastName?: string
    dob?: string
    levelOfficer?: string
    rank?: string
    department?: string
    appointmentDate?: string
    staffId?: string
    serviceNumber?: string
    mateType?: string
    bankName?: string
    accountNumber?: string
    gender?: string
    qualification?: string
    nationalId?: string
    email?: string
    maritalStatus?: string
    address?: string
    phoneNumber?: string
    emergencyContact?: string
    customQualification?: string
    [key: string]: unknown
}

export type OfficerStore = {
    officers: Officer[]
    loading: boolean
    error: string | null
    fetchOfficers: () => void
    updateOfficer: (id: string, data: Partial<Officer>) => Promise<{ message: string } | undefined>
    deleteOfficer: (id: string) => Promise<{ message: string } | undefined>
}

const API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ug-gnfs-backend.vercel.app" // Production URL
        : "http://localhost:8080" // Local development URL

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

// Helper: cookie parser
const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null
    return null
}

export const useOfficerStore = create<OfficerStore>((set, get) => ({
    officers: [],
    loading: false,
    error: null,

    fetchOfficers: async () => {
        set({ loading: true })
        try {
            const res = await api.get("/api/employee/getAll", {
                headers: {
                    Authorization: `Bearer ${getCookie("authToken")}`,
                },
            })
            set({ officers: res.data, loading: false, error: null })
        } catch (error) {
            if (error instanceof AxiosError) {
                set({
                    error: error?.response?.data?.message || error?.message || "An error occurred",
                    loading: false,
                })
            } else if (error instanceof Error) {
                // This will handle non-Axios errors
                set({
                    error: error.message || "An error occurred",
                    loading: false,
                })
            } else {
                set({ error: "An unknown error occurred", loading: false })
            }
        }
    },

    updateOfficer: async (id, data) => {
        try {
            const response = await api.put(`/api/employee/update/${id}`, data)
            const updated = get().officers.map((off) => (off._id === id ? { ...off, ...data } : off))
            set({ officers: updated, error: null })
            return { message: response.data.message || "Staff updated successfully" }
        } catch (error) {
            let errorMessage = "An unknown error occurred"
            if (error instanceof AxiosError) {
                errorMessage = error?.response?.data?.message || error?.message || "An error occurred"
            } else if (error instanceof Error) {
                errorMessage = error.message || "An error occurred"
            }
            set({ error: errorMessage })
            throw new Error(errorMessage)
        }
    },

    deleteOfficer: async (id) => {
        try {
            const response = await api.delete(`/api/employee/delete/${id}`)
            set({ officers: get().officers.filter((off) => off._id !== id), error: null })
            return { message: response.data.message || "Staff deleted successfully" }
        } catch (error) {
            let errorMessage = "An unknown error occurred"
            if (error instanceof AxiosError) {
                errorMessage = error?.response?.data?.message || error?.message || "An error occurred"
            } else if (error instanceof Error) {
                errorMessage = error.message || "An error occurred"
            }
            set({ error: errorMessage })
            throw new Error(errorMessage)
        }
    },
}))
