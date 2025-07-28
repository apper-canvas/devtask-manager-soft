import { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import ProjectCard from "@/components/molecules/ProjectCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { taskService } from "@/services/api/taskService"
import { projectService } from "@/services/api/projectService"

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ])
      setProjects(projectsData)
      setTasks(tasksData)
    } catch (err) {
      setError("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading message="Loading projects..." />
  if (error) return <Error message={error} onRetry={loadData} />

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId)
    const completed = projectTasks.filter(task => task.status === "done")
    return {
      total: projectTasks.length,
      completed: completed.length
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Organize your tasks into meaningful projects</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <ApperIcon name="FolderOpen" size={16} />
          <span>{projects.length} project{projects.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map(project => {
            const stats = getProjectStats(project.Id)
            return (
              <ProjectCard
                key={project.Id}
                project={project}
                taskCount={stats.total}
                completedCount={stats.completed}
              />
            )
          })}
        </div>
      ) : (
        <Empty
          title="No projects yet"
          description="Projects help you organize related tasks and track progress more effectively"
          icon="FolderOpen"
        />
      )}

      {/* Project Stats Summary */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-600">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary mb-1">
              {projects.length}
            </div>
            <div className="text-sm text-gray-400">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-warning mb-1">
              {projects.reduce((acc, project) => {
                const stats = getProjectStats(project.Id)
                return acc + stats.total
              }, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-success mb-1">
              {projects.reduce((acc, project) => {
                const stats = getProjectStats(project.Id)
                return acc + stats.completed
              }, 0)}
            </div>
            <div className="text-sm text-gray-400">Completed Tasks</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects