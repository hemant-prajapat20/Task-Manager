import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdLogout, MdPerson } from "react-icons/md";
import toast from "react-hot-toast";

import { signOutSuccess } from "../redux/slice/userSlice";
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data";
import authService from "../services/auth.service";

/**
 * SideMenu Component
 * Renders the vertical navigation bar with user context and active state tracking.
 */
const SideMenu = ({ activeMenu, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  /**
   * Handle navigation click or logout.
   */
  const handleMenuClick = (item) => {
    if (item.path === "logout") {
      handleLogout();
      return;
    }
    navigate(item.path);
    if (onClose) onClose();
  };

  /**
   * Securely sign out the user and clear Redux state.
   */
  const handleLogout = async () => {
    try {
      const response = await authService.signout();
      if (response.success) {
        dispatch(signOutSuccess());
        toast.success("Signed out successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  /**
   * Define menu items based on the user's role.
   */
  useEffect(() => {
    if (currentUser) {
      setMenuItems(
        currentUser.role === "admin" ? SIDE_MENU_DATA : USER_SIDE_MENU_DATA
      );
    }
  }, [currentUser]);

  return (
    <div className="flex flex-col h-full bg-white lg:bg-transparent p-6 overflow-y-auto custom-scrollbar">
      {/* User Focus Section */}
      <div className="flex flex-col items-center mb-10 pb-10 border-b border-slate-100/50">
        <div className="relative mb-4 group">
            <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {currentUser?.profileImage ? (
                <img
                src={currentUser.profileImage}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-600 bg-indigo-50">
                    <MdPerson className="text-4xl" />
                </div>
            )}
            </div>
            {/* Role Badge */}
            <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md ${
                    currentUser?.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'
                }`}>
                    {currentUser?.role || 'User'}
                </span>
            </div>
        </div>

        <div className="text-center mt-4">
            <h5 className="text-lg font-black text-slate-900 leading-tight">
            {currentUser?.name || "Guest User"}
            </h5>
            <p className="text-xs font-bold text-slate-400 mt-1 truncate max-w-[180px]">
                {currentUser?.email || ""}
            </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = activeMenu === item.label;
          const isLogout = item.path === "logout";

          return (
            <button
              key={`menu_${index}`}
              onClick={() => handleMenuClick(item)}
              className={`w-full group flex items-center gap-4 py-3.5 px-6 rounded-2xl transition-all duration-200 outline-none ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-2"
                  : isLogout
                  ? "text-rose-500 hover:bg-rose-50"
                  : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              <item.icon className={`text-xl transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              <span className={`font-bold tracking-tight ${isActive ? "text-white" : ""}`}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Help/Support Mockup */}
      <div className="mt-auto">
        <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
            <p className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-1">Need help?</p>
            <p className="text-xs text-indigo-600 font-medium mb-3">Check our documentation for advanced workflows.</p>
            <button className="text-[10px] font-black text-white bg-indigo-600 py-2 px-4 rounded-xl uppercase tracking-widest hover:bg-indigo-700 transition-colors">
                View Docs
            </button>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;