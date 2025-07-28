import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    primary: "bg-primary text-background hover:bg-primary/90",
    secondary: "bg-secondary text-white hover:bg-secondary/90",
    accent: "bg-accent text-background hover:bg-accent/90",
    ghost: "bg-transparent text-white hover:bg-surface border border-gray-600",
    outline: "border border-primary text-primary hover:bg-primary hover:text-background"
  }
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg"
  }
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button