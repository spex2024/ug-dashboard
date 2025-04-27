import { Shield, User, Users } from "lucide-react"

interface RoleBadgeProps {
    role: string
    size?: "sm" | "md" | "lg"
    showIcon?: boolean
}

export function RoleBadge({ role, size = "md", showIcon = true }: RoleBadgeProps) {
    // Convert role to title case
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()

    // Determine icon based on role
    const getIcon = () => {
        switch (role.toLowerCase()) {
            case "admin":
                return <Shield className={iconSize} />
            case "super-admin":
                return <Shield className={iconSize} />
            case "moderator":
                return <Users className={iconSize} />
            default:
                return <User className={iconSize} />
        }
    }

    // Size classes
    const sizeClasses = {
        sm: "text-xs py-0.5 px-1.5",
        md: "text-sm py-1 px-2",
        lg: "text-base py-1.5 px-3",
    }

    const iconSize = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    }[size]

    return (
        <div className={`inline-flex items-center gap-1 ${sizeClasses[size]}`}>
            {showIcon && <span className="text-[#DC143C]">{getIcon()}</span>}
            <span className="font-medium">
        {formattedRole}
      </span>
        </div>
    )
}
