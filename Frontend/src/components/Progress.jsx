import React from "react";

/**
 * Progress Component
 * A custom, animated progress bar that changes color based on task status.
 */
const Progress = ({ progress = 0, status }) => {
  /**
   * Helper to get progress bar color based on status.
   */
  const getBarColor = () => {
    switch (status) {
      case "Pending":
        return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]";
      case "In Progress":
        return "bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.4)]";
      case "Completed":
        return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="w-full space-y-1.5">
      {/* Progress Track */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
        <div
          className={`${getBarColor()} h-full rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Optional Percentage Label (Visible only if needed by parent) */}
      <div className="flex justify-between items-center px-0.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Velocity</span>
          <span className="text-[10px] font-black text-slate-900">{progress}%</span>
      </div>
    </div>
  );
};

export default Progress;