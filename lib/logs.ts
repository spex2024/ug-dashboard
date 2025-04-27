import { create } from 'zustand';
import axios from "axios";

export type Log = {
    adminId: {_id: string; fullName: string};
    username: string;
    action: string;
    ip: string;
    location: { country: string; city: string; ll: [number, number]; timezone: string };
    userAgent: string;
    timestamp: string;
};

export type LogStore = {
    logs: Log[];
    isLoading: boolean;
    error: unknown; // `unknown` type for error
    fetchLogs: () => Promise<void>;
};

// Determine the base URL based on the environment (production or development)
const API_URL = process.env.NODE_ENV === 'production'
    ? "https://ug-gnfs-backend.vercel.app"  // Production URL
    : "http://localhost:8080";               // Local development URL

const uri = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const useLogStore = create<LogStore>((set) => ({
    logs: [],
    isLoading: false,
    error: null,
    fetchLogs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await uri.get("/api/admin/logs"); // Use axios get request here
            set({ logs: response.data, isLoading: false });
        } catch (error: unknown) {
            set({ isLoading: false, error });
        }
    },
}));
