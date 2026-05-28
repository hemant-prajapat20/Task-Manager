import axiosInstance from "../utils/axiosInstance";

/**
 * User Service
 * Handles user management and permissions-related queries.
 */
const userService = {
  /**
   * Fetch a list of team members (Admin only).
   * Includes task counts per user.
   */
  async getUsers() {
    const response = await axiosInstance.get("/users/get-users");
    return response.data;
  },

  /**
   * Fetch a specific user's details by their ID.
   */
  async getUserById(id) {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Delete a user by their ID (Admin only).
   * Note: The current backend actually supports deleting a user (user_route line 11).
   */
  async deleteUser(id) {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  }
};

export default userService;
