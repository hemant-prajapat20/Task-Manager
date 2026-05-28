import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import { MdChevronLeft, MdAccessTime, MdFlag, MdCheckCircle, MdOutlinePlaylistAddCheck, MdPerson } from "react-icons/md";

import DashboardLayout from "../../components/DashboardLayout";
import taskService from "../../services/task.service";

/**
 * TaskDetails Component
 * Provides a deep-dive view into a specific task, allowing status updates and checklist management.
 */
const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    /**
     * Fetch task details including assignments and checklist.
     */
    const fetchDetails = async () => {
        try {
            setLoading(true);
            const response = await taskService.getTaskById(id);
            if (response.success && response.data) {
                setTask(response.data);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to load task details";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update the overall status of the task.
     */
    const handleStatusUpdate = async (newStatus) => {
        try {
            setIsUpdating(true);
            const response = await taskService.updateTaskStatus(id, newStatus);
            if (response.success) {
                toast.success(`Status moved to ${newStatus}`);
                fetchDetails(); // Reload to get updated progress and status
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to update status";
            toast.error(message);
        } finally {
            setIsUpdating(false);
        }
    };

    /**
     * Toggle a specific item in the todo checklist.
     */
    const handleToggleChecklist = async (index) => {
        if (!task || isUpdating) return;

        const updatedChecklist = [...task.todoChecklist];
        updatedChecklist[index].completed = !updatedChecklist[index].completed;

        try {
            setIsUpdating(true);
            const response = await taskService.updateTaskChecklist(id, updatedChecklist);
            if (response.success && response.data) {
                setTask(response.data); // Update local state with recalculated progress
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to update checklist item";
            toast.error(message);
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout activeMenu={"My Tasks"}>
                <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Details...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!task) {
        return (
            <DashboardLayout activeMenu={"My Tasks"}>
                <div className="text-center py-32 flex flex-col items-center gap-6">
                    <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-500 border-2 border-dashed border-rose-100">
                        <MdFlag className="text-5xl" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Assignment Not Found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeMenu={"My Tasks"}>
            <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
                {/* Breadcrumb Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors mb-8"
                >
                    <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                        <MdChevronLeft className="text-xl" />
                    </div>
                    <span className="uppercase tracking-widest text-xs">Back to Workspace</span>
                </button>

                {/* Task Content Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    {/* Visual Priority Bar */}
                    <div className={`h-4 ${task.priority === "high" ? "bg-rose-500" : task.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                        }`} />

                    <div className="p-8 md:p-12">
                        {/* Header Section */}
                        <div className="flex flex-col xl:flex-row justify-between items-start gap-8 mb-12">
                            <div className="space-y-4 max-w-3xl">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${task.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                        task.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                            "bg-indigo-50 text-indigo-700 border-indigo-100"
                                        }`}>
                                        {task.status}
                                    </span>
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                                        <MdAccessTime className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Drafted {moment(task.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">{task.title}</h1>
                            </div>

                            {/* Status Quick Actions */}
                            <div className="flex flex-wrap gap-2 group/btns">
                                {["Pending", "In Progress", "Completed"].map(s => (
                                    <button
                                        key={s}
                                        disabled={task.status === s || isUpdating}
                                        onClick={() => handleStatusUpdate(s)}
                                        className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm ${task.status === s
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                                            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-indigo-500/20 active:scale-95"
                                            }`}
                                    >
                                        Mark as {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Grid Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Left Column: Description & Checklist */}
                            <div className="lg:col-span-2 space-y-12">
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-[0.2em] text-xs">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                        Objective Overview
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-xl font-medium antialiased">{task.description}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                        <h3 className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-[0.2em] text-xs">
                                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                            Task Roadmap
                                        </h3>
                                        <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-100">
                                            {task.todoChecklist?.filter(i => i.completed).length || 0} / {task.todoChecklist?.length || 0} SECURED
                                        </span>
                                    </div>

                                    <div className="grid gap-3">
                                        {task.todoChecklist?.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleToggleChecklist(index)}
                                                className={`flex items-center gap-4 p-5 rounded-3xl border transition-all cursor-pointer group/item ${item.completed
                                                    ? "bg-slate-50 border-slate-100 opacity-60"
                                                    : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5"
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${item.completed ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-white border-slate-200 group-hover/item:border-indigo-400"
                                                    }`}>
                                                    {item.completed && <MdCheckCircle className="text-xl text-white" />}
                                                </div>
                                                <span className={`text-lg font-bold transition-all ${item.completed ? "text-slate-400 line-through" : "text-slate-900 antialiased"}`}>
                                                    {item.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Metadata & Team */}
                            <div className="space-y-8">
                                {/* Insights Panel */}
                                <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 space-y-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">Deadline</label>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                                                    <MdAccessTime className="text-indigo-600 text-xl" />
                                                </div>
                                                <p className="text-lg font-black text-slate-900 tracking-tight">{moment(task.dueDate).format("MMMM Do, YYYY")}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">Urgency Level</label>
                                            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                                <div className={`w-4 h-4 rounded-full shadow-inner ${task.priority === "high" ? "bg-rose-500 animate-pulse" :
                                                    task.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                                                    }`} />
                                                <p className="font-black text-slate-900 tracking-tight capitalize">{task.priority} Priority</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Completion Velocity</label>
                                                <span className="text-sm font-black text-slate-900">{task.progress || 0}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                                                <div
                                                    className="bg-indigo-600 h-full rounded-full shadow-lg shadow-indigo-500/20 transition-all duration-700 ease-out"
                                                    style={{ width: `${task.progress || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Panel */}
                                <div className="space-y-6">
                                    <h3 className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-[0.2em] text-xs">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                        Task Command
                                    </h3>
                                    <div className="grid gap-3">
                                        {task.assignedTo?.map(user => (
                                            <div key={user._id} className="group/user flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-50 hover:border-indigo-100 hover:shadow-xl transition-all">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black overflow-hidden shadow-inner group-hover/user:scale-105 transition-transform">
                                                    {user.profileImage ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" /> : <MdPerson className="text-2xl" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-black text-slate-900 leading-tight">{user.name}</p>
                                                    <p className="text-xs text-slate-400 font-bold tracking-tight truncate max-w-[150px]">{user.email}</p>
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
    );
};

export default TaskDetails;
