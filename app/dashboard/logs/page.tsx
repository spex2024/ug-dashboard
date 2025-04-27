"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, User, ShieldCheck, FileText, ClipboardList, Search } from "lucide-react"
import { useLogStore } from "@/lib/logs" // Assuming you have a logStore hook
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LogsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [logType, setLogType] = useState("all")
    const [dateRange, setDateRange] = useState("all")

    const { logs, isLoading, fetchLogs } = useLogStore((state) => state) // Fetch logs from the store

    useEffect(() => {
        if (!logs.length) {
            fetchLogs() // Call the fetch function to load logs if they're not already fetched
        }
    }, [fetchLogs])

    // Format date and time
    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatTime = (dateString: string | number | Date) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    }

    // Handle filters
    const filteredLogs = logs.filter((log) => {
        const searchMatch =
            log.adminId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ip.toLowerCase().includes(searchTerm.toLowerCase())

        const typeMatch = logType === "all" || log.action === logType

        let dateMatch = true
        const logDate = new Date(log.timestamp)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (dateRange === "today") {
            dateMatch = logDate.toDateString() === today.toDateString()
        } else if (dateRange === "yesterday") {
            dateMatch = logDate.toDateString() === yesterday.toDateString()
        } else if (dateRange === "week") {
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            dateMatch = logDate >= weekAgo
        }

        return searchMatch && typeMatch && dateMatch
    })

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "auth":
                return <User className="h-4 w-4 text-[#8B4513]" />
            case "admin":
                return <ShieldCheck className="h-4 w-4 text-[#8B4513]" />
            case "data":
                return <FileText className="h-4 w-4 text-[#8B4513]" />
            case "system":
                return <Clock className="h-4 w-4 text-[#8B4513]" />
            default:
                return null
        }
    }

    const getActionBadge = (type: string) => {
        switch (type) {
            case "auth":
                return (
                    <Badge variant="outline" className="bg-[#8B4513]/10 text-[#8B4513] border-[#8B4513]/20">
                        {getTypeIcon(type)} <span className="ml-1">Authentication</span>
                    </Badge>
                )
            case "admin":
                return (
                    <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30"
                    >
                        {getTypeIcon(type)} <span className="ml-1">Admin</span>
                    </Badge>
                )
            case "data":
                return (
                    <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30"
                    >
                        {getTypeIcon(type)} <span className="ml-1">Data</span>
                    </Badge>
                )
            case "system":
                return (
                    <Badge
                        variant="outline"
                        className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30"
                    >
                        {getTypeIcon(type)} <span className="ml-1">System</span>
                    </Badge>
                )
            default:
                return (
                    <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-400 dark:border-gray-700/30"
                    >
                        <span className="ml-1">{type}</span>
                    </Badge>
                )
        }
    }

    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#8B4513] dark:text-[#8B4513]">Activity Logs</h1>
                            <p className=" dark:text-gray-400 mt-1">Track all system activities and user actions</p>
                        </div>

                        {/* Search and filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Search logs..."
                                    className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Select value={logType} onValueChange={setLogType}>
                                <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="auth">Authentication</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="data">Data</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <SelectValue placeholder="Date range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All time</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="yesterday">Yesterday</SelectItem>
                                    <SelectItem value="week">Last 7 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card className="border border-gray-200 dark:border-gray-800 rounded-xl shadow-md bg-white dark:bg-gray-900 overflow-hidden">
                        <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4   ">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <CardTitle className="text-[#8B4513] dark:text-gray-400 flex items-center text-xl font-bold uppercase">
                                    <ClipboardList className="h-5 w-5 mr-2" />
                                    System Activity Logs
                                </CardTitle>
                                <div className="text-sm dark:text-gray-400 text-[#8B4513]">
                                    {filteredLogs.length} {filteredLogs.length === 1 ? "entry" : "entries"} found
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                                        <TableRow>
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">Date & Time</TableHead>
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">User</TableHead>
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">Action</TableHead>
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">IP</TableHead>
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">Location</TableHead>
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">
                                                Operating System
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLogs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-12 text-gray-400 dark:text-gray-400">
                                                    No logs found matching your criteria
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredLogs.map((log, index) => (
                                                <TableRow
                                                    key={log.adminId._id}
                                                    className={`${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/10"} hover:bg-gray-100 dark:hover:bg-gray-800/20 transition-colors`}
                                                >
                                                    <TableCell className="font-medium">
                                                        <div className="text-[#8B4513] dark:text-gray-400">{formatDate(log.timestamp)}</div>
                                                        <div className="text-xs  dark:text-gray-400">{formatTime(log.timestamp)}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{log.adminId.fullName}</div>
                                                    </TableCell>
                                                    <TableCell>{getActionBadge(log.action)}</TableCell>
                                                    <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                                                    <TableCell>
                                                        <div>{log.location.country}</div>
                                                        <div className="text-xs dark:text-gray-400">{log.location.timezone}</div>
                                                    </TableCell>
                                                    <TableCell className="text-sm  dark:text-gray-400">{log.userAgent}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
