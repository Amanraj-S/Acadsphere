import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { login, googleLogin } from "../api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      navigate("/Dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    const dummyGoogleUser = {
      name: "Google User",
      email: "user@gmail.com",
    };
    try {
      await googleLogin(dummyGoogleUser);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <motion.div
        className="bg-white/5 backdrop-blur-md text-white p-12 rounded-[2rem] shadow-2xl w-full max-w-4xl border border-white/20 flex flex-col md:flex-row items-center justify-between gap-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Left Side */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <motion.h1
            className="text-5xl font-extrabold mb-4 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to <br />
            <span className="text-purple-400">AcadSphere</span>
          </motion.h1>
          <motion.p
            className="text-gray-300 text-lg mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Track your academic journey with ease and elegance.
          </motion.p>
        </div>

        {/* Right Side */}
        <motion.div
          className="w-full md:w-1/2 bg-white/10 p-8 rounded-2xl border border-white/20"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Email Input */}
          <div className="relative mb-5">
            <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="User ID"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-300 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative mb-6">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-300 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <motion.button
            className="w-full bg-purple-600 hover:bg-purple-700 transition py-3 rounded-lg font-semibold mb-6 shadow-lg hover:shadow-purple-700/40"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleLogin}
          >
            Login
          </motion.button>

          {/* Google Login */}
          <motion.button
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition mb-6 shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
          >
            <FcGoogle size={22} />
            <span>Sign in with Google</span>
          </motion.button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-300">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-purple-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
