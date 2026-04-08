import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { PRIORITY_DATA } from "../../utils/data"

const CreateTask = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: ""
  })

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/get-users")
      if (response.data) {
        setUsers(response.data)
      }
    } catch (error) {
      console.log("Error fetching users:", error)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.assignedTo) return toast.error("Please assign to a user")
    
    setLoading(true)
    try {
      const taskData = {
        ...formData,
        assignedTo: [formData.assignedTo] // Backend expects an array
      }
      const response = await axiosInstance.post("/tasks/create", taskData)
      if (response.data) {
        toast.success("Task created successfully")
        navigate("/admin/tasks")
      }
    } catch (error) {
      console.log("Error creating task:", error)
      toast.error(error.response?.data?.message || "Failed to create task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout activeMenu={"Create Task"}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <h2 className="text-3xl font-bold">Create New Task</h2>
            <p className="text-blue-100 mt-2">Assign a new task to your team members</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Task Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter task title..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Description</label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="What needs to be done?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Priority</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  {PRIORITY_DATA.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Due Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Assign To</label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.assignedTo}
                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
              >
                <option value="">Select a team member</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CreateTask
