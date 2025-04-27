// Define department and role types in a separate file to avoid Next.js export errors

export const departments = [
    "Operations",
    "Watch Room",
    "Safety",
    "Admin",
    "Investigation",
    "Welfare",
    "Accounts",
    "Statistics",
    "Stores",
    "Training",
    "IT",
] as const

export type Department = (typeof departments)[number]

export enum JuniorOfficerRank {
    RFM = "Recruit Fireman",
    RFW = "Recruit Firewoman",
    FM = "Fireman",
    FW = "Firewoman",
    LFM = "Leading Fireman",
    LFW = "Leading Firewoman",
    SUB = "Sub-Officer",
    ASTNO = "Assistant Station Officer",
    AGO = "Acting Group Officer",
    STNO_II = "Station Officer II",
    STNO_I = "Station Officer I",
    DGO = "Divisional Officer",
    GO = "Group Officer",
}

export enum SeniorOfficerRank {
    ADO_II = "Assistant Divisional Officer II",
    ADO_I = "Assistant Divisional Officer I",
    DO_III = "Divisional Officer III",
    DO_II = "Divisional Officer II",
    DO_I = "Divisional Officer I",
    AFCO_II = "Assistant Fire Commander Officer II",
    ACFO_I = "Assistant Chief Fire Officer I",
    DCFO = "Deputy Chief Fire Officer",
}

export const adminRoles = ["admin", "stats", "accounts", "operations"] as const
export type AdminRole = (typeof adminRoles)[number]

// Admin interface
export interface Admin {
    _id: string
    fullName: string
    department: Department
    username: string
    role: AdminRole
    createdAt: string
    email?: string
    phone?: string
    rank?: string
    lastLogin?: string | null
}

// Form data interface
export interface FormData {
    fullName: string
    department: Department
    username: string
    password: string
    confirmPassword: string
    role: AdminRole
    email: string
    phone: string
    rank: string
}

// Add a combined ranks array for the rank dropdown
export const allRanks = [...Object.values(JuniorOfficerRank), ...Object.values(SeniorOfficerRank)] as const

export type Rank = (typeof allRanks)[number]
