"use client"

import { useForm } from "react-hook-form"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "@/lib/auth-store"
import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface FormValues {
    username: string
    password: string
}

const backgroundImages = ["https://res.cloudinary.com/ddwet1dzj/image/upload/v1745722276/samples/pexels-photo-2030190_ewl2il.jpg",
    "https://res.cloudinary.com/ddwet1dzj/image/upload/v1745722235/samples/industrial-firefighting-med-min.jpg_dllqbe.webp",
    "https://res.cloudinary.com/ddwet1dzj/image/upload/v1745722267/samples/premium_photo-1661490162121-41df314e1ef1_va7yrq.jpg"]

export default function AdminLoginForm() {
    const { isLoading, error, showPassword, setShowPassword, login} = useAuthStore()
    const router = useRouter()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            username: "",
            password: "",
        },
    })



    // Slideshow effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const onSubmit = async (data: FormValues) => {
        const success = await login(data.username, data.password)
        if (success) {
            reset() // Reset form on successful submission
            router.push("/dashboard") // Redirect to dashboard
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center relative px-4 bg-[#8B4513] overflow-hidden">
            {/* Toast container */}
            <Toaster position="top-right" />

            {/* Background slideshow with Framer Motion */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                    >
                        <Image
                            src={backgroundImages[currentImageIndex] || "/placeholder.svg"}
                            alt="Firefighting background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#8B4513]/40 to-black/40 z-20"></div>
            </div>

            {/* Logo/Brand element */}
            <div className="absolute top-30 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="sm:w-24 sm:h-24 relative rounded-2xl">
                        <Image src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1745603414/samples/gE0ZW3qx_400x400_kyfgdz.jpg" alt="University of Ghana Fire Station Logo" fill className="object-cover rounded-2xl"  />
                    </div>
                    <h1 className="text-white text-4xl font-bold text-center mt-2">University of Ghana Fire Station</h1>
                </div>
            </div>

            <Card className="w-full max-w-md relative z-10 border-none shadow-2xl bg-white rounded-xl overflow-hidden mt-64">
                <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>

                <CardHeader className="space-y-1 pb-2 pt-6">
                    <CardTitle className="text-2xl font-bold text-center text-[#8B4513]">Admin Login</CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Enter your credentials to access the admin panel
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-5 pt-4">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 text-sm text-white bg-red-500 rounded-md shadow-md"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-[#8B4513] font-medium">
                                Username
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-3 text-[#8B4513]">
                                    <User className="h-4 w-4" />
                                </div>
                                <Input
                                    id="username"
                                    placeholder="Enter your username"
                                    className={`pl-10 border-2 transition-all duration-200 focus-visible:ring-[#8B4513]/20 focus-visible:border-[#8B4513] ${
                                        errors.username
                                            ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                                            : "border-gray-200"
                                    }`}
                                    disabled={isLoading}
                                    {...register("username", { required: "Username is required" })}
                                />
                            </div>
                            {errors.username && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">
                                    {errors.username.message}
                                </motion.p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[#8B4513] font-medium">
                                Password
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-3 text-[#8B4513]">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className={`pl-10 pr-10 border-2 transition-all duration-200 focus-visible:ring-[#8B4513]/20 focus-visible:border-[#8B4513] ${
                                        errors.password
                                            ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                                            : "border-gray-200"
                                    }`}
                                    disabled={isLoading}
                                    {...register("password", { required: "Password is required" })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-400 hover:text-[#8B4513] transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">
                                    {errors.password.message}
                                </motion.p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="pt-2 pb-6 flex flex-col gap-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#8B4513] to-red-700 hover:from-[#8B4513]/90 hover:to-red-700/90 text-white font-medium py-6 transition-all duration-300 shadow-md hover:shadow-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                      <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                      ></circle>
                      <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </motion.div>

                        <div className="w-full flex items-center gap-2 mt-2">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-xs text-gray-500">Secure Login</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>
                    </CardFooter>
                </form>
            </Card>

            {/* Footer */}
            <div className="absolute bottom-4 left-0 w-full text-center text-white/70 text-xs">
                © {new Date().getFullYear()} University of Ghana Fire Station
            </div>
        </div>
    )
}
