import React from "react"
import { cn } from "@/utils/cn"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-600 bg-surface p-6 shadow-sm transition-all hover:scale-[1.02] hover:border-gray-500",
      className
    )}
    {...props}
  />
))

Card.displayName = "Card"

export default Card