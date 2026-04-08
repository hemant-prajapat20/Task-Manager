import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance"
import moment from "moment"
import RecentTasks from "../../components/RecentTasks"

const UserDashboard = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [dashboardData, setDashboardData] = useState(null)

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/user-dashboard-data")
      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.log("Error fetching dashboard data: ", error)
    }
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Hello, {currentUser?.name}!
              </h2>
              <p className="text-indigo-100 mt-1">
                {moment().format("dddd Do MMMM YYYY")}
              </p>
            </div>
          </div>
        </div>

        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
              <h3 className="text-gray-500 text-sm font-medium">My Total Tasks</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboardData?.stats?.totalTasks || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
              <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboardData?.stats?.pendingTasks || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboardData?.stats?.inProgressTasks || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <h3 className="text-gray-500 text-sm font-medium">Completed</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboardData?.stats?.completedTasks || 0}
              </p>
            </div>
          </div>
        )}

        {/* Recent Task Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">My Recent Tasks</h3>
          </div>
          <RecentTasks tasks={dashboardData?.recentTasks} seeMorePath="/user/tasks" />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UserDashboard
