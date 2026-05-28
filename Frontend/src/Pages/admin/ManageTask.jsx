import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdAssignment, MdAdd, MdFileDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";
import TaskCard from "../../components/TaskCard";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import taskService from "../../services/task.service";
import reportService from "../../services/report.service";

/**
 * ManageTask Component (Admin Only)
 * High-level task management allowing admins to filter, view, and delete tasks.
 * Includes data export capabilities for reporting.
 */
const ManageTask = () => {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    
    const [tabs, setTabs] = useState([
        { label: "All", count: 0 },
        { label: "Pending", count: 0 },
        { label: "In Progress", count: 0 },
        { label: "Completed", count: 0 },
    ]);

    /**
     * Fetch tasks based on the current filter status.
     */
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const statusParam = filterStatus === "All" ? "" : filterStatus;
            const response = await taskService.getTasks(statusParam);
            
            if (response.success && response.data) {
                setTasks(response.data);
                const summary = response.statusSummary || {};
                
                setTabs([
                    { label: "All", count: summary.all || 0 },
                    { label: "Pending", count: summary.pendingTasks || 0 },
                    { label: "In Progress", count: summary.inProgressTasks || 0 },
                    { label: "Completed", count: summary.completedTasks || 0 },
                ]);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to load tasks";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Trigger Excel report download for all tasks.
     */
    const handleExportTasks = async () => {
        try {
            setIsExporting(true);
            toast.loading("Generating task report...", { id: "export" });
            await reportService.exportTasks();
            toast.success("Task report downloaded!", { id: "export" });
        } catch (error) {
            toast.error("Export failed", { id: "export" });
        } finally {
            setIsExporting(false);
        }
    };

    /**
     * Trigger Excel report download for user task summaries.
     */
    const handleExportUsers = async () => {
        try {
            setIsExporting(true);
            toast.loading("Generating user summary report...", { id: "export-u" });
            await reportService.exportUsers();
            toast.success("User report downloaded!", { id: "export-u" });
        } catch (error) {
            toast.error("Export failed", { id: "export-u" });
        } finally {
            setIsExporting(false);
        }
    }

    /**
     * Delete a task after confirmation.
     */
    const handleDeleteTask = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task? This action is permanent.")) {
            return;
        }

        try {
            const response = await taskService.deleteTask(id);
            if (response.success) {
                toast.success("Task removed successfully");
                fetchTasks();
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to delete task";
            toast.error(message);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filterStatus]);

    return (
        <DashboardLayout activeMenu={"Manage Task"}>
            <div className="p-4 md:p-8 space-y-8 animate-fade-in">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Full Inventory</h2>
                        <p className="text-slate-500 font-medium italic">Oversee and organize all project assignments</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Status Tabs */}
                        <TaskStatusTabs 
                            tabs={tabs} 
                            activeTab={filterStatus} 
                            setActiveTab={setFilterStatus} 
                        />

                        {/* Export Actions */}
                        <div className="flex items-center gap-2 ml-auto xl:ml-0">
                            <button 
                                onClick={handleExportTasks}
                                disabled={isExporting}
                                className="flex items-center gap-2 bg-white text-slate-700 px-5 py-3 rounded-2xl font-bold transition-all border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 active:scale-95 disabled:opacity-50"
                                title="Export Tasks to Excel"
                            >
                                <MdFileDownload className="text-xl text-indigo-600" />
                                <span className="hidden md:inline">Task Report</span>
                            </button>
                            <button 
                                onClick={handleExportUsers}
                                disabled={isExporting}
                                className="flex items-center gap-2 bg-white text-slate-700 px-5 py-3 rounded-2xl font-bold transition-all border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 active:scale-95 disabled:opacity-50"
                                title="Export User Stats to Excel"
                            >
                                <MdFileDownload className="text-xl text-emerald-600" />
                                <span className="hidden md:inline">User Summary</span>
                            </button>
                        </div>

                        {/* Create Action */}
                        <button 
                            onClick={() => navigate("/admin/create-task")}
                            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-indigo-500/10 active:scale-95"
                        >
                            <MdAdd className="text-xl" />
                            <span>New Task</span>
                        </button>
                    </div>
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-72 bg-slate-100 rounded-[2rem] animate-pulse"></div>
                        ))
                    ) : tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div key={task._id} className="relative group">
                                <TaskCard 
                                    {...task}
                                    assignedTo={task.assignedTo}
                                    onClick={() => navigate(`/user/task-details/${task._id}`)}
                                />
                                
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                     <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTask(task._id);
                                        }}
                                        className="p-3 bg-white/95 backdrop-blur-md text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl shadow-2xl transition-all border border-slate-100"
                                        title="Delete Task"
                                    >
                                        <MdDeleteOutline className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 bg-white/40 rounded-[3rem] border-2 border-dashed border-slate-100 italic font-medium text-slate-400">
                             No tasks matching your current parameters.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManageTask;
