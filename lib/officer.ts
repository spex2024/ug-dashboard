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
    [key: string]: unknown
}

export type OfficerStore = {
    officers: Officer[]
    loading: boolean
    error: string | null
    fetchOfficers: () => void
    updateOfficer: (id: string, data: Partial<Officer>) => void
    deleteOfficer: (id: string) => void
}

const API_URL = process.env.NODE_ENV === 'production'
    ? "https://ug-gnfs-backend.vercel.app"  // Production URL
    : "http://localhost:8080";               // Local development URL

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});


export const useOfficerStore = create<OfficerStore>((set, get) => ({
    officers: [],
    loading: false,
    error: null,

    fetchOfficers: async () => {
        set({ loading: true })
        try {
            const res = await api.get("/api/employee/getAll")
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
            await api.put(`/api/employee/update/${id}`, data)
            const updated = get().officers.map((off) => (off._id === id ? { ...off, ...data } : off))
            set({ officers: updated, error: null })
        } catch (error) {
            if (error instanceof AxiosError) {
                set({
                    error: error?.response?.data?.message || error?.message || "An error occurred",
                })
            } else if (error instanceof Error) {
                set({
                    error: error.message || "An error occurred",
                })
            } else {
                set({
                    error: "An unknown error occurred",
                })
            }
        }
    },

    deleteOfficer: async (id) => {
        try {
            await api.delete(`/api/employee/delete/${id}`)
            set({ officers: get().officers.filter((off) => off._id !== id), error: null })
        } catch (error) {
            if (error instanceof AxiosError) {
                set({
                    error: error?.response?.data?.message || error?.message || "An error occurred",
                })
            } else if (error instanceof Error) {
                set({
                    error: error.message || "An error occurred",
                })
            } else {
                set({
                    error: "An unknown error occurred",
                })
            }
        }
    },
}))
