import React, { useState } from "react";
// Profile photo selector removed
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEyeSlash, FaEye, FaTasks } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import toast from "react-hot-toast";

import AuthLayout from "../../components/AuthLayout";
import { validateEmail } from "../../utils/helper";
import authService from "../../services/auth.service";
import { signInFailure, signInStart, signInSuccess } from "../../redux/slice/userSlice";

/**
 * Login Component
 * Handles user authentication and navigation based on roles.
 */
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const { loading, currentUser } = useSelector((state) => state.user);
  // Profile picture state removed

  /**
   * Handle form submission for login.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Internal validation
    if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
    }
    if (!password) {
        setError("Please enter your password");
        return;
    }
    setError(null);

    // 2) API call via authService
    try {
      dispatch(signInStart());
      
      const response = await authService.signin(email, password);
      const userData = response.data; // Standardized response from refactored backend

      dispatch(signInSuccess(userData));
      toast.success(`Welcome back, ${userData.name}!`);

      // 3) Role-based navigation
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      dispatch(signInFailure(message));
      toast.error(message);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm animate-fade-in">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          {/* Subtle accent top border */}
          <div className="h-1.5 bg-indigo-600"></div>

          <div className="p-6">
            {/* Header section */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-3 shadow-inner">
                <FaTasks className="text-2xl" />
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                Log in to manage your tasks efficiently
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <MdEmail className="text-xl" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <MdLock className="text-xl" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2.5 rounded-lg text-sm font-medium animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider mt-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors underline-offset-4 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;