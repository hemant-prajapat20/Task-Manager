import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance"
import moment from "moment"
import toast from "react-hot-toast"
import { PRIORITY_DATA } from "../../utils/data"

const TaskDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  const getTaskDetails = async () => {
    try {
      const response = await axiosInstance.get(`/tasks/${id}`)
      if (response.data) {
        setTask(response.data)
      }
    } catch (error) {
      console.log("Error fetching task details:", error)
      toast.error("Failed to load task details")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus) => {
    try {
      const response = await axiosInstance.put(`/tasks/update-status/${id}`, { status: newStatus })
      if (response.data) {
        toast.success(`Status updated to ${newStatus}`)
        getTaskDetails()
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const toggleChecklistItem = async (index) => {
    const updatedChecklist = [...task.todoChecklist]
    updatedChecklist[index].completed = !updatedChecklist[index].completed
    
    try {
      const response = await axiosInstance.put(`/tasks/update-checklist/${id}`, { todoChecklist: updatedChecklist })
      if (response.data) {
        setTask(response.data.task)
      }
    } catch (error) {
      toast.error("Failed to update checklist")
    }
  }

  useEffect(() => {
    getTaskDetails()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout activeMenu={"My Tasks"}>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!task) {
    return (
      <DashboardLayout activeMenu={"My Tasks"}>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800">Task Not Found</h2>
          <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <button onClick={() => navigate(-1)} className="hover:text-blue-600">Tasks</button>
          <span>/</span>
          <span className="font-semibold text-gray-800">Details</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className={`h-3 ${
            task.priority === "High" ? "bg-red-500" : task.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
          }`} />
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    task.status === "Completed" ? "bg-green-100 text-green-700" : task.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {task.status}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm font-medium text-gray-500">Created {moment(task.createdAt).fromNow()}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{task.title}</h1>
              </div>

              <div className="flex gap-2">
                {["Pending", "In Progress", "Completed"].map(s => (
                  <button
                    key={s}
                    disabled={task.status === s}
                    onClick={() => updateStatus(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      task.status === s 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    Set {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{task.description}</p>
                </div>

                {task.todoChecklist?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                      Checklist ({task.todoChecklist.filter(i => i.completed).length}/{task.todoChecklist.length})
                    </h3>
                    <div className="space-y-3">
                      {task.todoChecklist.map((item, index) => (
                        <div 
                          key={index} 
                          onClick={() => toggleChecklistItem(index)}
                          className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer group"
                        >
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            item.completed ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"
                          }`}>
                            {item.completed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className={`text-lg transition-all ${item.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                            {item.item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Task Info</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">DUE DATE</label>
                      <p className="font-bold text-gray-900">{moment(task.dueDate).format("MMMM Do, YYYY")}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">PRIORITY</label>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${task.priority === "High" ? "bg-red-500" : "bg-yellow-500"}`} />
                        <p className="font-bold text-gray-900">{task.priority}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">PROGRESS</label>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${task.progress || 0}%` }}></div>
                      </div>
                      <p className="text-xs font-bold text-gray-900 text-right">{task.progress || 0}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Assigned Team</h3>
                  <div className="flex flex-col gap-3">
                    {task.assignedTo?.map(user => (
                      <div key={user._id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                          {user.profileImageUrl ? <img src={user.profileImageUrl} alt="" /> : user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TaskDetails
