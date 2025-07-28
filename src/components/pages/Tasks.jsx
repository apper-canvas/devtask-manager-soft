import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import TaskCard from "@/components/molecules/TaskCard"
import AddTaskModal from "@/components/molecules/AddTaskModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { taskService } from "@/services/api/taskService"
import { projectService } from "@/services/api/projectService"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [filter, setFilter] = useState("all")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ])
      setTasks(tasksData)
      setProjects(projectsData)
    } catch (err) {
      setError("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev])
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true
    return task.status === filter
  })

  const getFilterCount = (status) => {
    if (status === "all") return tasks.length
    return tasks.filter(task => task.status === status).length
  }

  if (loading) return <Loading message="Loading tasks..." />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white mb-2">Tasks</h1>
          <p className="text-gray-400">Manage and track all your development tasks</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-surface/50 p-1 rounded-lg w-fit">
        {[
          { key: "all", label: "All", count: getFilterCount("all") },
          { key: "todo", label: "To Do", count: getFilterCount("todo") },
          { key: "inProgress", label: "In Progress", count: getFilterCount("inProgress") },
          { key: "done", label: "Done", count: getFilterCount("done") }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === tab.key
                ? "bg-primary text-background"
                : "text-gray-400 hover:text-white hover:bg-surface"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="grid gap-4">
          {filteredTasks.map(task => {
            const project = projects.find(p => p.Id === task.projectId)
            return (
              <TaskCard
                key={task.Id}
                task={task}
                project={project}
                onTaskUpdate={handleTaskUpdate}
              />
            )
          })}
        </div>
      ) : (
        <Empty
          title={filter === "all" ? "No tasks yet" : `No ${filter === "inProgress" ? "in progress" : filter} tasks`}
          description={filter === "all" 
            ? "Create your first task to get started with your development workflow"
            : `You don't have any ${filter === "inProgress" ? "in progress" : filter} tasks at the moment`
          }
          action={() => setIsAddModalOpen(true)}
          actionLabel="Create Task"
          icon="CheckSquare"
        />
      )}

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        projects={projects}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  )
}

export default Tasks