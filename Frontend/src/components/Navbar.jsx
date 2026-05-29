import React, { useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import SideMenu from "./SideMenu";
import { signOutSuccess } from "../redux/slice/userSlice";
import authService from "../services/auth.service";

/**
 * Navbar Component
 * Top navigation bar with mobile sidebar drawer and user controls.
 */
const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm sticky top-0 z-30 px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Left – hamburger (mobile) + branding */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors lg:hidden"
            onClick={() => setOpenSideMenu(!openSideMenu)}
            aria-label="Toggle navigation menu"
          >
            {openSideMenu ? (
              <MdClose className="text-2xl" />
            ) : (
              <MdMenu className="text-2xl" />
            )}
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/vite.svg" alt="logo" className="h-7 w-7" />
            <span className="font-bold text-lg text-slate-800 tracking-tight">
              Task Manager
            </span>
          </div>
        </div>

        {/* Right – user info + logout */}
        <div className="flex items-center gap-4">
          {currentUser && (
            <span className="text-sm font-semibold text-slate-600 hidden md:block">
              {currentUser.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors p-2 rounded-xl hover:bg-rose-50"
            aria-label="Logout"
          >
            <FaSignOutAlt size={18} />
          </button>
        </div>
      </div>

      {/* Mobile sidebar drawer overlay */}
      {openSideMenu && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpenSideMenu(false)}
          />
          {/* Drawer */}
          <div className="relative z-50 w-72 h-full bg-white shadow-2xl animate-slide-in overflow-y-auto">
            <button
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              onClick={() => setOpenSideMenu(false)}
            >
              <MdClose className="text-2xl" />
            </button>

            <div className="pt-16">
              <SideMenu activeMenu={activeMenu} onClose={() => setOpenSideMenu(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
