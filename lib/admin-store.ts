import { create } from "zustand"
import axios from "axios"
import { Admin } from "@/lib/admin"

const API = process.env.NODE_ENV === 'production'
    ? "https://ug-gnfs-backend.vercel.app/api/admin"  // Production URL on Vercel
    : "http://localhost:8080/api/admin";               // Local development URL




// Define the store state interface
interface AdminStoreState {
    admins: Admin[]
    loading: boolean
    error: string | null
    fetchAdmins: () => Promise<void>
    addAdmin: (adminData: Record<string, unknown>) => Promise<unknown>
    updateAdmin: (id: string, updatedData: Record<string, unknown>) => Promise<unknown>
    deleteAdmin: (id: string) => Promise<void>
}



const useAdminStore = create<AdminStoreState>((set) => ({
    admins: [],
    loading: false,
    error: null,

    // Fetch all admins
    fetchAdmins: async () => {
        set({ loading: true, error: null })
        try {
            const res = await axios.get<Admin[]>(`${API}/admins`, {   withCredentials:true})
            set({ admins: res.data, loading: false })
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : axios.isAxiosError(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "Failed to fetch admins"

            set({ error: errorMessage, loading: false })
        }
    },

    // Add new admin
    addAdmin: async (adminData: Record<string, unknown>) => {
        try {
            const res = await axios.post(`${API}/add`, adminData, { withCredentials: true })
            set((state) => ({ admins: [...state.admins, res.data.admin] }))
            return res.data
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : axios.isAxiosError(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "Failed to add admin"

            throw new Error(errorMessage)
        }
    },

    // Update admin
    updateAdmin: async (id: string, updatedData: Record<string, unknown>) => {
        try {
            const res = await axios.put(`${API}/update/${id}`, updatedData, { withCredentials: true })
            set((state) => ({
                admins: state.admins.map((admin) => (admin._id === id ? res.data.admin : admin)),
            }))
            return res.data
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : axios.isAxiosError(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "Failed to update admin"

            throw new Error(errorMessage)
        }
    },

    // Delete admin
    deleteAdmin: async (id: string) => {
        try {
            await axios.delete(`${API}/delete/${id}`, { withCredentials: true })
            set((state) => ({
                admins: state.admins.filter((admin) => admin._id !== id),
            }))
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : axios.isAxiosError(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "Failed to delete admin"

            throw new Error(errorMessage)
        }
    },
}))

export default useAdminStore
