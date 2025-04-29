"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Mail, Phone, Edit, Trash2, User, Briefcase, CreditCard, Shield, Users, Download } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import enums from separate file
import { JuniorOfficerRank, SeniorOfficerRank, getFullRankName } from "@/lib/officer-ranks"

// Import Officer type and store
import type { Officer } from "@/lib/officer"
import { useOfficerStore } from "@/lib/officer"

// Define departments array
const departments = [
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

// Define colors
const colors = {
    brown: "#8B4513", // Saddle Brown
    crimson: "#DC143C", // Crimson Red
    yellow: "#FFD700", // Gold
    black: "#000000", // Black
}

// Add CSS variables for consistent theming with better dark mode contrast
const addCustomColorVars = () => {
    if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--color-brown", colors.brown)
        document.documentElement.style.setProperty("--color-crimson", colors.crimson)
        document.documentElement.style.setProperty("--color-yellow", colors.yellow)
        document.documentElement.style.setProperty("--color-black", colors.black)
    }
}

// Replace the StaffTableComponent function with this enhanced version
function StaffTableComponent({
                                 staffMembers,
                                 formatDate,
                                 onRowClick,
                             }: {
    staffMembers: Officer[]
    formatDate: (date: string | number | Date | undefined) => string
    onRowClick: (staff: Officer, action?: "view" | "edit" | "delete") => void
}) {
    return (
        <div className="rounded-xl border overflow-hidden shadow-none">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-[#8B4513] to-[#8B4513]/90 text-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-950 px-10">
                        <TableHead className="font-semibold text-inherit">Service Number</TableHead>
                        <TableHead className="font-semibold text-inherit w-1/4">Staff</TableHead>
                        <TableHead className="font-semibold text-inherit">Gender</TableHead>
                        <TableHead className="font-semibold text-inherit">Rank</TableHead>
                        <TableHead className="font-semibold text-inherit">Department</TableHead>
                        <TableHead className="font-semibold text-inherit">Appointment Date</TableHead>
                        <TableHead className="font-semibold text-inherit">Contact</TableHead>
                        <TableHead className="text-right font-semibold text-inherit">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {staffMembers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <Users className="h-10 w-10 opacity-20" />
                                    <p>No staff members found matching your criteria</p>
                                    <Button variant="link" size="sm" className="mt-2 cursor-pointer">
                                        Clear filters
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        staffMembers.map((staff: Officer) => (
                            <TableRow
                                key={staff._id}
                                className="border-border hover:bg-[#8B4513]/5 dark:hover:bg-[#8B4513]/20 transition-colors cursor-pointer"
                                onClick={() => onRowClick(staff)}
                            >
                                <TableCell className="font-medium">{staff.serviceNumber || ""}</TableCell>
                                <TableCell className="w-1/4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-[#8B4513]/20 dark:border-gray-400 shadow-sm">
                                            <AvatarImage src="/placeholder.svg" alt={`${staff.firstName || ""} ${staff.lastName || ""}`} />
                                            <AvatarFallback className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 text-[#8B4513] dark:from-gray-900 dark:to-gray-950 dark:text-gray-400">
                                                {staff.firstName ? staff.firstName.charAt(0) : ""}
                                                {staff.lastName ? staff.lastName.charAt(0) : ""}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-base">
                                                {staff.firstName || ""} {staff.lastName || ""}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{staff.levelOfficer || ""}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            staff.gender === "Male"
                                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                                : "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800"
                                        }
                                    >
                                        {staff.gender || ""}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{staff.rank}</span>
                                        <span className="text-xs text-muted-foreground">{getFullRankName(staff.rank)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
                                    >
                                        {staff.department || "N/A"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-[#8B4513]/70 mr-2"></div>
                                        {formatDate(staff.appointmentDate)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="flex items-center text-xs">
                                            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                                            <span className="text-muted-foreground">{staff.email}</span>
                                        </div>
                                        <div className="flex items-center text-xs mt-1">
                                            <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                                            <span className="text-muted-foreground">{staff.phoneNumber}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-600 hover:text-[#8B4513] hover:bg-[#8B4513]/10 dark:text-gray-400 dark:hover:text-[#8B4513]/80 dark:hover:bg-[#8B4513]/20 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onRowClick(staff)
                                                        }}
                                                    >
                                                        <User className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View Profile</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-600 hover:text-[#8B4513] hover:bg-[#8B4513]/10 dark:text-gray-400 dark:hover:text-[#8B4513]/80 dark:hover:bg-[#8B4513]/20 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onRowClick(staff, "edit")
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Profile</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/30 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onRowClick(staff, "delete")
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete Profile</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

// Staff detail dialog component
function StaffDetailDialog({
                               staff,
                               isOpen,
                               onClose,
                               onEdit,
                               onDelete,
                               formatDate,
                           }: {
    staff: Officer | null
    isOpen: boolean
    onClose: () => void
    onEdit: () => void
    onDelete: () => void
    formatDate: (date: string | number | Date | undefined) => string
}) {
    if (!staff) return null

    // Calculate years of service
    const calculateYearsOfService = () => {
        if (!staff.appointmentDate) return 0

        const appointmentDate = new Date(staff.appointmentDate)
        const today = new Date()
        let years = today.getFullYear() - appointmentDate.getFullYear()
        const months = today.getMonth() - appointmentDate.getMonth()

        if (months < 0 || (months === 0 && today.getDate() < appointmentDate.getDate())) {
            years--
        }

        return years
    }

    // Calculate age
    const calculateAge = () => {
        if (!staff.dob) return 0

        const birthDate = new Date(staff.dob)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const months = today.getMonth() - birthDate.getMonth()

        if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }

        return age
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden border-[#8B4513]/20 max-h-[90vh] w-[95vw] bg-white dark:bg-gray-900 [button[aria-label='Close']]:hidden">
                {/* Header with background and profile info */}
                <DialogHeader className="px-6 pt-6 pb-0 border-b border-[#8B4513]/10 dark:border-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8B4513]/20 to-transparent h-32 rounded-t-lg dark:from-[#8B4513]/30 dark:to-transparent" />

                    <div className="relative z-10">
                        <DialogTitle className="text-2xl font-bold mb-2">Staff Profile</DialogTitle>
                        <DialogDescription className="text-muted-foreground mb-4">
                            View detailed information about this staff member
                        </DialogDescription>

                        {/* Entire Row */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 mb-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <Avatar className="h-20 w-20 border-[#8B4513] border-2 shadow-sm">
                                    <AvatarImage src="/placeholder.svg" alt={`${staff.firstName || ""} ${staff.lastName || ""}`} />
                                    <AvatarFallback className="text-xl bg-white text-[#8B4513] dark:bg-gray-800 dark:text-[#8B4513]/80">
                                        {staff.firstName?.charAt(0) || ""}
                                        {staff.lastName?.charAt(0) || ""}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Name + Ranks */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <h3 className="text-2xl font-bold">
                                    {staff.firstName || ""} {staff.middleName || ""} {staff.lastName || ""}
                                </h3>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                                    <Badge className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white border-[#8B4513]/80 px-3 py-1 text-sm">
                                        {staff.rank || ""}
                                    </Badge>
                                    <Badge variant="outline" className="border-[#8B4513]/30 dark:border-[#8B4513]/50 px-3 py-1 text-sm">
                                        {staff.rank ? getFullRankName(staff.rank) : "Default"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 ml-0 md:ml-auto mt-4 md:mt-0">
                                {/* Years of Service */}
                                <div className="flex flex-col items-center text-center w-20">
                                    <Shield className="h-6 w-6 mb-1 text-[#8B4513] dark:text-[#8B4513]/80" />
                                    <p className="text-[10px] text-muted-foreground font-semibold">Years</p>
                                    <p className="text-base">{calculateYearsOfService()}</p>
                                </div>

                                {/* Age */}
                                <div className="flex flex-col items-center text-center w-20">
                                    <User className="h-6 w-6 mb-1 text-[#DC143C] dark:text-[#DC143C]/80" />
                                    <p className="text-[10px] text-muted-foreground font-semibold">Age</p>
                                    <p className="text-base">{calculateAge()}</p>
                                </div>

                                {/* Rank Level */}
                                <div className="flex flex-col items-center text-center">
                                    <Briefcase className="h-6 w-6 mb-1 text-[#8B4513] dark:text-[#8B4513]/80" />
                                    <p className="text-[10px] text-muted-foreground font-semibold">Level</p>
                                    <p className="text-base">{staff.levelOfficer || "N/A"}</p>
                                </div>

                                {/* Qualification */}
                                <div className="flex flex-col items-center">
                                    <CreditCard className="h-6 w-6 mb-1 text-[#DC143C] dark:text-[#DC143C]/80" />
                                    <p className="text-[10px] text-muted-foreground font-semibold">Qual.</p>
                                    <p className="text-base">{staff.qualification || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* Tabs content */}
                <div className="px-6 pb-6">
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="mb-6 bg-muted dark:bg-gray-800 p-1 rounded-lg w-full grid grid-cols-2">
                            <TabsTrigger
                                value="personal"
                                className="rounded-md data-[state=active]:bg-[#8B4513] data-[state=active]:text-white dark:data-[state=active]:bg-[#8B4513]/80 dark:data-[state=active]:text-white cursor-pointer"
                            >
                                <User className="h-4 w-4 mr-2" />
                                Personal
                            </TabsTrigger>
                            <TabsTrigger
                                value="employment"
                                className="rounded-md data-[state=active]:bg-[#8B4513] data-[state=active]:text-white dark:data-[state=active]:bg-[#8B4513]/80 dark:data-[state=active]:text-white cursor-pointer"
                            >
                                <Briefcase className="h-4 w-4 mr-2" />
                                Employment
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Full Name</p>
                                    <p className="font-medium">
                                        {staff.firstName} {staff.middleName} {staff.lastName}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                                    <p className="font-medium">{formatDate(staff.dob)}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Gender</p>
                                    <p className="font-medium">{staff.gender}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Marital Status</p>
                                    <p className="font-medium">{staff.maritalStatus}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">National ID</p>
                                    <p className="font-medium">{staff.nationalId}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Emergency Contact</p>
                                    <p className="font-medium">{staff.emergencyContact}</p>
                                </div>
                            </div>

                            <Separator className="bg-[#8B4513]/10" />

                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Residential Address</p>
                                <p className="font-medium">{staff.address}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Contact Information</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-[#8B4513]/10 p-1.5 rounded-full">
                                            <Mail className="h-4 w-4 text-[#8B4513]" />
                                        </div>
                                        <p className="font-medium">{staff.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-[#8B4513]/10 p-1.5 rounded-full">
                                            <Phone className="h-4 w-4 text-[#8B4513]" />
                                        </div>
                                        <p className="font-medium">{staff.phoneNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="employment" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Staff ID</p>
                                    <p className="font-medium">{staff.staffId}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Service Number</p>
                                    <p className="font-medium">{staff.serviceNumber}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Rank</p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{staff.rank}</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Level</p>
                                    <p className="font-medium">{staff.levelOfficer}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Department</p>
                                    <p className="font-medium">{staff.department || "N/A"}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Appointment Date</p>
                                    <p className="font-medium">{formatDate(staff.appointmentDate)}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Mate Type</p>
                                    <p className="font-medium">{staff.mateType}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Qualification</p>
                                    <p className="font-medium">{staff.qualification}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Years of Service</p>
                                    <p className="font-medium">{calculateYearsOfService()} years</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className="bg-muted/30 dark:bg-gray-800 p-4 border-t border-[#8B4513]/10 dark:border-gray-700">
                    <div className="flex gap-2 w-full justify-between">
                        <Button variant="outline" onClick={onClose} className="border-[#8B4513] text-[#8B4513] cursor-pointer">
                            Close
                        </Button>
                        <div className="flex gap-2">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="border-[#8B4513] text-white hover:bg-[#DC143C]/10 cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the staff record and remove the data
                                            from the server.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-[#8B4513] text-white cursor-pointer" onClick={onDelete}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button onClick={onEdit} className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// Staff edit dialog component
function StaffEditDialog({
                             staff,
                             isOpen,
                             onClose,
                             onSave,
                         }: {
    staff: Officer | null
    isOpen: boolean
    onClose: () => void
    onSave: (staff: Officer) => void
}) {
    if (!staff) return null

    // Initialize formData with null values for all Officer properties
    const initialFormData: Officer = {
        _id: "",
        staffId: "",
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
        gender: "",
        maritalStatus: "",
        nationalId: "",
        emergencyContact: "",
        address: "",
        email: "",
        phoneNumber: "",
        serviceNumber: "",
        rank: "",
        levelOfficer: "",
        appointmentDate: "",
        mateType: "",
        qualification: "",
        department: "",
        bankName: "",
        accountNumber: "",
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [formData, setFormData] = useState<Officer>(staff ? { ...staff } : initialFormData)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [customQualification, setCustomQualification] = useState<string>("")

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (staff) {
            setFormData({ ...staff })
            if (staff.qualification === "Others") {
                setCustomQualification(staff.customQualification || "")
            }
        } else {
            setFormData(initialFormData)
            setCustomQualification("")
        }
    }, [staff, staff?.qualification, staff?.customQualification])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault()

        // If qualification is "Others", include the custom qualification
        if (formData.qualification === "Others") {
            formData.customQualification = customQualification
        }

        onSave(formData)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto w-[95vw] bg-white dark:bg-gray-900">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit Staff Profile</DialogTitle>
                    <DialogDescription>
                        Update information for {staff.firstName} {staff.lastName}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="personal">
                        <TabsList className="mb-6 bg-muted dark:bg-gray-800 p-1 rounded-lg w-full">
                            <TabsTrigger
                                value="personal"
                                className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-white cursor-pointer"
                            >
                                <User className="h-4 w-4 mr-2" />
                                Personal
                            </TabsTrigger>
                            <TabsTrigger
                                value="employment"
                                className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-white cursor-pointer"
                            >
                                <Briefcase className="h-4 w-4 mr-2" />
                                Employment
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="middleName">Middle Name</Label>
                                    <Input id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        value={formData.dob ? formData.dob.split("T")[0] : ""}
                                        onChange={handleChange}
                                        required
                                        className="cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationalId">National ID</Label>
                                    <Input
                                        id="nationalId"
                                        name="nationalId"
                                        value={formData.nationalId}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <RadioGroup
                                        name="gender"
                                        value={formData.gender}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Male" id="male" className="cursor-pointer" />
                                            <Label htmlFor="male" className="cursor-pointer">
                                                Male
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Female" id="female" className="cursor-pointer" />
                                            <Label htmlFor="female" className="cursor-pointer">
                                                Female
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maritalStatus">Marital Status</Label>
                                    <Select
                                        name="maritalStatus"
                                        value={formData.maritalStatus}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                maritalStatus: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder="Select marital status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single" className="cursor-pointer">
                                                Single
                                            </SelectItem>
                                            <SelectItem value="Married" className="cursor-pointer">
                                                Married
                                            </SelectItem>
                                            <SelectItem value="Divorced" className="cursor-pointer">
                                                Divorced
                                            </SelectItem>
                                            <SelectItem value="Widowed" className="cursor-pointer">
                                                Widowed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                                    <Input
                                        id="emergencyContact"
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Residential Address</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="cursor-pointer"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="employment" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="staffId">Staff ID</Label>
                                    <Input id="staffId" name="staffId" value={formData.staffId} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="serviceNumber">Service Number</Label>
                                    <Input
                                        id="serviceNumber"
                                        name="serviceNumber"
                                        value={formData.serviceNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select
                                        name="department"
                                        value={formData.department || ""}
                                        onValueChange={(value) => handleSelectChange("department", value)}
                                    >
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept} value={dept} className="cursor-pointer">
                                                    {dept}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="levelOfficer">Level</Label>
                                    <Select
                                        name="levelOfficer"
                                        value={formData.levelOfficer || ""}
                                        onValueChange={(value) => handleSelectChange("levelOfficer", value)}
                                    >
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Junior Officer" className="cursor-pointer">
                                                Junior Officer
                                            </SelectItem>
                                            <SelectItem value="Senior Officer" className="cursor-pointer">
                                                Senior Officer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rank">Rank</Label>
                                    <Select
                                        name="rank"
                                        value={formData.rank || ""}
                                        onValueChange={(value) => handleSelectChange("rank", value)}
                                    >
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder="Select rank" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {formData.levelOfficer === "Senior Officer" ? (
                                                <>
                                                    <SelectItem value="DCFO" className="cursor-pointer">
                                                        DCFO
                                                    </SelectItem>
                                                    <SelectItem value="AFCO I" className="cursor-pointer">
                                                        AFCO I
                                                    </SelectItem>
                                                    <SelectItem value="AFCO II" className="cursor-pointer">
                                                        AFCO II
                                                    </SelectItem>
                                                    <SelectItem value="DO I" className="cursor-pointer">
                                                        DO I
                                                    </SelectItem>
                                                    <SelectItem value="DO II" className="cursor-pointer">
                                                        DO II
                                                    </SelectItem>
                                                    <SelectItem value="DO III" className="cursor-pointer">
                                                        DO III
                                                    </SelectItem>
                                                    <SelectItem value="ADO I" className="cursor-pointer">
                                                        ADO I
                                                    </SelectItem>
                                                    <SelectItem value="ADO II" className="cursor-pointer">
                                                        ADO II
                                                    </SelectItem>
                                                </>
                                            ) : formData.levelOfficer === "Junior Officer" ? (
                                                <>
                                                    <SelectItem value="RFW" className="cursor-pointer">
                                                        RFW
                                                    </SelectItem>
                                                    <SelectItem value="RFM" className="cursor-pointer">
                                                        RFM
                                                    </SelectItem>
                                                    <SelectItem value="FM" className="cursor-pointer">
                                                        FM
                                                    </SelectItem>
                                                    <SelectItem value="FW" className="cursor-pointer">
                                                        FW
                                                    </SelectItem>
                                                    <SelectItem value="LFM" className="cursor-pointer">
                                                        LFM
                                                    </SelectItem>
                                                    <SelectItem value="LFW" className="cursor-pointer">
                                                        LFW
                                                    </SelectItem>
                                                    <SelectItem value="SUB" className="cursor-pointer">
                                                        SUB
                                                    </SelectItem>
                                                    <SelectItem value="ASTNO" className="cursor-pointer">
                                                        ASTNO
                                                    </SelectItem>
                                                    <SelectItem value="AGO" className="cursor-pointer">
                                                        AGO
                                                    </SelectItem>
                                                    <SelectItem value="STNO II" className="cursor-pointer">
                                                        STNO II
                                                    </SelectItem>
                                                    <SelectItem value="STNO I" className="cursor-pointer">
                                                        STNO I
                                                    </SelectItem>
                                                    <SelectItem value="DGO" className="cursor-pointer">
                                                        DGO
                                                    </SelectItem>
                                                    <SelectItem value="GO" className="cursor-pointer">
                                                        GO
                                                    </SelectItem>
                                                </>
                                            ) : (
                                                <SelectItem value="" disabled className="cursor-pointer">
                                                    Select a level first
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="appointmentDate">Appointment Date</Label>
                                    <Input
                                        id="appointmentDate"
                                        name="appointmentDate"
                                        type="date"
                                        value={formData.appointmentDate ? formData.appointmentDate.split("T")[0] : ""}
                                        onChange={handleChange}
                                        required
                                        className="cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mateType">Mate Type</Label>
                                    <Input id="mateType" name="mateType" value={formData.mateType} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="qualification">Qualification</Label>
                                    <Select
                                        name="qualification"
                                        value={formData.qualification || ""}
                                        onValueChange={(value) => handleSelectChange("qualification", value)}
                                    >
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder="Select qualification" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="JHS" className="cursor-pointer">
                                                JHS
                                            </SelectItem>
                                            <SelectItem value="SHS" className="cursor-pointer">
                                                SHS
                                            </SelectItem>
                                            <SelectItem value="DBS" className="cursor-pointer">
                                                DBS
                                            </SelectItem>
                                            <SelectItem value="Diploma" className="cursor-pointer">
                                                Diploma
                                            </SelectItem>
                                            <SelectItem value="NVTI" className="cursor-pointer">
                                                NVTI
                                            </SelectItem>
                                            <SelectItem value="Professional Certificate" className="cursor-pointer">
                                                Professional Certificate
                                            </SelectItem>
                                            <SelectItem value="HND" className="cursor-pointer">
                                                HND
                                            </SelectItem>
                                            <SelectItem value="Degree" className="cursor-pointer">
                                                Degree
                                            </SelectItem>
                                            <SelectItem value="Masters" className="cursor-pointer">
                                                Masters
                                            </SelectItem>
                                            <SelectItem value="Others" className="cursor-pointer">
                                                Others
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formData.qualification === "Others" && (
                                        <Input
                                            placeholder="Enter your qualification"
                                            value={customQualification}
                                            onChange={(e) => setCustomQualification(e.target.value)}
                                            className="mt-2 border-slate-300 rounded-md focus:border-[#8B4513] focus:ring focus:ring-[#8B4513]/20 focus:ring-opacity-50 transition-all"
                                        />
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button type="submit" className="cursor-pointer">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// Delete confirmation dialog component
function DeleteConfirmDialog({
                                 staff,
                                 isOpen,
                                 onClose,
                                 onConfirm,
                             }: {
    staff: Officer | null
    isOpen: boolean
    onClose: () => void
    onConfirm: (staff: Officer) => void
}) {
    if (!staff) return null

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-white dark:bg-gray-900">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the staff record for{" "}
                        <span className="font-semibold">
              {staff.firstName} {staff.lastName}
            </span>{" "}
                        and remove all associated data from the server.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-[#DC143C] dark:bg-[#DC143C]/80 dark:hover:bg-[#DC143C] text-white cursor-pointer"
                        onClick={() => onConfirm(staff)}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

// Main StaffTable component
export default function StaffTable() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRank, setSelectedRank] = useState("all")
    const [activeTab, setActiveTab] = useState("all")

    // Function to export data to Excel
    const exportToExcel = () => {
        // Create a CSV string with all staff details
        const headers = [
            // Personal Information
            "Service Number",
            "First Name",
            "Middle Name",
            "Last Name",
            "Date of Birth",
            "Age",
            "Gender",
            "Marital Status",
            "National ID",
            "Emergency Contact",
            "Residential Address",
            "Email",
            "Phone Number",
            // Employment Information
            "Staff ID",
            "Rank",
            "Full Rank Name",
            "Level Officer",
            "Department",
            "Appointment Date",
            "Years of Service",
            "Mate Type",
            "Qualification",
            // Financial Information
            "Bank Name",
            "Account Number",
        ]

        let csvContent = headers.join(",") + "\n"

        filteredStaff.forEach((staff) => {
            // Calculate age
            const calculateAge = () => {
                if (!staff.dob) return ""
                const birthDate = new Date(staff.dob)
                const today = new Date()
                let age = today.getFullYear() - birthDate.getFullYear()
                const months = today.getMonth() - birthDate.getMonth()
                if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
                    age--
                }
                return age.toString()
            }

            // Calculate years of service
            const calculateYearsOfService = () => {
                if (!staff.appointmentDate) return ""
                const appointmentDate = new Date(staff.appointmentDate)
                const today = new Date()
                let years = today.getFullYear() - appointmentDate.getFullYear()
                const months = today.getMonth() - appointmentDate.getMonth()
                if (months < 0 || (months === 0 && today.getDate() < appointmentDate.getDate())) {
                    years--
                }
                return years.toString()
            }

            const row = [
                // Personal Information
                staff.serviceNumber || "",
                staff.firstName || "",
                staff.middleName || "",
                staff.lastName || "",
                staff.dob ? new Date(staff.dob).toLocaleDateString() : "",
                calculateAge(),
                staff.gender || "",
                staff.maritalStatus || "",
                staff.nationalId || "",
                staff.emergencyContact || "",
                staff.address || "",
                staff.email || "",
                staff.phoneNumber || "",
                // Employment Information
                staff.staffId || "",
                staff.rank || "",
                staff.rank ? getFullRankName(staff.rank) : "",
                staff.levelOfficer || "",
                staff.department || "",
                staff.appointmentDate ? new Date(staff.appointmentDate).toLocaleDateString() : "",
                calculateYearsOfService(),
                staff.mateType || "",
                staff.qualification || "",
                // Financial Information
                staff.bankName || "",
                staff.accountNumber || "",
            ]

            // Escape commas in fields
            const escapedRow = row.map((field) => {
                // If field contains comma, quote, or newline, wrap in quotes
                if (field.includes(",") || field.includes('"') || field.includes("\n")) {
                    return `"${field.replace(/"/g, '""')}"`
                }
                return field
            })

            csvContent += escapedRow.join(",") + "\n"
        })

        // Create a Blob and download link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "staff_complete_data.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Use the officer store instead of mock data
    const { officers, fetchOfficers, updateOfficer, deleteOfficer } = useOfficerStore()

    // State for dialogs
    const [selectedStaff, setSelectedStaff] = useState<Officer | null>(null)
    const [dialogAction, setDialogAction] = useState<"view" | "edit" | "delete" | null>(null)

    // Initialize state for dialogs visibility
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Add CSS variables on component mount
    useEffect(() => {
        addCustomColorVars()
    }, [])

    // Move the conditional logic inside the useEffect hook
    useEffect(() => {
        setIsDetailDialogOpen(dialogAction === "view")
        setIsEditDialogOpen(dialogAction === "edit")
        setIsDeleteDialogOpen(dialogAction === "delete")
    }, [dialogAction])

    // Fetch officers when component mounts
    useEffect(() => {
        fetchOfficers()
    }, [fetchOfficers])

    // Format date for display
    const formatDate = (dateString: string | number | Date | undefined) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const handleRowClick = (staff: Officer, action: "view" | "edit" | "delete" = "view") => {
        setSelectedStaff(staff)
        setDialogAction(action)
    }

    // Handle edit staff
    const handleEditStaff = async (updatedStaff: Officer) => {
        if (updatedStaff._id) {
            try {
                const response = await updateOfficer(updatedStaff._id, updatedStaff)
                setDialogAction("view")
                toast.success(
                    response?.message ||
                    `${updatedStaff.firstName} ${updatedStaff.lastName}'s profile has been updated successfully.`,
                    {
                        duration: 3000,
                        position: "top-right",
                        style: {
                            background: "#8B4513",
                            color: "#fff",
                        },
                        iconTheme: {
                            primary: "#fff",
                            secondary: "#8B4513",
                        },
                    },
                )
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An error occurred while updating the profile"

                toast.error(errorMessage, {
                    duration: 3000,
                    position: "top-right",
                    style: {
                        background: "#DC143C",
                        color: "#fff",
                    },
                    iconTheme: {
                        primary: "#fff",
                        secondary: "#DC143C",
                    },
                })
            }
        }
    }

    // Handle delete staff
    const handleDeleteStaff = async (staffToDelete: Officer) => {
        if (staffToDelete._id) {
            try {
                const response = await deleteOfficer(staffToDelete._id)
                setDialogAction(null)
                toast.success(
                    response?.message || `${staffToDelete.firstName} ${staffToDelete.lastName}'s profile has been deleted.`,
                    {
                        duration: 3000,
                        position: "top-right",
                        style: {
                            background: "#DC143C",
                            color: "#fff",
                        },
                        iconTheme: {
                            primary: "#fff",
                            secondary: "#DC143C",
                        },
                    },
                )
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An error occurred while deleting the profile"

                toast.error(errorMessage, {
                    duration: 3000,
                    position: "top-right",
                    style: {
                        background: "#DC143C",
                        color: "#fff",
                    },
                    iconTheme: {
                        primary: "#fff",
                        secondary: "#DC143C",
                    },
                })
            }
        }
    }

    // Handle edit button click in detail dialog
    const handleEditButtonClick = () => {
        if (selectedStaff) {
            setDialogAction("edit")
        }
    }

    // Handle delete button click in detail dialog
    const handleDeleteButtonClick = () => {
        if (selectedStaff) {
            handleDeleteStaff(selectedStaff)
        }
    }

    // Filter staff based on search, rank, and level officer
    const filteredStaff = officers.filter((staff) => {
        // Search filter
        const searchMatch =
            (staff.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (staff.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (staff.serviceNumber?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (staff.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            false

        // Rank filter
        const rankMatch = selectedRank === "all" || staff.rank === selectedRank

        // Level officer filter
        const levelMatch =
            activeTab === "all" ||
            (activeTab === "junior" && staff.levelOfficer === "Junior Officer") ||
            (activeTab === "senior" && staff.levelOfficer === "Senior Officer")

        return searchMatch && rankMatch && levelMatch
    })

    const handleDialogClose = () => {
        setDialogAction(null)
    }

    return (
        <div className="p-6 space-y-6 dark:bg-transparent transition-all duration-300 min-h-screen shadow-none">
            {/* Header with title and search/filter */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Title card */}
                <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 p-4 rounded-xl shadow-md border border-[#8B4513]/10 flex items-center gap-4">
                    <div className="bg-[#8B4513]/10 p-3 rounded-full dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950">
                        <Users className="h-6 w-6 text-[#8B4513] dark:text-gray-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Staff Management</h1>
                        <p className="text-sm text-muted-foreground">Manage your organization&#39;s personnel</p>
                    </div>
                    <Badge
                        variant="outline"
                        className="ml-2 bg-[#8B4513]/10 text-[#8B4513] hover:bg-[#8B4513]/20 dark:text-gray-300"
                    >
                        {officers.length} Staff Members
                    </Badge>
                </div>

                {/* Search and filter card */}
                <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 p-4 rounded-xl shadow-md border border-[#8B4513]/10 flex flex-wrap items-center gap-3">
                    <div className="relative flex-grow max-w-xs">
                        <Input
                            type="search"
                            placeholder="Search by name, ID, email..."
                            className="pl-9 w-full bg-background border-[#8B4513]/20 focus-visible:ring-[#8B4513]/30 cursor-text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>

                    <Select value={selectedRank} onValueChange={setSelectedRank}>
                        <SelectTrigger className="w-[180px] border-[#8B4513]/20 focus:ring-[#8B4513]/30 cursor-pointer">
                            <SelectValue placeholder="Filter by rank" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="cursor-pointer">
                                All Ranks
                            </SelectItem>
                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Junior Officers</div>
                            {Object.keys(JuniorOfficerRank).map((rank) => (
                                <SelectItem key={rank} value={rank} className="cursor-pointer">
                                    {rank}
                                </SelectItem>
                            ))}
                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-2">Senior Officers</div>
                            {Object.keys(SeniorOfficerRank).map((rank) => (
                                <SelectItem key={rank} value={rank} className="cursor-pointer">
                                    {rank}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        className="border-[#8B4513]/20 text-[#8B4513] hover:bg-[#8B4513]/10 hover:text-[#8B4513] hover:border-[#8B4513]/30 dark:text-gray-400 cursor-pointer"
                        onClick={exportToExcel}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
                <TabsList className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 duration-300 p-1 border border-[#8B4513]/10 rounded-lg">
                    <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white rounded-md cursor-pointer"
                    >
                        All
                    </TabsTrigger>
                    <TabsTrigger
                        value="junior"
                        className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white rounded-md cursor-pointer"
                    >
                        Junior Officers
                    </TabsTrigger>
                    <TabsTrigger
                        value="senior"
                        className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white rounded-md cursor-pointer"
                    >
                        Senior Officers
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <StaffTableComponent staffMembers={filteredStaff} formatDate={formatDate} onRowClick={handleRowClick} />
                </TabsContent>
                <TabsContent value="junior">
                    <StaffTableComponent
                        staffMembers={filteredStaff.filter((staff) => staff.levelOfficer === "Junior Officer")}
                        formatDate={formatDate}
                        onRowClick={handleRowClick}
                    />
                </TabsContent>
                <TabsContent value="senior">
                    <StaffTableComponent
                        staffMembers={filteredStaff.filter((staff) => staff.levelOfficer === "Senior Officer")}
                        formatDate={formatDate}
                        onRowClick={handleRowClick}
                    />
                </TabsContent>
            </Tabs>

            {/* Staff Detail Dialog */}
            <StaffDetailDialog
                staff={selectedStaff}
                isOpen={isDetailDialogOpen}
                onClose={handleDialogClose}
                onEdit={handleEditButtonClick}
                onDelete={handleDeleteButtonClick}
                formatDate={formatDate}
            />

            {/* Staff Edit Dialog */}
            <StaffEditDialog
                staff={selectedStaff}
                isOpen={isEditDialogOpen}
                onClose={handleDialogClose}
                onSave={handleEditStaff}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                staff={selectedStaff}
                isOpen={isDeleteDialogOpen}
                onClose={handleDialogClose}
                onConfirm={handleDeleteStaff}
            />
            <Toaster />
        </div>
    )
}
