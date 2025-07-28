import ApperIcon from "@/components/ApperIcon"

const Header = () => {
  return (
    <header className="h-16 bg-surface border-b border-gray-600 flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
          <ApperIcon name="Code2" size={18} className="text-background" />
        </div>
        <h1 className="text-xl font-mono font-bold text-white">DevTask Manager</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-xs text-gray-400">
          {new Date().toLocaleDateString("en-US", { 
            weekday: "short", 
            month: "short", 
            day: "numeric" 
          })}
        </div>
        <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center">
          <ApperIcon name="User" size={16} className="text-white" />
        </div>
      </div>
    </header>
  )
}

export default Header