import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaTasks, FaUsers, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { UIContext } from './UIContext';
import { useSelector } from 'react-redux';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
  { name: 'Tasks', path: '/admin/tasks', icon: <FaTasks /> },
  { name: 'Create Task', path: '/admin/create-task', icon: <FaPlus /> },
  { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
];

const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useContext(UIContext);
  const { currentUser } = useSelector(state => state.user);

  // Close sidebar on navigation (mobile only)
  const handleLinkClick = () => {
    if (window.innerWidth < 768) toggleSidebar();
  };

  return (
    <aside
      className={`bg-indigo-600 text-white h-full fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-20 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64`}
    >
      <div className="flex items-center justify-between px-4 py-3 md:justify-center">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button className="md:hidden" onClick={toggleSidebar} aria-label="Close navigation">
          ✕
        </button>
      </div>
      <nav className="mt-4 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.name}
            to={item.path}
            onClick={handleLinkClick}
            className={`flex items-center px-4 py-2 mx-2 rounded-lg transition-colors ${location.pathname.startsWith(item.path) ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
        <div className="border-t border-indigo-500 my-2" />
        {/* Logout */}
        <button
          onClick={() => {
            // simple client‑side logout, replace with real service if needed
            window.location.href = '/login';
          }}
          className="flex items-center w-full px-4 py-2 mx-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FaSignOutAlt className="mr-3 text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
