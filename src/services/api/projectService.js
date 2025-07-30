import projectsData from "@/services/mockData/projects.json"
import { taskService } from "@/services/api/taskService"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ProjectService {
  constructor() {
    this.projects = [...projectsData]
  }

  async getAll() {
    await delay(250)
    return [...this.projects]
  }

async getById(id) {
    await delay(200)
    
    // Validate ID parameter
    if (!id) {
      throw new Error("Project ID is required")
    }
    
    // Convert ID to string for consistent comparison (handles both string and number IDs)
    const searchId = String(id)
    const project = this.projects.find(project => String(project.Id) === searchId)
    
    if (!project) {
      console.error(`Project not found. Searched for ID: "${searchId}", Available IDs: [${this.projects.map(p => `"${p.Id}"`).join(', ')}]`)
      throw new Error(`Project not found with ID: ${searchId}`)
    }
    
    return { ...project }
  }

async create(projectData) {
    await delay(350)
    const newProject = {
      ...projectData,
      Id: Math.max(...this.projects.map(p => parseInt(p.Id)), 0) + 1,
      createdAt: new Date().toISOString()
    }
    this.projects.unshift(newProject)
    return { ...newProject }
  }

async update(id, projectData) {
    await delay(300)
    const projectId = parseInt(id)
    const index = this.projects.findIndex(project => parseInt(project.Id) === projectId)
    if (index === -1) {
      throw new Error("Project not found")
    }
    this.projects[index] = { 
      ...this.projects[index],
      ...projectData, 
      Id: projectId,
      updatedAt: new Date().toISOString()
    }
    return { ...this.projects[index] }
  }

async delete(id) {
    await delay(250)
    
    // Validate ID parameter
    if (!id) {
      throw new Error("Project ID is required for deletion")
    }
    
    // Convert ID to string for consistent comparison
    const searchId = String(id)
    const index = this.projects.findIndex(project => String(project.Id) === searchId)
    
    if (index === -1) {
      console.error(`Project deletion failed. Searched for ID: "${searchId}", Available IDs: [${this.projects.map(p => `"${p.Id}"`).join(', ')}]`)
      throw new Error(`Project not found with ID: ${searchId}. Cannot delete non-existent project.`)
    }
    
    const projectToDelete = this.projects[index]
    
    try {
      // Delete all tasks associated with this project first
      await taskService.deleteByProjectId(searchId)
      
      // Remove project from array
      const deletedProject = this.projects.splice(index, 1)[0]
      console.log(`Successfully deleted project "${deletedProject.name}" with ID: ${searchId}`)
      
      return { ...deletedProject }
    } catch (error) {
      console.error(`Error during project deletion process for ID ${searchId}:`, error)
      throw new Error(`Failed to delete project: ${error.message}`)
    }
  }
}

export const projectService = new ProjectService()