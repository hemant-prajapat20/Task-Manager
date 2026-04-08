import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance"
import { MdDeleteOutline } from "react-icons/md"
import toast from "react-hot-toast"

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/get-users")
      if (response.data) {
        setUsers(response.data)
      }
    } catch (error) {
      console.log("Error fetching users: ", error)
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await axiosInstance.delete(`/users/${userId}`)
      if (response.data) {
        toast.success("User deleted successfully")
        getUsers()
      }
    } catch (error) {
      console.log("Error deleting user: ", error)
      toast.error("Failed to delete user")
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <DashboardLayout activeMenu={"Team Members"}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-blue-600 font-semibold">{user.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => deleteUser(user._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <MdDeleteOutline className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                      {loading ? "Loading team members..." : "No team members found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageUsers
