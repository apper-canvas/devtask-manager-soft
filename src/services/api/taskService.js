class TaskService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "projectId_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } },
          { field: { Name: "gitBranch_c" } },
          { field: { Name: "codeSnippet_c" } },
          { field: { Name: "resourceLinks_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "updatedAt_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Handle empty results
      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || "",
        description: task.description_c || "",
        projectId: task.projectId_c?.Id || task.projectId_c || null,
        priority: task.priority_c || "medium",
        status: task.status_c || "todo",
        createdAt: task.createdAt_c || new Date().toISOString(),
        updatedAt: task.updatedAt_c || new Date().toISOString(),
        gitBranch: task.gitBranch_c || "",
        codeSnippet: task.codeSnippet_c || "",
        resourceLinks: task.resourceLinks_c || "",
        tags: task.Tags || "",
        owner: task.Owner || null,
        isActive: false // This would need custom logic or separate table
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error("Error fetching tasks:", error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Task ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "projectId_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } },
          { field: { Name: "gitBranch_c" } },
          { field: { Name: "codeSnippet_c" } },
          { field: { Name: "resourceLinks_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Task not found with ID: ${id}`);
      }

      // Map database fields to UI format
      return {
        Id: response.data.Id,
        title: response.data.title_c || response.data.Name || "",
        description: response.data.description_c || "",
        projectId: response.data.projectId_c?.Id || response.data.projectId_c || null,
        priority: response.data.priority_c || "medium",
        status: response.data.status_c || "todo",
        createdAt: response.data.createdAt_c || new Date().toISOString(),
        updatedAt: response.data.updatedAt_c || new Date().toISOString(),
        gitBranch: response.data.gitBranch_c || "",
        codeSnippet: response.data.codeSnippet_c || "",
        resourceLinks: response.data.resourceLinks_c || "",
        tags: response.data.Tags || "",
        owner: response.data.Owner || null,
        isActive: false
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching task with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async create(taskData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: taskData.title || "",
            title_c: taskData.title || "",
            description_c: taskData.description || "",
            projectId_c: taskData.projectId ? parseInt(taskData.projectId) : null,
            priority_c: taskData.priority || "medium",
            status_c: taskData.status || "todo",
            createdAt_c: new Date().toISOString(),
            updatedAt_c: new Date().toISOString(),
            gitBranch_c: taskData.gitBranch || "",
            codeSnippet_c: taskData.codeSnippet || "",
            resourceLinks_c: taskData.resourceLinks || "",
            Tags: taskData.tags || "",
            Owner: taskData.owner || null
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create task ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          // Map database fields to UI format
          return {
            Id: task.Id,
            title: task.title_c || task.Name || "",
            description: task.description_c || "",
            projectId: task.projectId_c?.Id || task.projectId_c || null,
            priority: task.priority_c || "medium",
            status: task.status_c || "todo",
            createdAt: task.createdAt_c || new Date().toISOString(),
            updatedAt: task.updatedAt_c || new Date().toISOString(),
            gitBranch: task.gitBranch_c || "",
            codeSnippet: task.codeSnippet_c || "",
            resourceLinks: task.resourceLinks_c || "",
            tags: task.Tags || "",
            owner: task.Owner || null,
            isActive: false
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error("Error creating task:", error.message);
      }
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      if (!id) {
        throw new Error("Task ID is required");
      }

      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: taskData.title || "",
            title_c: taskData.title || "",
            description_c: taskData.description || "",
            projectId_c: taskData.projectId ? parseInt(taskData.projectId) : null,
            priority_c: taskData.priority || "medium",
            status_c: taskData.status || "todo",
            updatedAt_c: new Date().toISOString(),
            gitBranch_c: taskData.gitBranch || "",
            codeSnippet_c: taskData.codeSnippet || "",
            resourceLinks_c: taskData.resourceLinks || "",
            Tags: taskData.tags || "",
            Owner: taskData.owner || null
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update task ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          // Map database fields to UI format
          return {
            Id: task.Id,
            title: task.title_c || task.Name || "",
            description: task.description_c || "",
            projectId: task.projectId_c?.Id || task.projectId_c || null,
            priority: task.priority_c || "medium",
            status: task.status_c || "todo",
            createdAt: task.createdAt_c || new Date().toISOString(),
            updatedAt: task.updatedAt_c || new Date().toISOString(),
            gitBranch: task.gitBranch_c || "",
            codeSnippet: task.codeSnippet_c || "",
            resourceLinks: task.resourceLinks_c || "",
            tags: task.Tags || "",
            owner: task.Owner || null,
            isActive: taskData.isActive || false
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error("Error updating task:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error("Task ID is required");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete task ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error("Error deleting task:", error.message);
      }
      throw error;
    }
  }

  async deleteByProjectId(projectId) {
    try {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      // First fetch all tasks for this project
      const params = {
        fields: [
          { field: { Name: "Id" } }
        ],
        where: [
          {
            FieldName: "projectId_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Delete all tasks for this project
      const taskIds = response.data.map(task => task.Id);
      const deleteParams = {
        RecordIds: taskIds
      };

      const deleteResponse = await this.apperClient.deleteRecord(this.tableName, deleteParams);
      
      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        throw new Error(deleteResponse.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting tasks by project ID:", error?.response?.data?.message);
      } else {
        console.error("Error deleting tasks by project ID:", error.message);
      }
      return [];
    }
  }

  async setActive(id) {
    try {
      // For now, just return the task with isActive flag
      // In a real implementation, you might have a separate field or table for active status
      const task = await this.getById(id);
      return { ...task, isActive: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error setting active task:", error?.response?.data?.message);
      } else {
        console.error("Error setting active task:", error.message);
      }
      throw error;
    }
  }

  async getActiveTask() {
    try {
      // For mock purposes, return null since we don't have active task tracking in DB yet
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error getting active task:", error?.response?.data?.message);
      } else {
        console.error("Error getting active task:", error.message);
      }
      return null;
    }
  }
}

export const taskService = new TaskService()