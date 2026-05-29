import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FaPlus, FaTasks, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/DashboardLayout";
import RecentTasks from "../../components/RecentTasks";
import CustomPieChart from "../../components/CustomPieChart";
import CustomBarChart from "../../components/CustomBarChart";
import taskService from "../../services/task.service";

/**
 * Admin Dashboard Component
 * Displays high-level task statistics, distributions, and recent activities.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modern Color Palette for Charts
  const CHART_COLORS = ["#f59e0b", "#6366f1", "#10b981"]; // Amber, Indigo, Emerald

  /**
   * Transforms raw API data into chart-ready formats.
   */
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevel || {};

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];
    setPieChartData(taskDistributionData);

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];
    setBarChartData(priorityLevelData);
  };

  /**
   * Fetch all dashboard data from the task service.
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAdminDashboardData();

      if (response.success && response.statistics) {
        setDashboardData(response);
        prepareChartData(response.charts || null);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch dashboard metrics";
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
        {/* Welcome Hero Section */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-2xl text-white">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-5xl font-white tracking-tight">
                        Welcome back, <span className="text-indigo-400">{currentUser?.name?.split(' ')[0]}</span>!
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl font-medium">
                        {moment().format("dddd, MMMM Do YYYY")}
                    </p>
                </div>
                <div className="flex shrink-0">
                    <button
                        onClick={() => navigate("/admin/create-task")}
                        className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                    >
                        <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                        Create New Task
                    </button>
                </div>
            </div>
        </div>

        {!loading && dashboardData ? (
          <>
            {/* Stats Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Tasks" 
                value={dashboardData.statistics.totalTasks} 
                icon={<FaTasks />} 
                color="indigo" 
              />
              <StatCard 
                title="Pending" 
                value={dashboardData.statistics.pendingTasks} 
                icon={<FaClock />} 
                color="amber" 
              />
              <StatCard 
                title="Active" 
                value={dashboardData.statistics.inProgressTasks} 
                icon={<FaExclamationTriangle />} 
                color="violet" 
              />
              <StatCard 
                title="Completed" 
                value={dashboardData.statistics.completedTasks} 
                icon={<FaCheckCircle />} 
                color="emerald" 
              />
            </div>

            {/* Visual Analytics Section */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              {/* Distribution Chart */}
              <div className="xl:col-span-2 bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Task Distribution</h3>
                    <p className="text-sm text-slate-500 font-medium italic">Current tasks grouped by status</p>
                </div>
                <div className="flex-1 min-h-[300px]">
                  <CustomPieChart data={pieChartData} colors={CHART_COLORS} />
                </div>
              </div>

              {/* Priority Chart */}
              <div className="xl:col-span-3 bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Priority Breakdown</h3>
                    <p className="text-sm text-slate-500 font-medium italic">Workload intensity distribution</p>
                </div>
                <div className="flex-1 min-h-[300px]">
                  <CustomBarChart data={barChartData} />
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activities</h3>
                        <p className="text-sm text-slate-500 font-medium italic">Keep track of the latest updates</p>
                    </div>
                </div>
                <RecentTasks tasks={dashboardData.recentTasks} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Dashboard Data...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/**
 * StatCard Utility Component
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

export default Dashboard;