import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdAssignment, MdFilterList } from "react-icons/md";

import DashboardLayout from "../../components/DashboardLayout";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/TaskCard";
import taskService from "../../services/task.service";

/**
 * MyTask Component
 * Displays a list of tasks assigned to the current user with filtering by status.
 */
const MyTask = () => {
    const navigate = useNavigate();

    const [allTasks, setAllTasks] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [loading, setLoading] = useState(true);
    const [tabs, setTabs] = useState([
        { label: "All", count: 0 },
        { label: "Pending", count: 0 },
        { label: "In Progress", count: 0 },
        { label: "Completed", count: 0 },
    ]);

    /**
     * Fetch all tasks assigned to the current user, optionally filtered by status.
     */
    const fetchMyTasks = async () => {
        try {
            setLoading(true);
            const statusParam = filterStatus === "All" ? "" : filterStatus;
            const response = await taskService.getTasks(statusParam);

            if (response.success && response.data) {
                setAllTasks(response.data);
                const statusSummary = response.statusSummary || {};
                
                // Update navigation tabs with latest counts from the server
                setTabs([
                    { label: "All", count: statusSummary.all || 0 },
                    { label: "Pending", count: statusSummary.pendingTasks || 0 },
                    { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
                    { label: "Completed", count: statusSummary.completedTasks || 0 },
                ]);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to load your tasks";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Navigate to task details page.
     */
    const handleTaskClick = (taskId) => {
        navigate(`/user/task-details/${taskId}`);
    };

    useEffect(() => {
        fetchMyTasks();
    }, [filterStatus]);

    return (
        <DashboardLayout activeMenu={"My Tasks"}>
            <div className="p-4 md:p-8 space-y-8 animate-fade-in">
                {/* My Tasks Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personal Workspace</h2>
                        <p className="text-slate-500 font-medium italic">Track your individual assignments and progress</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <TaskStatusTabs
                            tabs={tabs}
                            activeTab={filterStatus}
                            setActiveTab={setFilterStatus}
                        />
                    </div>
                </div>

                {/* Task Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        // Skeleton Loaders
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="h-72 bg-slate-100 rounded-[2rem] animate-pulse"></div>
                        ))
                    ) : allTasks?.length > 0 ? (
                        allTasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                {...task}
                                attachmentCount={task.attachements?.length || 0} // Standardized field naming
                                completedTodoCount={task.todoChecklist?.filter(item => item.completed).length || 0}
                                onClick={() => handleTaskClick(task._id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 px-6">
                            <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-200 mb-6 border-2 border-dashed border-indigo-100">
                                <MdAssignment className="text-5xl" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Your Workspace is Empty</h3>
                            <p className="text-slate-400 font-medium text-center max-w-xs italic">
                                Good job! No {filterStatus !== "All" ? filterStatus.toLowerCase() : ""} tasks to highlight here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MyTask;
