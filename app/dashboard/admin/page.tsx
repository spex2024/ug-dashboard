"use client"

import {useState, useEffect, JSX} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Loader2,
    Save,
    Eye,
    Shield,
    UserCog,
    AlertCircle,
    Calendar,
    User,
    Key,
    Mail,
    Phone,
    Award,
} from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import useAdminStore from "@/lib/admin-store"
import {
    departments,
    adminRoles,
    JuniorOfficerRank,
    SeniorOfficerRank,
    type Admin,
    type FormData,
    type Department,
    type AdminRole,
} from "@/lib/admin"
import type React from "react"
import { toast, Toaster } from "react-hot-toast"

export default function AdminPage() {
    // State for dialogs
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)

    // Get admin store state and actions
    const { admins, loading, error, fetchAdmins, addAdmin, updateAdmin, deleteAdmin } = useAdminStore()

    // Form state
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        department: departments[0],
        username: "",
        password: "",
        confirmPassword: "",
        role: "admin", // Default role
        email: "",
        phone: "",
        rank: Object.values(JuniorOfficerRank)[0],
    })

    // Fetch admins on component mount
    useEffect(() => {
        fetchAdmins()
    }, [fetchAdmins])

    // Format date for display
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Format date with time for display
    const formatDateTime = (dateString: string): string => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Handle admin deletion
    const handleDeleteAdmin = async (adminId: string): Promise<void> => {
        try {
            await deleteAdmin(adminId)
            toast.success("The administrator has been successfully deleted.", {
                style: {
                    border: "1px solid #8B4513",
                    padding: "16px",
                    color: "#8B4513",
                },
                iconTheme: {
                    primary: "#8B4513",
                    secondary: "#FFFAEE",
                },
            })
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error: ${error.message}`, {
                    style: {
                        border: "1px solid #DC143C",
                        padding: "16px",
                        color: "#DC143C",
                    },
                })
            } else {
                toast.error("An unknown error occurred", {
                    style: {
                        border: "1px solid #DC143C",
                        padding: "16px",
                        color: "#DC143C",
                    },
                })
            }
        }
    }

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Handle select change for department
    const handleDepartmentChange = (value: string): void => {
        // Validate that the value is a valid department
        if (departments.includes(value as Department)) {
            setFormData((prev) => ({ ...prev, department: value as Department }))
        }
    }

    // Handle select change for role
    const handleRoleChange = (value: string): void => {
        // Validate that the value is a valid role
        if (adminRoles.includes(value as AdminRole)) {
            setFormData((prev) => ({ ...prev, role: value as AdminRole }))
        }
    }

    // Handle select change for rank
    const handleRankChange = (value: string): void => {
        setFormData((prev) => ({ ...prev, rank: value }))
    }

    // Handle form submission for adding new admin
    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match. Please try again.", {
                style: {
                    border: "1px solid #DC143C",
                    padding: "16px",
                    color: "#DC143C",
                },
            })
            return
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formData.email && !emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address.", {
                style: {
                    border: "1px solid #DC143C",
                    padding: "16px",
                    color: "#DC143C",
                },
            })
            return
        }

        setIsSubmitting(true)

        try {
            // Prepare data for API
            const adminData = {
                fullName: formData.fullName,
                department: formData.department,
                username: formData.username,
                password: formData.password,
                role: formData.role,
                email: formData.email,
                phone: formData.phone,
                rank: formData.rank,
            }

            await addAdmin(adminData)
            toast.success("The new administrator has been successfully created.", {
                style: {
                    border: "1px solid #8B4513",
                    padding: "16px",
                    color: "#8B4513",
                },
                iconTheme: {
                    primary: "#8B4513",
                    secondary: "#FFFAEE",
                },
            })

            // Reset form and close dialog
            resetForm()
            setIsAddDialogOpen(false)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error: ${error.message}`, {
                    style: {
                        border: "1px solid #DC143C",
                        padding: "16px",
                        color: "#DC143C",
                    },
                })
            } else {
                toast.error("An unknown error occurred", {
                    style: {
                        border: "1px solid #DC143C",
                        padding: "16px",
                        color: "#DC143C",
                    },
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle form submission for editing admin
    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (!currentAdmin) {
                throw new Error("No admin selected for editing")
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (formData.email && !emailRegex.test(formData.email)) {
                toast.error("Please enter a valid email address.", {
                    style: {
                        border: "1px solid #DC143C",
                        padding: "16px",
                        color: "#DC143C",
                    },
                })
                setIsSubmitting(false)
                return
            }

            // Prepare data for API
            const updatedData: Record<string, unknown> = {
                fullName: formData.fullName,
                department: formData.department,
                username: formData.username,
                role: formData.role,
                email: formData.email,
                phone: formData.phone,
                rank: formData.rank,
            }

            // Only include password if it was changed
            if (formData.password) {
                updatedData.password = formData.password
            }

            await updateAdmin(currentAdmin._id, updatedData)
            toast.success("The administrator has been successfully updated.", {
                style: {
                    border: "1px solid #8B4513",
                    padding: "16px",
                    color: "#8B4513",
                },
                iconTheme: {
                    primary: "#8B4513",
                    secondary: "#FFFAEE",
                },
            })

            // Reset form and close dialog
            resetForm()
            setIsEditDialogOpen(false)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error: ${error.message}`, {
                    style: {
                        border: "1px solid #DC143C",
                        padding: "16px",
                        color: "#DC143C",
                    },
                })
            } else {
                toast.error("An unknown error occurred", {
                    style: {
                        border: "1px solid #DC143C",
                        padding: "16px",
                        color: "#DC143C",
                    },
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    // Reset form data
    const resetForm = (): void => {
        setFormData({
            fullName: "",
            department: departments[0],
            username: "",
            password: "",
            confirmPassword: "",
            role: "admin",
            email: "",
            phone: "",
            rank: Object.values(JuniorOfficerRank)[0],
        })
        setCurrentAdmin(null)
    }

    // Open edit dialog and populate form with admin data
    const openEditDialog = (admin: Admin): void => {
        setCurrentAdmin(admin)
        setFormData({
            fullName: admin.fullName,
            department: admin.department as Department,
            username: admin.username,
            password: "",
            confirmPassword: "",
            role: admin.role as AdminRole,
            email: admin.email || "",
            phone: admin.phone || "",
            rank: admin.rank || Object.values(JuniorOfficerRank)[0],
        })
        setIsEditDialogOpen(true)
    }

    // Open view dialog
    const openViewDialog = (admin: Admin): void => {
        setCurrentAdmin(admin)
        setIsViewDialogOpen(true)
    }

    // Filter admins based on search term
    const filteredAdmins = admins.filter((admin: Admin) => {
        const searchMatch =
            admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (admin.email && admin.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (admin.phone && admin.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (admin.rank && admin.rank.toLowerCase().includes(searchTerm.toLowerCase()))

        return searchMatch
    })

    // Get role badge color
    const getRoleBadgeColor = (role: AdminRole): string => {
        switch (role) {
            case "admin":
                return "bg-[#8B4513]/20 text-[#8B4513] dark:bg-[#8B4513]/30 dark:text-[#FFD700] border-[#8B4513]/30"
            case "stats":
                return "bg-[#FFD700]/20 text-[#8B4513] dark:bg-[#FFD700]/30 dark:text-[#FFD700] border-[#FFD700]/30"
            case "accounts":
                return "bg-[#DC143C]/20 text-[#DC143C] dark:bg-[#DC143C]/30 dark:text-[#FFD700] border-[#DC143C]/30"
            case "operations":
                return "bg-black/10 text-black dark:bg-white/20 dark:text-white border-black/30 dark:border-white/30"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
        }
    }

    // Get role icon
    const getRoleIcon = (role: AdminRole): JSX.Element | null => {
        switch (role) {
            case "admin":
                return <Shield className="h-3.5 w-3.5 mr-1" />
            case "stats":
                return <UserCog className="h-3.5 w-3.5 mr-1" />
            case "accounts":
                return <UserCog className="h-3.5 w-3.5 mr-1" />
            case "operations":
                return <UserCog className="h-3.5 w-3.5 mr-1" />
            default:
                return null
        }
    }

    // Get initials from name
    const getInitials = (name: string): string => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
    }

    // Get avatar background color based on role
    const getAvatarColor = (role: AdminRole): string => {
        switch (role) {
            case "admin":
                return "bg-[#8B4513]/20 text-[#8B4513] dark:bg-[#8B4513]/30 dark:text-[#FFD700]"
            case "stats":
                return "bg-[#FFD700]/20 text-[#8B4513] dark:bg-[#FFD700]/30 dark:text-[#FFD700]"
            case "accounts":
                return "bg-[#DC143C]/20 text-[#DC143C] dark:bg-[#DC143C]/30 dark:text-[#FFD700]"
            case "operations":
                return "bg-black/10 text-black dark:bg-white/20 dark:text-white"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
        }
    }

    // Check if a rank is a junior officer rank
    const isJuniorRank = (rank: string): boolean => {
        return Object.values(JuniorOfficerRank).includes(rank as JuniorOfficerRank)
    }

    // Get rank badge color
    const getRankBadgeColor = (rank: string): string => {
        if (isJuniorRank(rank)) {
            return "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        } else {
            return "bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
        }
    }

    return (
        <div className="p-6 space-y-6 bg-transparent dark:from-gray-950 dark:to-gray-900">
            <Toaster position="top-right" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#8B4513] ] dark:text-gray-400">Admin Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage system administrators and their permissions</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search admins..."
                            className="w-full sm:w-[250px] pl-10 pr-4 py-2 rounded-full border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white dark:bg-[#8B4513] dark:hover:bg-[#8B4513]/80 dark:text-white rounded-full px-5"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Admin
                    </Button>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive" className="mb-4 rounded-xl border-red-200 dark:border-red-900">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card className="border-none rounded-xl   dark:bg-gray-900 overflow-hidden ">
                <CardHeader className="dark:from-[#8B4513]/20 dark:to-[#8B4513]/10 border-b border-[#8B4513]/20 dark:border-[#8B4513]/30 pb-4">
                    <CardTitle className="text-[#8B4513] dark:text-gray-400 flex items-center text-xl">
                        <Shield className="h-5 w-5 mr-2" />
                        System Administrators
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="flex flex-col items-center">
                                <Loader2 className="h-10 w-10 animate-spin text-[#8B4513] dark:text-gray-400" />
                                <span className="mt-4 text-gray-600 dark:text-gray-400">Loading administrators...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto px-5">
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                                    <TableRow className="border-b-0 hover:bg-transparent">
                                        <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">Admin</TableHead>
                                        <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">Contact</TableHead>
                                        <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">Department</TableHead>
                                        <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">Role</TableHead>
                                        <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">Rank</TableHead>
                                        <TableHead className="text-[#8B4513] dark:text-gray-400 font-semibold">Created</TableHead>
                                        <TableHead className="text-right text-[#8B4513] dark:text-gray-400 font-semibold">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAdmins.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <Shield className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                                                    {admins.length === 0
                                                        ? "No administrators found"
                                                        : "No administrators match your search criteria"}
                                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                                        {admins.length === 0
                                                            ? "Click the 'Add Admin' button to create your first administrator"
                                                            : "Try adjusting your search criteria"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredAdmins.map((admin: Admin, index: number) => (
                                            <TableRow
                                                key={admin._id}
                                                className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${
                                                    index % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-900/30" : ""
                                                }`}
                                                onClick={() => openViewDialog(admin)}
                                            >
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar
                                                            className={`h-10 w-10 ${getAvatarColor(admin.role as AdminRole)} border border-[#8B4513]/20 dark:border-[#FFD700]/20`}
                                                        >
                                                            <AvatarFallback className="font-medium">{getInitials(admin.fullName)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-black dark:text-white">{admin.fullName}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                <User className="h-3 w-3 inline mr-1" />
                                                                {admin.username}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-300 py-4">
                                                    <div className="space-y-1">
                                                        {admin.email && (
                                                            <p className="text-sm flex items-center">
                                                                <Mail className="h-3.5 w-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                                                                {admin.email}
                                                            </p>
                                                        )}
                                                        {admin.phone && (
                                                            <p className="text-sm flex items-center">
                                                                <Phone className="h-3.5 w-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                                                                {admin.phone}
                                                            </p>
                                                        )}
                                                        {!admin.email && !admin.phone && (
                                                            <p className="text-sm text-gray-400 dark:text-gray-500">No contact info</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-300 py-4">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                                    >
                                                        {admin.department}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge
                                                        variant="outline"
                                                        className={`${getRoleBadgeColor(admin.role as AdminRole)} flex items-center w-fit px-2.5 py-1`}
                                                    >
                                                        {getRoleIcon(admin.role as AdminRole)}
                                                        {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {admin.rank ? (
                                                        <Badge
                                                            variant="outline"
                                                            className={`${getRankBadgeColor(admin.rank)} flex items-center w-fit px-2.5 py-1`}
                                                        >
                                                            <Award className="h-3.5 w-3.5 mr-1" />
                                                            {admin.rank}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-gray-400 dark:text-gray-500 text-sm">Not assigned</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-300 py-4">
                                                    <div className="flex items-center">
                                                        <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                                                        {formatDate(admin.createdAt)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right py-4" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-9 w-9 rounded-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#8B4513] dark:text-gray-400 hover:bg-[#8B4513]/10 dark:hover:bg-[#8B4513]/20 hover:text-[#8B4513] dark:hover:text-[#FFD700] shadow-sm transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                openViewDialog(admin)
                                                            }}
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-9 w-9 rounded-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#8B4513] dark:text-gray-400 hover:bg-[#8B4513]/10 dark:hover:bg-[#8B4513]/20 hover:text-[#8B4513] dark:hover:text-[#FFD700] shadow-sm transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                openEditDialog(admin)
                                                            }}
                                                            title="Edit Admin"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-9 w-9 rounded-full border-[[#8B4513]  dark:border-gray-400 bg-white dark:bg-gray-800 text-[#8B4513] dark:text-gray-400 hover:bg-[#DC143C]/10 dark:hover:bg-[#DC143C]/20 hover:text-[#DC143C] shadow-sm transition-colors"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    title="Delete Admin"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-[#DC143C] dark:text-[#DC143C] text-xl">
                                                                        Are you absolutely sure?
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                                                        This action cannot be undone. This will permanently delete the admin account for{" "}
                                                                        <span className="font-semibold text-black dark:text-white">{admin.fullName}</span>.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        className="bg-[#DC143C] hover:bg-[#DC143C]/90 text-white rounded-full"
                                                                        onClick={() => handleDeleteAdmin(admin._id)}
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Admin Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => !isSubmitting && setIsAddDialogOpen(open)}>
                <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                    <DialogHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                        <DialogTitle className="text-[#8B4513] dark:text-[#FFD700] text-2xl flex items-center">
                            <Shield className="h-6 w-6 mr-2" />
                            Add New Admin
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                            Create a new administrator account with specific permissions.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit}>
                        <div className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                    Full Name
                                </Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                    placeholder="Enter administrator's full name"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white pl-10 rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        Phone Number
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white pl-10 rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="department" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        Department
                                    </Label>
                                    <Select value={formData.department} onValueChange={handleDepartmentChange} required>
                                        <SelectTrigger
                                            id="department"
                                            className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                        >
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg">
                                            {departments.map((dept) => (
                                                <SelectItem key={dept} value={dept} className="text-gray-700 dark:text-gray-300">
                                                    {dept}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rank" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        Rank
                                    </Label>
                                    <Select value={formData.rank} onValueChange={handleRankChange} required>
                                        <SelectTrigger
                                            id="rank"
                                            className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                        >
                                            <SelectValue placeholder="Select rank" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg max-h-[300px]">
                                            <SelectItem value="none" className="text-gray-700 dark:text-gray-300 font-semibold">
                                                -- Junior Officer Ranks --
                                            </SelectItem>
                                            {Object.values(JuniorOfficerRank).map((rank) => (
                                                <SelectItem key={rank} value={rank} className="text-gray-700 dark:text-gray-300">
                                                    {rank}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="none2" className="text-gray-700 dark:text-gray-300 font-semibold">
                                                -- Senior Officer Ranks --
                                            </SelectItem>
                                            {Object.values(SeniorOfficerRank).map((rank) => (
                                                <SelectItem key={rank} value={rank} className="text-gray-700 dark:text-gray-300">
                                                    {rank}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                    Role
                                </Label>
                                <Select value={formData.role} onValueChange={handleRoleChange} required>
                                    <SelectTrigger
                                        id="role"
                                        className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                    >
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg">
                                        {adminRoles.map((role) => (
                                            <SelectItem
                                                key={role}
                                                value={role}
                                                className="text-gray-700 dark:text-gray-300 flex items-center"
                                            >
                                                {role === "admin" && <Shield className="h-4 w-4 mr-2 text-[#8B4513] dark:text-[#FFD700]" />}
                                                {role === "stats" && <UserCog className="h-4 w-4 mr-2 text-[#FFD700] dark:text-[#FFD700]" />}
                                                {role === "accounts" && <UserCog className="h-4 w-4 mr-2 text-[#DC143C] dark:text-[#FFD700]" />}
                                                {role === "operations" && <UserCog className="h-4 w-4 mr-2 text-black dark:text-white" />}
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Admin: Full access | Stats: View statistics | Accounts: Manage financial data | Operations: Manage
                                    operations
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                    Username
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                        className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white pl-10 rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                        placeholder="Enter unique username"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Username must be unique and will be used for login
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white pl-10 rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                            placeholder="Enter secure password"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white pl-10 rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                            placeholder="Confirm password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setIsAddDialogOpen(false)}
                                disabled={isSubmitting}
                                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white dark:bg-[#8B4513] dark:hover:bg-[#8B4513]/80 dark:text-white rounded-full"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create Admin
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Admin Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => !isSubmitting && setIsEditDialogOpen(open)}>
                <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                    <DialogHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                        <DialogTitle className="text-[#8B4513] dark:text-[#FFD700] text-2xl flex items-center">
                            <Edit className="h-6 w-6 mr-2" />
                            Edit Administrator
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                            Update administrator account details and permissions.
                        </DialogDescription>
                    </DialogHeader>
                    {currentAdmin && (
                        <form onSubmit={handleEditSubmit}>
                            <div className="space-y-5 py-4">
                                <div className="flex justify-center mb-6">
                                    <Avatar
                                        className={`h-20 w-20 ${getAvatarColor(currentAdmin.role as AdminRole)} border-2 border-[#8B4513]/20 dark:border-[#FFD700]/20`}
                                    >
                                        <AvatarFallback className="text-2xl font-semibold">
                                            {getInitials(currentAdmin.fullName)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-fullName" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        Full Name
                                    </Label>
                                    <Input
                                        id="edit-fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-email" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="edit-email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white pl-10 rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-phone" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                            Phone Number
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="edit-phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white pl-10 rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-department" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                            Department
                                        </Label>
                                        <Select value={formData.department} onValueChange={handleDepartmentChange} required>
                                            <SelectTrigger
                                                id="edit-department"
                                                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                            >
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg">
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept} value={dept} className="text-gray-700 dark:text-gray-300">
                                                        {dept}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-rank" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                            Rank
                                        </Label>
                                        <Select value={formData.rank} onValueChange={handleRankChange} required>
                                            <SelectTrigger
                                                id="edit-rank"
                                                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                            >
                                                <SelectValue placeholder="Select rank" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg max-h-[300px]">
                                                <SelectItem value="none" className="text-gray-700 dark:text-gray-300 font-semibold">
                                                    -- Junior Officer Ranks --
                                                </SelectItem>
                                                {Object.values(JuniorOfficerRank).map((rank) => (
                                                    <SelectItem key={rank} value={rank} className="text-gray-700 dark:text-gray-300">
                                                        {rank}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="none2" className="text-gray-700 dark:text-gray-300 font-semibold">
                                                    -- Senior Officer Ranks --
                                                </SelectItem>
                                                {Object.values(SeniorOfficerRank).map((rank) => (
                                                    <SelectItem key={rank} value={rank} className="text-gray-700 dark:text-gray-300">
                                                        {rank}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-role" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                            Role
                                        </Label>
                                        <Select value={formData.role} onValueChange={handleRoleChange} required>
                                            <SelectTrigger
                                                id="edit-role"
                                                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                            >
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg">
                                                {adminRoles.map((role) => (
                                                    <SelectItem
                                                        key={role}
                                                        value={role}
                                                        className="text-gray-700 dark:text-gray-300 flex items-center"
                                                    >
                                                        {role === "admin" && <Shield className="h-4 w-4 mr-2 text-[#8B4513] dark:text-[#FFD700]" />}
                                                        {role === "stats" && (
                                                            <UserCog className="h-4 w-4 mr-2 text-[#FFD700] dark:text-[#FFD700]" />
                                                        )}
                                                        {role === "accounts" && (
                                                            <UserCog className="h-4 w-4 mr-2 text-[#DC143C] dark:text-[#FFD700]" />
                                                        )}
                                                        {role === "operations" && <UserCog className="h-4 w-4 mr-2 text-black dark:text-white" />}
                                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-username" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                            Username
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="edit-username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                required
                                                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white pl-10 rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-password" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        Password (Leave blank to keep current)
                                    </Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="edit-password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white pl-10 rounded-lg focus:ring-[#8B4513] dark:focus:ring-[#FFD700] focus:border-[#8B4513] dark:focus:border-[#FFD700]"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Only fill this if you want to change the password
                                    </p>
                                </div>
                            </div>
                            <DialogFooter className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsEditDialogOpen(false)}
                                    disabled={isSubmitting}
                                    className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white dark:bg-[#8B4513] dark:hover:bg-[#8B4513]/80 dark:text-white rounded-full"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Update Admin
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* View Admin Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                    <DialogHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                        <DialogTitle className="text-[#8B4513] dark:text-[#FFD700] text-2xl flex items-center">
                            <Eye className="h-6 w-6 mr-2" />
                            Administrator Details
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                            View complete information about this administrator.
                        </DialogDescription>
                    </DialogHeader>
                    {currentAdmin && (
                        <div className="py-4">
                            <div className="space-y-6">
                                <div className="flex justify-center mb-6">
                                    <div className="flex flex-col items-center">
                                        <Avatar
                                            className={`h-24 w-24 ${getAvatarColor(currentAdmin.role as AdminRole)} border-2 border-[#8B4513]/20 dark:border-[#FFD700]/20`}
                                        >
                                            <AvatarFallback className="text-3xl font-semibold">
                                                {getInitials(currentAdmin.fullName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h2 className="text-xl font-bold text-black dark:text-white mt-4">{currentAdmin.fullName}</h2>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Badge
                                                variant="outline"
                                                className={`${getRoleBadgeColor(currentAdmin.role as AdminRole)} flex items-center px-3 py-1`}
                                            >
                                                {getRoleIcon(currentAdmin.role as AdminRole)}
                                                {currentAdmin.role.charAt(0).toUpperCase() + currentAdmin.role.slice(1)}
                                            </Badge>
                                            {currentAdmin.rank && (
                                                <Badge
                                                    variant="outline"
                                                    className={`${getRankBadgeColor(currentAdmin.rank)} flex items-center px-3 py-1`}
                                                >
                                                    <Award className="h-3.5 w-3.5 mr-1" />
                                                    {currentAdmin.rank}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</p>
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                                            <p className="text-base font-medium text-black dark:text-white">{currentAdmin.username}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
                                        <p className="text-base font-medium text-black dark:text-white">{currentAdmin.department}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                                        {currentAdmin.email ? (
                                            <div className="flex items-center">
                                                <Mail className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                                                <p className="text-base font-medium text-black dark:text-white">{currentAdmin.email}</p>
                                            </div>
                                        ) : (
                                            <p className="text-base text-gray-500 dark:text-gray-400">Not available</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                                        {currentAdmin.phone ? (
                                            <div className="flex items-center">
                                                <Phone className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                                                <p className="text-base font-medium text-black dark:text-white">{currentAdmin.phone}</p>
                                            </div>
                                        ) : (
                                            <p className="text-base text-gray-500 dark:text-gray-400">Not available</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created On</p>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                                            <p className="text-base font-medium text-black dark:text-white">
                                                {formatDate(currentAdmin.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</p>
                                        {currentAdmin.lastLogin ? (
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                                                <p className="text-base font-medium text-black dark:text-white">
                                                    {formatDateTime(currentAdmin.lastLogin)}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-base text-gray-500 dark:text-gray-400">Never logged in</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6 gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsViewDialogOpen(false)}
                                    className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsViewDialogOpen(false)
                                        openEditDialog(currentAdmin)
                                    }}
                                    className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white dark:bg-[#8B4513] dark:hover:bg-[#8B4513]/80 dark:text-white rounded-full"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
