import axiosInstance from "../utils/axiosInstance";

/**
 * Report Service
 * Handles downloading of Excel reports using browser-based file downloads.
 */
const reportService = {
  /**
   * Export detailed task report as an Excel file.
   */
  async exportTasks() {
    const response = await axiosInstance.get("/reports/tasks", {
      responseType: "blob", // Important for handling binary data
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tasks_report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  },

  /**
   * Export user task summary report as an Excel file.
   */
  async exportUsers() {
    const response = await axiosInstance.get("/reports/users", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users_report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
};

export default reportService;
