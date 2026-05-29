import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaEyeSlash, FaEye, FaTasks } from "react-icons/fa";
import { MdEmail, MdLock, MdPerson, MdVpnKey } from "react-icons/md";
import toast from "react-hot-toast";

import AuthLayout from "../../components/AuthLayout";
import { validateEmail } from "../../utils/helper";
import authService from "../../services/auth.service";
import { signInStart, signInSuccess, signInFailure } from "../../redux/slice/userSlice";

/**
 * SignUp Component
 * Handles new user registration including profile image upload and admin joining.
 * After successful signup, automatically logs the user in and redirects based on role.
 */
const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [showAdminInviteToken, setShowAdminInviteToken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission for signup.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Internal validation
    if (!fullName) {
      setError("Please enter your full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      let profileImageUrl = "";

      // 2) Signup API call
      await authService.signup({
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminJoinCode: adminInviteToken,
      });

      // 3) Auto-login after successful signup
      dispatch(signInStart());
      const loginResponse = await authService.signin(email, password);
      const userData = loginResponse.data;
      dispatch(signInSuccess(userData));

      toast.success(`Welcome, ${userData.name}! Your account is ready.`);

      // 4) Role-based redirect — admin code → admin panel, otherwise → user panel
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      dispatch(signInFailure(message));
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-fade-in py-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          {/* Subtle accent top border */}
          <div className="h-1.5 bg-indigo-600"></div>

          <div className="p-8">
            {/* Header section */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-inner">
                <FaTasks className="text-3xl" />
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Create Account
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                Join Project Flow and start tracking
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <MdPerson className="text-xl" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
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

              {/* Admin Invite Token */}
              <div className="space-y-1">
                <label htmlFor="adminInviteToken" className="block text-sm font-semibold text-slate-700 ml-1">
                  Admin Invite Token (Optional)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <MdVpnKey className="text-xl" />
                  </div>
                  <input
                    id="adminInviteToken"
                    type={showAdminInviteToken ? "text" : "password"}
                    value={adminInviteToken}
                    onChange={(e) => setAdminInviteToken(e.target.value)}
                    className="block w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="Admin join code"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowAdminInviteToken(!showAdminInviteToken)}
                  >
                    {showAdminInviteToken ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2.5 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider mt-4"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors underline-offset-4 hover:underline"
                >
                  Join back
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
