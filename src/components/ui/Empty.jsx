import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by creating your first item", 
  action,
  actionLabel = "Get Started",
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} size={40} className="text-primary" />
      </div>
      <div className="text-center max-w-md">
        <h3 className="text-xl font-mono font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        {action && (
          <Button onClick={action}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Empty