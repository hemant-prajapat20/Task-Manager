import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

/**
 * DashboardLayout Component
 * High-level layout wrapper for all authenticated pages.
 * Handles the sidebar, navigation, and core page structure.
 */
const DashboardLayout = ({ children, activeMenu }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <Navbar activeMenu={activeMenu} />

      {currentUser && (
        <div className="flex flex-1 w-full max-w-[1920px] mx-auto">
          {/* Persistent Desktop Sidebar – hidden on mobile, visible on lg+ */}
          <aside className="hidden lg:block w-72 flex-shrink-0 h-[calc(100vh-57px)] sticky top-[57px] border-r border-slate-100 overflow-y-auto custom-scrollbar bg-white">
            <SideMenu activeMenu={activeMenu} />
          </aside>

          {/* Main Application Content */}
          <main className="flex-1 min-w-0 overflow-x-hidden flex flex-col">
            <div className="p-3 md:p-6 lg:p-8 flex-1">
              {children}
            </div>

            {/* Footer */}
            <footer className="mt-auto py-6 text-center border-t border-slate-100">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                © 2026 Task Manager. Modern Task Orchestration.
              </p>
            </footer>
          </main>
        </div>
      )}

      {/* Subtle background accents */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-violet-50/10 rounded-full blur-[100px] translate-y-1/2" />
      </div>
    </div>
  );
};

export default DashboardLayout;