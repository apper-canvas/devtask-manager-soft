import { useState } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"

const AddTaskModal = ({ isOpen, onClose, projects, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "medium"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error("Task title is required")
      return
    }

    setIsSubmitting(true)
    try {
      const newTask = await taskService.create({
        ...formData,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      onTaskAdded(newTask)
      setFormData({
        title: "",
        description: "",
        projectId: "",
        priority: "medium"
      })
      onClose()
      toast.success("Task created successfully!")
    } catch (error) {
      toast.error("Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-gray-600 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-mono font-semibold text-white">Add New Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Title
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project
            </label>
            <Select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
            >
              <option value="">Select a project...</option>
              {projects.map(project => (
                <option key={project.Id} value={project.Id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTaskModal