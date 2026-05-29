import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdPerson } from "react-icons/md";

import DashboardLayout from "../../components/DashboardLayout";
import userService from "../../services/user.service";

/**
 * ManageUsers Component (Admin Only)
 * Displays a list of team members with their task statistics and provides deletion capabilities.
 */
const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetch user list from the backend.
     */
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getUsers();
            if (response.success && response.data) {
                setUsers(response.data);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to fetch team members";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete a user after confirmation.
     */
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this team member? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await userService.deleteUser(userId);
            if (response.success) {
                toast.success("Team member deleted successfully");
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to delete team member";
            toast.error(message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <DashboardLayout activeMenu={"Team Members"}>
            <div className="p-4 md:p-8 animate-fade-in">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Team Members</h2>
                        <p className="text-slate-500 mt-1 font-medium italic">Manage your team and monitor their task progress</p>
                    </div>
                </div>

                {/* Team Table Container */}
                <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                    <th className="px-6 py-4 border-b border-slate-100">User Details</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Tasks Summary</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Role</th>
                                    <th className="px-6 py-4 border-b border-slate-100 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user._id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                                                            {user.profileImage ? (
                                                                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <MdPerson className="text-2xl text-indigo-600" />
                                                            )}
                                                        </div>
                                                        {/* Status indicator (optional mockup) */}
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 leading-tight">{user.name}</div>
                                                        <div className="text-sm text-slate-500 font-medium">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Pending</span>
                                                        <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 text-center">{user.pendingTasks || 0}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Active</span>
                                                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 text-center">{user.inProgressTasks || 0}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Done</span>
                                                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 text-center">{user.completedTasks || 0}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold tracking-wide uppercase ${
                                                    user.role === 'admin' 
                                                    ? 'bg-violet-100 text-violet-700 border border-violet-200' 
                                                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <button 
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-95 shadow-sm hover:shadow-md bg-white border border-slate-100"
                                                    title="Delete User"
                                                >
                                                    <MdDeleteOutline className="text-xl" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            {loading ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Team Data...</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="bg-slate-50 p-4 rounded-full text-slate-300">
                                                        <MdPerson className="text-4xl" />
                                                    </div>
                                                    <span className="text-slate-400 font-semibold italic">No team members found.</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManageUsers;
