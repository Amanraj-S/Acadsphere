import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { FaUserAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signup } from "../api/auth"; // Removed googleLogin import as it is unused now


export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

    // Password visibility toggle
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Regular sign up handler
  const handleRegister = async () => {
    try {
      const data = await signup({ name, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.name);  // store user full name
      alert("Account Created Successfully");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // Google OAuth login - redirect browser to backend Google OAuth route
  const handleGoogleSignup = () => {
    window.location.href = 'https://acadsphere.onrender.com/api/auth/google';
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <motion.div
        className="bg-white/5 backdrop-blur-md text-white p-12 rounded-[2rem] shadow-2xl w-full max-w-4xl border border-white/20 flex flex-col md:flex-row items-center justify-between gap-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Left */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <motion.h1
            className="text-4xl font-extrabold mb-4 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Join <span className="text-purple-400">AcadSphere</span>
          </motion.h1>
          <motion.p
            className="text-gray-300 text-lg mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Create your free account and start tracking your academic journey.
          </motion.p>
        </div>

        {/* Right */}
        <motion.div
          className="w-full md:w-1/2 bg-white/10 p-8 rounded-2xl border border-white/20"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Name */}
          <div className="relative mb-4">
            <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-300 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-300 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              className="w-full pl-10 pr-12 py-3 bg-white/10 border border-gray-300 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            <button type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded focus:outline-none flex items-center justify-center"
              style={{ width: '30px', height: '30px' }}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          {/* Sign Up */}
          <motion.button
            className="w-full bg-purple-600 hover:bg-purple-700 transition py-3 rounded-lg font-semibold mb-6 shadow-lg hover:shadow-purple-700/40"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleRegister}
          >
            Sign Up
          </motion.button>

          {/* Google */}
          <motion.button
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition mb-6 shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignup}
          >
            <FcGoogle size={22} />
            <span>Sign up with Google</span>
          </motion.button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link to="/" className="text-purple-400 hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
