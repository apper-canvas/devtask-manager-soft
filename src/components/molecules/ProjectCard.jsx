import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const ProjectCard = ({ project, taskCount, completedCount }) => {
  const progressPercentage = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0

  return (
    <Card className="p-6 hover:border-primary/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-mono font-semibold text-white mb-2">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-gray-400 mb-3">{project.description}</p>
          )}
          <p className="text-xs text-gray-500">
            Created {format(new Date(project.createdAt), "MMM d, yyyy")}
          </p>
        </div>
        
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: project.color }}
        >
          {project.name.charAt(0).toUpperCase()}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Tasks</span>
          <span className="text-white font-medium">{taskCount}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Completed</span>
          <span className="text-success font-medium">{completedCount}</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{progressPercentage}% complete</span>
          <div className="flex items-center space-x-1 text-gray-500">
            <ApperIcon name="TrendingUp" size={12} />
            <span>Active</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProjectCard