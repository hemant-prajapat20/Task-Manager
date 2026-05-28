import React from "react";
import moment from "moment";
import { FaFileLines } from "react-icons/fa6";
import { MdCalendarToday, MdOutlineAssignment } from "react-icons/md";

import Progress from "./Progress";
import AvatarGroup from "./AvatarGroup";

/**
 * TaskCard Component
 * Modern, card-based representation of a task with progress, metadata, and assigned users.
 */
const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {
  
  /**
   * Helper to get styling for status badges.
   */
  const getStatusStyles = () => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "In Progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  /**
   * Helper to get styling for priority badges.
   */
  const getPriorityStyles = () => {
    const p = priority?.toLowerCase();
    switch (p) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  /**
   * Extract profile images forAvatarGroup.
   */
  const avatars = assignedTo?.map(user => user.profileImage) || [];

  return (
    <div
      className="group bg-white rounded-[2rem] p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 cursor-pointer overflow-hidden relative"
      onClick={onClick}
    >
      {/* Visual Accent based on Status */}
      <div className={`absolute top-0 left-0 w-2 h-full ${
        status === "In Progress" ? "bg-indigo-500" : 
        status === "Completed" ? "bg-emerald-500" : "bg-amber-500"
      }`}></div>

      <div className="flex flex-wrap items-center gap-2 mb-4 ml-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getStatusStyles()}`}>
          {status}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getPriorityStyles()}`}>
          {priority} Priority
        </span>
      </div>

      <div className="ml-2 space-y-3">
        <h3 className="text-xl font-extrabold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
          {title}
        </h3>
        
        <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
          {description || "No description provided."}
        </p>

        <div className="flex items-center gap-2 text-slate-400">
            <MdOutlineAssignment className="text-lg" />
            <span className="text-xs font-bold uppercase tracking-tighter">
                Checklist: <span className="text-slate-900">{completedTodoCount || 0} / {todoChecklist?.length || 0}</span>
            </span>
        </div>

        <Progress progress={progress} status={status} />
      </div>

      <div className="mt-6 ml-2 pt-6 border-t border-slate-50 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                    <MdCalendarToday className="text-sm" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Due Date</p>
                    <p className="text-sm font-bold text-slate-900 leading-none">
                        {dueDate ? moment(dueDate).format("MMM Do, YYYY") : "No due date"}
                    </p>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between">
          <AvatarGroup avatars={avatars} />
          
          <div className="flex items-center gap-3">
            {attachmentCount > 0 && (
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                    <FaFileLines className="text-indigo-600 text-sm" />
                    <span className="text-sm font-bold text-slate-900">{attachmentCount}</span>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;