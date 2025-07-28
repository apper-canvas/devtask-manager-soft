import React from "react"
import { cn } from "@/utils/cn"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-600 text-white",
    critical: "bg-error text-white",
    high: "bg-warning text-background",
    medium: "bg-info text-background",
    low: "bg-gray-500 text-white",
    todo: "bg-gray-600 text-white",
    inProgress: "bg-warning text-background",
    done: "bg-success text-background"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export default Badge