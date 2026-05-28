import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaTasks, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/DashboardLayout";
import RecentTasks from "../../components/RecentTasks";
import taskService from "../../services/task.service";

/**
 * UserDashboard Component
 * Displays a summary of tasks assigned to the current user.
 */
const UserDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch user-specific dashboard data.
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await taskService.getUserDashboardData();
      if (response.success && response.stats) {
        setDashboardData(response);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch your dashboard data";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="p-4 md:p-8 space-y-8 animate-fade-in">
        {/* User Welcome Section */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-2xl text-white">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-2">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                    Hello, <span className="text-indigo-400">{currentUser?.name?.split(' ')[0]}</span>!
                </h2>
                <p className="text-slate-400 text-lg md:text-xl font-medium">
                    {moment().format("dddd, MMMM Do YYYY")}
                </p>
            </div>
        </div>

        {!loading && dashboardData ? (
          <>
            {/* User Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="My Total Tasks" 
                value={dashboardData.stats.totalTasks} 
                icon={<FaTasks />} 
                color="indigo" 
              />
              <StatCard 
                title="To Do" 
                value={dashboardData.stats.pendingTasks} 
                icon={<FaClock />} 
                color="amber" 
              />
              <StatCard 
                title="In Progress" 
                value={dashboardData.stats.inProgressTasks} 
                icon={<FaExclamationTriangle />} 
                color="violet" 
              />
              <StatCard 
                title="Done" 
                value={dashboardData.stats.completedTasks} 
                icon={<FaCheckCircle />} 
                color="emerald" 
              />
            </div>

            {/* Recent Tasks Section */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Assignments</h3>
                        <p className="text-sm text-slate-500 font-medium italic">Tasks you've recently been working on</p>
                    </div>
                </div>
                <RecentTasks tasks={dashboardData.recentTasks} seeMorePath="/user/tasks" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Your Dashboard...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/**
 * Internal StatCard Component for UserDashboard
 */
const StatCard = ({ title, value, icon, color }) => {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        violet: "bg-violet-50 text-violet-600 border-violet-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    return (
        <div className="group bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 active:scale-[0.98]">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colors[color] || colors.indigo} border shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{icon}</span>
                </div>
            </div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{title}</h3>
            <p className="text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">
                {value || 0}
            </p>
        </div>
    );
};

export default UserDashboard;
