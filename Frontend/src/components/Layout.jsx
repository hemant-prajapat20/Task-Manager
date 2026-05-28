import React, { useContext } from 'react';
import { UIContext } from './UIContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Layout component that wraps page content with the global Navbar and Sidebar.
 * It respects the sidebar open/close state from UIContext and adds a
 * container with proper side margins/padding for all pages.
 */
const Layout = ({ children }) => {
  const { sidebarOpen } = useContext(UIContext);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar – hidden on mobile, fixed on desktop */}
      <Sidebar />

      {/* Main area */}
      <div
        className={`flex flex-col flex-1 transition-margin duration-300 ${
          sidebarOpen ? 'md:ml-64' : ''
        }`}
      >
        <Navbar />
        <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
