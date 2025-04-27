"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Users,
    UserRound,
    Building2,
    Shield,
    Heart,
    GraduationCap,
    Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { useOfficerStore } from "@/lib/officer"
import { useEffect } from "react"
import type { Officer } from "@/lib/officer" // Import the Officer type

// Rank enumerations
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
    DO_I = "Assistant Fire Commander Officer II",
    ACFO_I = "Assistant Chief Fire Officer I",
    DCFO = "Deputy Chief Fire Officer",
}

export const departmentList = [
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
] as const

export type Department = (typeof departmentList)[number]

// Update the color constants with the new colors
const COLORS = {
    BROWN: "#8B4513",
    CRIMSON: "#DC143C",
    YELLOW: "#FFD700",
    BLACK: "#000000",
    WHITE: "#FFFFFF",
    BLUE_BLACK: "#0B2559", // Updated to #0B2559
    SEA_BLUE: "#2D94FD", // Updated to #2D94FD
}

// Interface for distribution items
interface DistributionItem {
    name: string
    count: number
    color: string
}

export default function Dashboard() {
    const { officers, fetchOfficers, error } = useOfficerStore()

    useEffect(() => {
        fetchOfficers()
    }, [fetchOfficers])

    // Calculate metrics from officers data
    const metrics = {
        totalStaff: officers.length,
        juniorOfficers: officers.filter((officer) => officer.levelOfficer === "Junior Officer").length,
        seniorOfficers: officers.filter((officer) => officer.levelOfficer === "Senior Officer").length,
        maleCount: officers.filter((officer) => officer.gender === "Male").length,
        femaleCount: officers.filter((officer) => officer.gender === "Female").length,
        staffGrowth: calculateStaffGrowth(officers),
        departmentCount: [...new Set(officers.map((officer) => officer.department as string).filter(Boolean))].length || 10,
        departmentGrowth: 2, // This could be calculated if we had historical data
    }

    // Calculate rank distribution from officers data
    const rankDistribution = calculateRankDistribution(officers)

    // Calculate department distribution from officers data
    const departments = calculateDepartmentDistribution(officers)

    // Calculate marital status distribution
    const maritalStatusDistribution = calculateMaritalStatusDistribution(officers)

    // Calculate qualification distribution
    const qualificationDistribution = calculateQualificationDistribution(officers)

    // Calculate age distribution
    const ageDistribution = calculateAgeDistribution(officers)

    // Sort records by createdAt date (most recent first)
    const sortedRecords = [...officers].sort(
        (a, b) => new Date((b.createdAt as string) || "").getTime() - new Date((a.createdAt as string) || "").getTime(),
    )

    // Format date for display
    const formatDate = (dateString: string | number | Date | undefined) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Calculate total for rank distribution
    const totalRankCount = rankDistribution.reduce((sum, item) => sum + item.count, 0)

    // Calculate total for department distribution
    const totalDeptCount = departments.reduce((sum, item) => sum + item.count, 0)

    // Calculate total for marital status distribution
    const totalMaritalCount = maritalStatusDistribution.reduce((sum, item) => sum + item.count, 0)

    // Calculate total for qualification distribution
    const totalQualificationCount = qualificationDistribution.reduce((sum, item) => sum + item.count, 0)

    // Calculate total for age distribution
    const totalAgeCount = ageDistribution.reduce((sum, item) => sum + item.count, 0)

    // Update the getRankBadgeColor function to use the color constants and apply the color scheme for officers
    function getRankBadgeColor(rank: string | undefined) {
        if (!rank) return "bg-gray-500"

        // Senior officers: Black and White
        if (
            rank.includes("ADO") ||
            rank.includes("DO") ||
            rank.includes("ACFO") ||
            rank.includes("AFCO") ||
            rank.includes("DCFO")
        ) {
            return `bg-[${COLORS.BLACK}] text-[${COLORS.WHITE}]`
        }
        // Junior officers: Blue Black and Sea Blue
        else if (rank.includes("LFM") || rank.includes("LFW") || rank.includes("SUB")) {
            return `bg-[${COLORS.BLUE_BLACK}] text-[${COLORS.WHITE}]`
        } else if (rank === "FM" || rank === "FW" || rank.includes("RFM") || rank.includes("RFW")) {
            return `bg-[${COLORS.SEA_BLUE}] text-[${COLORS.WHITE}]`
        } else {
            return `bg-[${COLORS.BROWN}] text-[${COLORS.WHITE}]`
        }
    }

    // Helper function to calculate staff growth
    function calculateStaffGrowth(officers: Officer[]) {
        // Calculate growth based on officers added in the last month
        const today = new Date()
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(today.getMonth() - 1)

        const recentOfficers = officers.filter((officer) => {
            const createdDate = new Date((officer.createdAt as string) || "")
            return createdDate >= oneMonthAgo && createdDate <= today
        })

        // Calculate percentage of new officers in the last month
        const growthPercentage = officers.length > 0 ? (recentOfficers.length / officers.length) * 100 : 0

        return Number.parseFloat(growthPercentage.toFixed(1))
    }

    // Helper function to calculate rank distribution
    function calculateRankDistribution(officers: Officer[]) {
        const rankCounts: Record<string, { count: number; fullRank: string }> = {}

        officers.forEach((officer) => {
            const rank = officer.rank || "Unknown"
            if (!rankCounts[rank]) {
                rankCounts[rank] = { count: 0, fullRank: (officer.fullRank as string) || rank }
            }
            rankCounts[rank].count++
        })

        // Convert to array and sort by count (descending)
        const rankArray = Object.entries(rankCounts)
            .map(([rank, { count, fullRank }]) => ({ rank, fullRank, count, color: getColorForRank(rank) }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5) // Take top 5 ranks

        return rankArray
    }

    // Helper function to calculate department distribution
    function calculateDepartmentDistribution(officers: Officer[]) {
        const deptCounts: Record<string, number> = {}

        officers.forEach((officer) => {
            const dept = (officer.department as string) || "Unassigned"
            if (!deptCounts[dept]) {
                deptCounts[dept] = 0
            }
            deptCounts[dept]++
        })

        // Convert to array and sort by count (descending)
        const deptArray = Object.entries(deptCounts)
            .map(([name, count], index) => ({
                name,
                count,
                color: getColorForDepartment(index),
            }))
            .sort((a, b) => b.count - a.count)

        return deptArray
    }

    // Helper function to calculate marital status distribution
    function calculateMaritalStatusDistribution(officers: Officer[]): DistributionItem[] {
        const statusCounts: Record<string, number> = {}

        officers.forEach((officer) => {
            const status = officer.maritalStatus || "Unknown"
            if (!statusCounts[status]) {
                statusCounts[status] = 0
            }
            statusCounts[status]++
        })

        // Convert to array and sort by count (descending)
        const statusArray = Object.entries(statusCounts)
            .map(([name, count],) => ({
                name,
                count,
                color: getColorForMaritalStatus(name),
            }))
            .sort((a, b) => b.count - a.count)

        return statusArray
    }

    // Helper function to calculate qualification distribution
    function calculateQualificationDistribution(officers: Officer[]): DistributionItem[] {
        const qualificationCounts: Record<string, number> = {}

        officers.forEach((officer) => {
            const qualification = officer.qualification || "Unknown"
            if (!qualificationCounts[qualification]) {
                qualificationCounts[qualification] = 0
            }
            qualificationCounts[qualification]++
        })

        // Convert to array and sort by count (descending)
        const qualificationArray = Object.entries(qualificationCounts)
            .map(([name, count], index) => ({
                name,
                count,
                color: getColorForQualification(index),
            }))
            .sort((a, b) => b.count - a.count)

        return qualificationArray
    }

    // Helper function to calculate age distribution
    function calculateAgeDistribution(officers: Officer[]): DistributionItem[] {
        const ageRanges = {
            "18-25": { count: 0, color: COLORS.SEA_BLUE },
            "26-35": { count: 0, color: COLORS.CRIMSON },
            "36-45": { count: 0, color: COLORS.YELLOW },
            "46-55": { count: 0, color: COLORS.BROWN },
            "56+": { count: 0, color: COLORS.BLUE_BLACK },
        }

        officers.forEach((officer) => {
            if (!officer.dob) return

            const birthDate = new Date(officer.dob)
            const today = new Date()
            let age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }

            if (age >= 18 && age <= 25) ageRanges["18-25"].count++
            else if (age >= 26 && age <= 35) ageRanges["26-35"].count++
            else if (age >= 36 && age <= 45) ageRanges["36-45"].count++
            else if (age >= 46 && age <= 55) ageRanges["46-55"].count++
            else if (age >= 56) ageRanges["56+"].count++
        })

        // Convert to array format
        return Object.entries(ageRanges)
            .map(([name, { count, color }]) => ({ name, count, color }))
            .filter((item) => item.count > 0)
            .sort((a, b) => b.count - a.count)
    }

    // Update the getColorForRank function to use the color constants
    function getColorForRank(rank: string) {
        if (rank.includes("LFM") || rank.includes("LFW")) return COLORS.CRIMSON
        if (rank.includes("SUB")) return COLORS.BROWN
        if (rank.includes("ADO")) return COLORS.YELLOW
        if (rank.includes("DO")) return COLORS.SEA_BLUE
        if (rank.includes("DCFO")) return COLORS.BLUE_BLACK

        // Fallback to a color from our palette
        return COLORS.BROWN
    }

    // Update the getColorForDepartment function to use the color constants
    function getColorForDepartment(index: number) {
        const colors = [COLORS.CRIMSON, COLORS.BROWN, COLORS.YELLOW, COLORS.SEA_BLUE, COLORS.BLUE_BLACK]
        return colors[index % colors.length]
    }

    // Update the getColorForMaritalStatus function to use the color constants
    function getColorForMaritalStatus(status: string) {
        switch (status.toLowerCase()) {
            case "single":
                return COLORS.SEA_BLUE
            case "married":
                return COLORS.YELLOW
            case "divorced":
                return COLORS.CRIMSON
            case "widowed":
                return COLORS.BLUE_BLACK
            default:
                return COLORS.BROWN
        }
    }

    // Update the getColorForQualification function to use the color constants
    function getColorForQualification(index: number) {
        const colors = [COLORS.CRIMSON, COLORS.BROWN, COLORS.YELLOW, COLORS.SEA_BLUE, COLORS.BLUE_BLACK]
        return colors[index % colors.length]
    }



    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center max-w-md">
                    <div className="text-[#DC143C] text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={() => fetchOfficers()}
                        className="px-4 py-2 bg-[#DC143C] text-white rounded-md hover:bg-[#B01030] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">University of Ghana Fire Station Staff Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Welcome back! Here&#39;s the latest update for your fire station staff.
                    </p>

                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Staff</CardTitle>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#DC143C]/10">
                            <Users className="h-5 w-5 text-[#DC143C]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalStaff}</div>

                    </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Gender Distribution</CardTitle>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#8B4513]/10">
                            <UserRound className="h-5 w-5 text-[#8B4513]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-gray-500 dark:text-gray-400 text-md">Males</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.maleCount}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 dark:text-gray-400 text-md">Females</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.femaleCount}</div>
                            </div>
                        </div>


                    </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Officer Types</CardTitle>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FFD700]/10">
                            <Shield className="h-5 w-5 text-[#FFD700]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-gray-500 dark:text-gray-400 text-md">Senior</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.seniorOfficers}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 dark:text-gray-400 text-md">Junior</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.juniorOfficers}</div>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Departments</CardTitle>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2D94FD]/10">
                            <Building2 className="h-5 w-5 text-[#2D94FD]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.departmentCount}</div>

                    </CardContent>
                </Card>
            </div>

            {/* Recently Added Staff */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recently Added Staff */}
                <div className="lg:col-span-2">
                    <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-gray-900 dark:text-white">Recently Added Staff</CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400">New staff members added to the system</p>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
                                        <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Service No.
                                        </th>
                                        <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400">Rank Level</th>
                                        <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400">Contact</th>
                                        <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Intake/Course
                                        </th>
                                        <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400">Date Added</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sortedRecords.slice(0, 5).map((record, index) => (
                                        <tr
                                            key={record._id}
                                            className={`${
                                                index !== sortedRecords.slice(0, 5).length - 1
                                                    ? "border-b border-gray-100 dark:border-gray-700"
                                                    : ""
                                            } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 uppercase`}
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                                                            record.gender === "Male"
                                                                ? "bg-gradient-to-br from-[#2D94FD] to-[#0B2559]"
                                                                : "bg-gradient-to-br from-[#DC143C] to-[#8B4513]"
                                                        }`}
                                                    >
                                                        {record.firstName?.charAt(0) || ""}
                                                        {record.lastName?.charAt(0) || ""}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {record.firstName} {record.lastName}
                            </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{record.serviceNumber}</td>
                                            <td className="p-4">
                                                <Badge
                                                    className={`${getRankBadgeColor(record.rank)} text-xs font-semibold px-2 py-0.5`}
                                                    title={record.fullRank as string}
                                                >
                                                    {record.levelOfficer || "N/A"}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{record.phoneNumber || "N/A"}</td>
                                            <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                                                {record.mateType || "N/A"}
                                            </td>
                                            <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                                                {formatDate(record.createdAt as string)}
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedRecords.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                                No staff records found.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Distribution Charts */}
                <div className="lg:col-span-1">
                    <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow h-full">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-white">Staff Distribution</CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Breakdown by rank and department</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Rank Distribution */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Rank Distribution</h3>
                                    <div className="space-y-4">
                                        {rankDistribution.length > 0 ? (
                                            rankDistribution.map((item, index) => (
                                                <div key={index} className="space-y-1.5">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white" title={item.fullRank}>
                                {item.rank}
                              </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({Math.round((item.count / totalRankCount) * 100)}%)
                              </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-1.5 rounded-full"
                                                            style={{ width: `${(item.count / totalRankCount) * 100}%`, backgroundColor: item.color }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">No rank data available.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Department Distribution */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Department Distribution</h3>
                                    <div className="space-y-4">
                                        {departments.length > 0 ? (
                                            departments.map((dept, index) => (
                                                <div key={index} className="space-y-1.5">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{dept.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{dept.count}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({Math.round((dept.count / totalDeptCount) * 100)}%)
                              </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-1.5 rounded-full"
                                                            style={{ width: `${(dept.count / totalDeptCount) * 100}%`, backgroundColor: dept.color }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">No department data available.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Marital Status Distribution */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                        <Heart className="h-4 w-4 mr-1 text-[#DC143C]" />
                                        Marital Status
                                    </h3>
                                    <div className="space-y-4">
                                        {maritalStatusDistribution.length > 0 ? (
                                            maritalStatusDistribution.map((item, index) => (
                                                <div key={index} className="space-y-1.5">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({Math.round((item.count / totalMaritalCount) * 100)}%)
                              </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-1.5 rounded-full"
                                                            style={{
                                                                width: `${(item.count / totalMaritalCount) * 100}%`,
                                                                backgroundColor: item.color,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">No marital status data available.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Qualification Distribution */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                        <GraduationCap className="h-4 w-4 mr-1 text-[#8B4513]" />
                                        Qualification
                                    </h3>
                                    <div className="space-y-4">
                                        {qualificationDistribution.length > 0 ? (
                                            qualificationDistribution.map((item, index) => (
                                                <div key={index} className="space-y-1.5">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({Math.round((item.count / totalQualificationCount) * 100)}%)
                              </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-1.5 rounded-full"
                                                            style={{
                                                                width: `${(item.count / totalQualificationCount) * 100}%`,
                                                                backgroundColor: item.color,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">No qualification data available.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Age Distribution */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                        <Clock className="h-4 w-4 mr-1 text-[#FFD700]" />
                                        Age Distribution
                                    </h3>
                                    <div className="space-y-4">
                                        {ageDistribution.length > 0 ? (
                                            ageDistribution.map((item, index) => (
                                                <div key={index} className="space-y-1.5">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({Math.round((item.count / totalAgeCount) * 100)}%)
                              </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-1.5 rounded-full"
                                                            style={{ width: `${(item.count / totalAgeCount) * 100}%`, backgroundColor: item.color }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">No age data available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
