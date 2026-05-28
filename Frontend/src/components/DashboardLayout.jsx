import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

/**
 * DashboardLayout Component
 * High-level layout wrapper for all authenticated pages.
 * Handles the sidebar, navigation, and core page structure with a premium background.
 */
const DashboardLayout = ({ children, activeMenu }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Premium Glassmorphic Navbar */}
      <Navbar activeMenu={activeMenu} />

      {currentUser && (
        <div className="flex flex-1 max-w-[1920px] mx-auto w-full">
          {/* Persistent Desktop Sidebar */}
          <aside className="hidden lg:block w-72 h-[calc(100vh-80px)] sticky top-20 border-r border-slate-100/10 overflow-y-auto custom-scrollbar">
            <SideMenu activeMenu={activeMenu} />
          </aside>

          {/* Main Application Content */}
          <main className="flex-1 w-full min-h-full transition-all duration-300">
            <div className="p-4 md:p-8">
                {children}
            </div>
            
            {/* Minimalist Footer inside Main Content */}
            <footer className="mt-auto py-8 text-center border-t border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    © 2026 Project Flow. Modern Task Orchestration.
                </p>
            </footer>
          </main>
        </div>
      )}

      {/* Global Background Elements */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-violet-50/10 rounded-full blur-[100px] translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default DashboardLayout;