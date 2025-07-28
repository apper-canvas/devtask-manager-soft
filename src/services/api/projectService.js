import projectsData from "@/services/mockData/projects.json"

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
    const project = this.projects.find(project => project.Id === id)
    if (!project) {
      throw new Error("Project not found")
    }
    return { ...project }
  }

  async create(projectData) {
    await delay(350)
    const newProject = {
      ...projectData,
      Id: (Math.max(...this.projects.map(p => parseInt(p.Id)), 0) + 1).toString()
    }
    this.projects.unshift(newProject)
    return { ...newProject }
  }

  async update(id, projectData) {
    await delay(300)
    const index = this.projects.findIndex(project => project.Id === id)
    if (index === -1) {
      throw new Error("Project not found")
    }
    this.projects[index] = { ...projectData, Id: id }
    return { ...this.projects[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.projects.findIndex(project => project.Id === id)
    if (index === -1) {
      throw new Error("Project not found")
    }
    const deletedProject = this.projects.splice(index, 1)[0]
    return { ...deletedProject }
  }
}

export const projectService = new ProjectService()