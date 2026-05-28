import axiosInstance from "../utils/axiosInstance";

/**
 * Task Management Service
 * Handles CRUD operations, status updates, and dashboard statistics for tasks.
 */
const taskService = {
  /**
   * Fetch all tasks with optional status filter.
   * Admins get all, users get their assigned tasks.
   */
  async getTasks(status = "") {
    const url = status ? `/tasks?status=${status}` : "/tasks";
    const response = await axiosInstance.get(url);
    return response.data;
  },

  /**
   * Create a new task (Admin only).
   */
  async createTask(taskData) {
    const response = await axiosInstance.post("/tasks/create", taskData);
    return response.data;
  },

  /**
   * Update task details (Admin only).
   */
  async updateTask(id, taskData) {
    const response = await axiosInstance.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  /**
   * Delete a task (Admin only).
   */
  async deleteTask(id) {
    const response = await axiosInstance.delete(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Update task status (Pending, In Progress, Completed).
   */
  async updateTaskStatus(id, status) {
    const response = await axiosInstance.put(`/tasks/${id}/status`, { status });
    return response.data;
  },

  /**
   * Update task checklist and recalculate progress.
   */
  async updateTaskChecklist(id, todoChecklist) {
    const response = await axiosInstance.put(`/tasks/${id}/todo`, { todoChecklist });
    return response.data;
  },

  /**
   * Fetch dashboard statistics for Admin.
   */
  async getAdminDashboardData() {
    const response = await axiosInstance.get("/tasks/dashboard-data");
    return response.data;
  },

  /**
   * Fetch dashboard statistics for individual User.
   */
  async getUserDashboardData() {
    const response = await axiosInstance.get("/tasks/user-dashboard-data");
    return response.data;
  },

  /**
   * Fetch a single task by its ID.
   */
  async getTaskById(id) {
    const response = await axiosInstance.get(`/tasks/${id}`);
    return response.data;
  }
};

export default taskService;
