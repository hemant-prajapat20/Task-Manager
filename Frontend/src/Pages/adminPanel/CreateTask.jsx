import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
    MdOutlineAssignment, 
    MdOutlineDescription, 
    MdFlag, 
    MdCalendarToday, 
    MdPersonAdd, 
    MdFormatListBulleted,
    MdAdd,
    MdClose
} from "react-icons/md";

import DashboardLayout from "../../components/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import userService from "../../services/user.service";
import taskService from "../../services/task.service";

/**
 * CreateTask Component (Admin Only)
 * Provides a specialized interface for creating new project assignments with multi-user assignments and checklists.
 */
const CreateTask = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        assignedTo: [] // Supports multiple users
    });

    const [checklistItem, setChecklistItem] = useState("");
    const [todoChecklist, setTodoChecklist] = useState([]);

    /**
     * Fetch list of available team members.
     */
    const fetchUsers = async () => {
        try {
            setIsLoadingUsers(true);
            const response = await userService.getUsers();
            if (response.success && response.data) {
                setUsers(response.data);
            }
        } catch (error) {
            toast.error("Failed to fetch team members");
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    /**
     * Add an item to the local checklist.
     */
    const addChecklistItem = () => {
        if (!checklistItem.trim()) return;
        setTodoChecklist([...todoChecklist, { text: checklistItem.trim(), completed: false }]);
        setChecklistItem("");
    };

    /**
     * Remove an item from the local checklist.
     */
    const removeChecklistItem = (index) => {
        const updated = todoChecklist.filter((_, i) => i !== index);
        setTodoChecklist(updated);
    };

    /**
     * Toggle user selection for assignment.
     */
    const toggleUserAssignment = (userId) => {
        const current = [...formData.assignedTo];
        if (current.includes(userId)) {
            setFormData({ ...formData, assignedTo: current.filter(id => id !== userId) });
        } else {
            setFormData({ ...formData, assignedTo: [...current, userId] });
        }
    };

    /**
     * Handle form submission to create the task.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.assignedTo.length === 0) {
            return toast.error("Please assign this task to at least one team member.");
        }

        try {
            setIsSubmitting(true);
            const finalData = {
                ...formData,
                todoChecklist,
                // Ensure it matches the backend schema strictly
                priority: formData.priority
            };

            const response = await taskService.createTask(finalData);
            if (response.success) {
                toast.success("Assignment created successfully!");
                navigate("/admin/tasks");
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to create assignment";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout activeMenu={"Create Task"}>
            <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Draft New Assignment</h2>
                        <p className="text-slate-500 font-medium italic">Define objectives and coordinate team efforts</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title & Description Card */}
                        <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-slate-100 space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <MdOutlineAssignment className="text-lg text-indigo-500" />
                                    Assignment Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xl font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                                    placeholder="Enter a descriptive title..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <MdOutlineDescription className="text-lg text-indigo-500" />
                                    Strategic Description
                                </label>
                                <textarea
                                    required
                                    rows="6"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-medium text-slate-600 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-inner resize-none antialiased"
                                    placeholder="Outline the goals and detailed requirements..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Checklist Implementation Card */}
                        <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-slate-100 space-y-6">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                <MdFormatListBulleted className="text-lg text-indigo-500" />
                                Operational Checklist (Optional)
                            </label>
                            
                            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                                <input
                                    type="text"
                                    className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
                                    placeholder="Add an actionable step..."
                                    value={checklistItem}
                                    onChange={(e) => setChecklistItem(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                                />
                                <button
                                    type="button"
                                    aria-label="Add checklist item"
                                    onClick={addChecklistItem}
                                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors shadow-lg active:scale-95"
                                >
                                    <MdAdd className="text-2xl" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {todoChecklist.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl group shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                            </div>
                                            <span className="font-bold text-slate-700">{item.text}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeChecklistItem(index)}
                                            className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                                        >
                                            <MdClose className="text-xl" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Configuration Area */}
                    <div className="space-y-8">
                        {/* Control Panel Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl text-white space-y-8">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">Assignment Parameters</h3>

                            {/* Priority Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <MdFlag className="text-indigo-400" />
                                    Urgency Tier
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {PRIORITY_DATA.map((p) => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, priority: p.value })}
                                            className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${
                                                formData.priority === p.value
                                                    ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20"
                                                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Due Date Input */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <MdCalendarToday className="text-indigo-400" />
                                    Target Deadline
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 space-y-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-sm"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Deploying...</span>
                                        </div>
                                    ) : "Deploy Assignment"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="w-full py-4 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
                                >
                                    Discard Draft
                                </button>
                            </div>
                        </div>

                        {/* Resource Allocation Card (Team) */}
                        <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-slate-100 space-y-6">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                <MdPersonAdd className="text-lg text-indigo-500" />
                                Task Commission (Team)
                            </label>
                            
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {isLoadingUsers ? (
                                    <div className="py-8 text-center text-slate-400 italic text-sm">Loading team...</div>
                                ) : users.map(user => (
                                    <div 
                                        key={user._id} 
                                        onClick={() => toggleUserAssignment(user._id)}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                                            formData.assignedTo.includes(user._id)
                                                ? "bg-indigo-50 border-indigo-200"
                                                : "bg-slate-50 border-slate-50 hover:border-slate-200"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                                            {user.profileImage ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" /> : <MdAdd className="text-slate-300" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate ${formData.assignedTo.includes(user._id) ? "text-indigo-900" : "text-slate-700"}`}>
                                                {user.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium truncate">{user.email}</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                            formData.assignedTo.includes(user._id)
                                                ? "bg-indigo-600 border-indigo-600"
                                                : "border-slate-200"
                                        }`}>
                                            {formData.assignedTo.includes(user._id) && <MdClose className="text-white text-xs rotate-45" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateTask;
