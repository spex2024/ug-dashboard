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

        const typeMatch = logType === "all" || log.action.toLowerCase().includes(logType.toLowerCase())

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
                return <User className="h-4 w-4 text-[#8B4513] dark:text-gray-300" />
            case "admin":
                return <ShieldCheck className="h-4 w-4 text-[#8B4513] dark:text-gray-300" />
            case "data":
                return <FileText className="h-4 w-4 text-[#8B4513] dark:text-gray-300" />
            case "system":
                return <Clock className="h-4 w-4 text-[#8B4513] dark:text-gray-300" />
            default:
                return null
        }
    }

    const getActionBadge = (type: string) => {
        switch (type) {
            case "added":
                return (
                    <Badge
                        variant="outline"
                        className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30"
                    >
                        <FileText className="h-4 w-4 mr-1.5" /> Added
                    </Badge>
                )
            case "update":
                return (
                    <Badge
                        variant="outline"
                        className="flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-900/30"
                    >
                        <ClipboardList className="h-4 w-4 mr-1.5" /> Updated
                    </Badge>
                )
            case "delete":
                return (
                    <Badge
                        variant="outline"
                        className="flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900/30"
                    >
                        <Clock className="h-4 w-4 mr-1.5" /> Deleted
                    </Badge>
                )
            case "login":
                return (
                    <Badge
                        variant="outline"
                        className="flex items-center px-3 py-1 rounded-full bg-[#8B4513]/10 text-[#8B4513] dark:text-gray-300 border-[#8B4513]/20"
                    >
                        <User className="h-4 w-4 mr-1.5" /> Login
                    </Badge>
                )
            default:
                return (
                    <Badge
                        variant="outline"
                        className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                    >
                        <span>{type}</span>
                    </Badge>
                )
        }
    }

    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513] relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ClipboardList className="h-6 w-6 text-[#8B4513]/50 dark:text-gray-300/50" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#8B4513] dark:text-gray-300">Activity Logs</h1>
                            <p className=" dark:text-gray-400 mt-1">Track all system activities and user actions</p>
                        </div>

                        {/* Search and filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Search logs..."
                                    className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Select value={logType} onValueChange={setLogType}>
                                <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All actions</SelectItem>
                                    <SelectItem value="added">Added</SelectItem>
                                    <SelectItem value="update">Updated</SelectItem>
                                    <SelectItem value="delete">Deleted</SelectItem>
                                    <SelectItem value="login">Login</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg">
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

                    <Card className="border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                        <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4 bg-gray-50 dark:bg-gray-800/30 px-6">
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
                                <Table className="w-full">
                                    <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                                        <TableRow className="border-b border-gray-200 dark:border-gray-700">
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold py-4 px-6 text-left whitespace-nowrap">
                                                Date & Time
                                            </TableHead>
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold py-4 px-6 text-left whitespace-nowrap">
                                                User
                                            </TableHead>
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold py-4 px-6 text-left whitespace-nowrap">
                                                Action
                                            </TableHead>
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold py-4 px-6 text-left whitespace-nowrap">
                                                IP
                                            </TableHead>
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold py-4 px-6 text-left whitespace-nowrap">
                                                Location
                                            </TableHead>
                                            <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold py-4 px-6 text-left whitespace-nowrap">
                                                Operating System
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {filteredLogs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-16 text-[#8B4513]/80 dark:text-gray-500">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <ClipboardList className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                                                        <p>No logs found matching your criteria</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredLogs.map((log, index) => (
                                                <TableRow
                                                    key={log.adminId._id}
                                                    className={`${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/10"} hover:bg-gray-100 dark:hover:bg-gray-800/20 transition-colors`}
                                                >
                                                    <TableCell className="py-4 px-6">
                                                        <div className="flex flex-col">
                              <span className="text-[#8B4513] dark:text-gray-300 font-medium">
                                {formatDate(log.timestamp)}
                              </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatTime(log.timestamp)}
                              </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 px-6">
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 rounded-full bg-[#8B4513]/10 flex items-center justify-center mr-3">
                                                                <User className="h-4 w-4 text-gray-300" />
                                                            </div>
                                                            <span className="font-medium">{log.adminId.fullName}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 px-6">{getActionBadge(log.action)}</TableCell>
                                                    <TableCell className="py-4 px-6 font-mono text-sm">{log.ip}</TableCell>
                                                    <TableCell className="py-4 px-6">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{log.location.country}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {log.location.timezone}
                              </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 px-6 text-sm text-[#8B4513] dark:text-gray-400">
                                                        {log.userAgent}
                                                    </TableCell>
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
