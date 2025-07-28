import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const NavigationItem = ({ to, icon, children, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 border-l-4 border-transparent",
          isActive 
            ? "bg-primary/10 text-primary border-l-primary" 
            : "text-gray-300 hover:text-white hover:bg-surface/50",
          className
        )
      }
    >
      <ApperIcon name={icon} size={20} />
      <span>{children}</span>
    </NavLink>
  )
}

export default NavigationItem