class ProjectService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'project_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "repositoryUrl_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "createdAt_c",
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
      return response.data.map(project => ({
        Id: project.Id,
        name: project.Name || "",
        description: project.description_c || "",
        color: project.color_c || "#00D9FF",
createdAt: project.createdAt_c || new Date().toISOString(),
        repositoryUrl: project.repositoryUrl_c || "",
        tags: project.Tags || "",
        owner: project.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message);
      } else {
        console.error("Error fetching projects:", error.message);
      }
      return [];
    }
  }

  async getAll() {
    try {
      // Initialize ApperClient with Project ID and Public Key
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          },
          {
            field: {
              Name: "Owner"
            }
          },
          {
            field: {
              Name: "CreatedOn"
            }
          },
          {
            field: {
              Name: "color_c"
            }
          },
          {
            field: {
              Name: "createdAt_c"
            }
          },
          {
            field: {
              Name: "description_c"
            }
          },
          {
            field: {
              Name: "repositoryUrl_c"
            }
          }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('project_c', params);

      // Handle response
      if (!response.success) {
        console.error("Error fetching projects:", response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI properties
      return response.data.map(project => ({
        id: project.Id,
        name: project.Name || "",
        description: project.description_c || "",
        color: project.color_c || "#00D9FF",
        createdAt: project.createdAt_c || project.CreatedOn || new Date().toISOString(),
        repositoryUrl: project.repositoryUrl_c || "",
        tags: project.Tags || "",
        owner: project.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message);
      } else {
        console.error("Error fetching projects:", error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Project ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "repositoryUrl_c" } },
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
        throw new Error(`Project not found with ID: ${id}`);
      }

      // Map database fields to UI format
      return {
        Id: response.data.Id,
        name: response.data.Name || "",
        description: response.data.description_c || "",
        color: response.data.color_c || "#00D9FF",
        createdAt: response.data.createdAt_c || new Date().toISOString(),
        repositoryUrl: response.data.repositoryUrl_c || "",
        tags: response.data.Tags || "",
        owner: response.data.Owner || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching project with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async create(projectData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: projectData.name || "",
            description_c: projectData.description || "",
            color_c: projectData.color || "#00D9FF",
            repositoryUrl_c: projectData.repositoryUrl || "",
            createdAt_c: new Date().toISOString(),
            Tags: projectData.tags || "",
            // Owner field should be set to current user if available
            Owner: projectData.owner || null
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
          console.error(`Failed to create project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const project = successfulRecords[0].data;
          // Map database fields to UI format
          return {
            Id: project.Id,
            name: project.Name || "",
            description: project.description_c || "",
            color: project.color_c || "#00D9FF",
            createdAt: project.createdAt_c || new Date().toISOString(),
            repositoryUrl: project.repositoryUrl_c || "",
            tags: project.Tags || "",
            owner: project.Owner || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error?.response?.data?.message);
      } else {
        console.error("Error creating project:", error.message);
      }
      throw error;
    }
  }

  async update(id, projectData) {
    try {
      if (!id) {
        throw new Error("Project ID is required");
      }

      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: projectData.name || "",
            description_c: projectData.description || "",
            color_c: projectData.color || "#00D9FF",
            repositoryUrl_c: projectData.repositoryUrl || "",
            Tags: projectData.tags || "",
            Owner: projectData.owner || null
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
          console.error(`Failed to update project ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const project = successfulUpdates[0].data;
          // Map database fields to UI format
          return {
            Id: project.Id,
            name: project.Name || "",
            description: project.description_c || "",
            color: project.color_c || "#00D9FF",
            createdAt: project.createdAt_c || new Date().toISOString(),
            repositoryUrl: project.repositoryUrl_c || "",
            tags: project.Tags || "",
            owner: project.Owner || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project:", error?.response?.data?.message);
      } else {
        console.error("Error updating project:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error("Project ID is required for deletion");
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
          console.error(`Failed to delete project ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
      } else {
        console.error("Error deleting project:", error.message);
      }
      throw error;
    }
  }
}

export const projectService = new ProjectService()