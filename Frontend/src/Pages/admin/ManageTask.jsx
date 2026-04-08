import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance"
import TaskCard from "../../components/TaskCard"
import TaskStatusTabs from "../../components/TaskStatusTabs"
import toast from "react-hot-toast"

const ManageTask = () => {
  const [tasks, setTasks] = useState([])
  const [filterStatus, setFilterStatus] = useState("All")
  const [tabs, setTabs] = useState([
    { label: "All", count: 0 },
    { label: "Pending", count: 0 },
    { label: "In Progress", count: 0 },
    { label: "Completed", count: 0 },
  ])

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks", {
        params: { status: filterStatus === "All" ? "" : filterStatus }
      })
      if (response.data) {
        setTasks(response.data.tasks || [])
        const summary = response.data.statusSummary || {}
        setTabs([
          { label: "All", count: summary.all || 0 },
          { label: "Pending", count: summary.pendingTasks || 0 },
          { label: "In Progress", count: summary.inProgressTasks || 0 },
          { label: "Completed", count: summary.completedTasks || 0 },
        ])
      }
    } catch (error) {
      console.log("Error fetching tasks:", error)
      toast.error("Failed to fetch tasks")
    }
  }

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return
    try {
      await axiosInstance.delete(`/tasks/${id}`)
      toast.success("Task deleted successfully")
      getAllTasks()
    } catch (error) {
      toast.error("Failed to delete task")
    }
  }

  useEffect(() => {
    getAllTasks()
  }, [filterStatus])

  return (
    <DashboardLayout activeMenu={"Manage Task"}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Manage Tasks</h2>
          <TaskStatusTabs tabs={tabs} activeTab={filterStatus} setActiveTab={setFilterStatus} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task._id} className="relative group">
                <TaskCard 
                  {...task} 
                  assignedTo={task.assignedTo?.map(u => u.profileImage)}
                  onClick={() => {}} 
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}
                  className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No tasks found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageTask
