import React from "react";

/**
 * TaskStatusTabs Component
 * Navigation pills for filtering tasks by status with dynamic item counts.
 */
const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex overflow-x-auto bg-slate-100/50 p-1.5 rounded-[1.5rem] border border-slate-200/50 backdrop-blur-sm self-start no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        
        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(tab.label)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 shrink-0
              ${isActive 
                ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200/50 scale-[1.02]" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/30"}
            `}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-colors ${
              isActive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
            }`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TaskStatusTabs;