import tasksData from "@/services/mockData/tasks.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await delay(200)
    const task = this.tasks.find(task => task.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  }

  async create(taskData) {
    await delay(400)
    const newTask = {
      ...taskData,
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1
    }
    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, taskData) {
    await delay(300)
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    this.tasks[index] = { ...taskData, Id: parseInt(id) }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    const deletedTask = this.tasks.splice(index, 1)[0]
return { ...deletedTask }
  }

  async setActive(id) {
    await delay(200)
    const task = this.tasks.find(task => task.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    // In a real app, this would mark the task as active in the backend
    // For now, we'll just simulate the API call
    return { ...task }
  }
}

export const taskService = new TaskService()