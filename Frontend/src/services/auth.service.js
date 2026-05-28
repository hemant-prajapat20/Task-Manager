import axiosInstance from "../utils/axiosInstance";

/**
 * Authentication Service
 * Handles user login, signup, profile management, and logout.
 */
const authService = {
  /**
   * Register a new user.
   */
  async signup(userData) {
    const response = await axiosInstance.post("/auth/signup", userData);
    return response.data;
  },

  /**
   * Log in an existing user.
   */
  async signin(email, password) {
    const response = await axiosInstance.post("/auth/signin", { email, password });
    return response.data;
  },

  /**
   * Log out the current user.
   */
  async signout() {
    const response = await axiosInstance.post("/auth/sign-out");
    return response.data;
  },

  /**
   * Fetch the current user's profile.
   */
  async getUserProfile() {
    const response = await axiosInstance.get("/auth/user-profile");
    return response.data;
  },

  /**
   * Update the current user's profile.
   */
  async updateProfile(profileData) {
    const response = await axiosInstance.put("/auth/update-profile", profileData);
    return response.data;
  },

  /**
   * Upload a profile image.
   */
  async uploadImage(formData) {
    const response = await axiosInstance.post("/auth/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
};

export default authService;
