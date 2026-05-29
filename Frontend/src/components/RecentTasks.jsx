import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { MdOutlineArrowForward } from "react-icons/md";

/**
 * RecentTasks Component
 * Provides a summarized tabular view of the most recent tasks with status and priority highlights.
 */
const RecentTasks = ({ tasks, seeMorePath = "/admin/tasks" }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {tasks?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                <th className="px-4 md:px-8 py-5 border-b border-slate-100">Assignment</th>
                <th className="px-4 md:px-8 py-5 border-b border-slate-100">Status</th>
                <th className="px-4 md:px-8 py-5 border-b border-slate-100">Level</th>
                <th className="px-4 md:px-8 py-5 border-b border-slate-100">Drafted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr 
                  key={task._id} 
                  className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/user/task-details/${task._id}`)}
                >
                  <td className="px-4 md:px-8 py-5">
                    <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {task.title}
                    </p>
                  </td>
                  <td className="px-4 md:px-8 py-5">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      task.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
                      task.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" : 
                      "bg-indigo-50 text-indigo-700 border-indigo-100"
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-8 py-5">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                        task.priority === "High" ? "bg-rose-50 text-rose-700 border-rose-100" : 
                        task.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-100" : 
                        "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>
                        {task.priority}
                    </span>
                  </td>
                  <td className="px-4 md:px-8 py-5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      {moment(task.createdAt).format("MMM Do")}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Footer with Action */}
          <div className="p-4 md:p-8 flex justify-center border-t border-slate-100">
              <button
                onClick={() => navigate(seeMorePath)}
                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Inspect All Assignments
                <MdOutlineArrowForward className="text-lg group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6">
            <p className="text-sm font-bold text-slate-300 italic uppercase tracking-widest">
                No recent assignments synchronized.
            </p>
        </div>
      )}
    </div>
  );
};

export default RecentTasks;