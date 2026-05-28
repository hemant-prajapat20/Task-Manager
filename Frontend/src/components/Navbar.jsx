import React, { useState } from "react";
import { MdClose, MdMenu, MdNotificationsNone } from "react-icons/md";
import { useSelector } from "react-redux";
import SideMenu from "./SideMenu";

/**
 * Navbar Component
 * Features a glassmorphic design and responsive mobile menu integration.
 */
const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all lg:hidden"
            onClick={() => setOpenSideMenu(!openSideMenu)}
          >
            {openSideMenu ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
          </button>

          {/* Branding */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight hidden sm:block">
              Project <span className="text-indigo-600">Flow</span>
            </h2>
          </div>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center gap-3 md:gap-6">
          <button className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all relative">
            <MdNotificationsNone className="text-2xl" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-slate-100">
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-slate-900 leading-none mb-1">{currentUser?.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                {currentUser?.role} Status
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 p-0.5 flex items-center justify-center overflow-hidden shadow-inner flex-shrink-0">
              {currentUser?.profileImage ? (
                <img src={currentUser.profileImage} alt="" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-indigo-600 font-black">{currentUser?.name?.charAt(0)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {openSideMenu && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setOpenSideMenu(false)}
          />
          
          <div className="relative z-50 w-[280px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-left">
            <div className="p-6 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <span className="text-lg font-black text-slate-900 tracking-tight">Project Flow</span>
                </div>
                <button
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                    onClick={() => setOpenSideMenu(false)}
                >
                    <MdClose className="text-xl" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <SideMenu activeMenu={activeMenu} onClose={() => setOpenSideMenu(false)} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
