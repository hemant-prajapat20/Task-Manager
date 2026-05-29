import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdLogout, MdPerson, MdDelete } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";

import { signOutSuccess, updateProfileImage } from "../redux/slice/userSlice";
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data";
import authService from "../services/auth.service";

/**
 * SideMenu Component
 * Renders the vertical navigation bar with user context, profile image management,
 * and active state tracking.
 */
const SideMenu = ({ activeMenu, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [menuItems, setMenuItems] = useState([]);
  const [uploading, setUploading] = useState(false);
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
   * Handle profile image upload.
   * Uses the existing /auth/upload-image endpoint, then updates the user profile.
   */
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setUploading(true);
    try {
      // Step 1: Upload the image file
      const formData = new FormData();
      formData.append("image", file);
      const uploadRes = await authService.uploadImage(formData);

      if (uploadRes.success && uploadRes.imageUrl) {
        // Step 2: Update the user profile with the new image URL
        await authService.updateProfile({ profileImage: uploadRes.imageUrl });

        // Step 3: Update Redux state
        dispatch(updateProfileImage(uploadRes.imageUrl));
        toast.success("Profile image updated!");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Reset input so re-selecting the same file triggers onChange
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /**
   * Handle profile image deletion.
   */
  const handleImageDelete = async (e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;

    setUploading(true);
    try {
      await authService.updateProfile({ profileImage: null });
      dispatch(updateProfileImage(null));
      toast.success("Profile image removed!");
    } catch (error) {
      console.error("Image delete failed:", error);
      toast.error("Failed to remove image. Please try again.");
    } finally {
      setUploading(false);
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
            {/* Profile Image - Clickable to upload */}
            <div
              className={`w-24 h-24 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden cursor-pointer transition-transform duration-300 ${uploading ? 'opacity-60 animate-pulse' : 'group-hover:scale-105'}`}
              onClick={() => !uploading && fileInputRef.current?.click()}
              title="Click to change profile picture"
            >
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

            {/* Camera overlay on hover */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem]">
              {uploading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FaCamera className="text-white text-xl drop-shadow-lg" />
              )}
            </div>
            </div>

            {/* Delete button - shown only when user has a custom profile image */}
            {currentUser?.profileImage && !currentUser.profileImage.includes("vecteezy") && (
              <button
                onClick={handleImageDelete}
                disabled={uploading}
                className="absolute -top-1 -right-1 w-7 h-7 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
                title="Remove profile picture"
              >
                <MdDelete className="text-sm" />
              </button>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
            />

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