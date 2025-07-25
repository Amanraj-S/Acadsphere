import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function Dashboard({ username = "Student" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Your auth clear logic
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-start p-8 relative">

      {/* Enhanced Logout Button */}
      <motion.button
        onClick={handleLogout}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white/10 border border-red-500 text-red-300 backdrop-blur-md rounded-xl font-semibold shadow-lg hover:bg-red-600 hover:text-white hover:scale-105 transition-all duration-300"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <LogOut size={18} />
        Logout
      </motion.button>

      {/* Animated App Name */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
      >
        🎯 AcadSphere
      </motion.h1>

      {/* Welcome Text */}
      <motion.p
        className="text-xl text-gray-800 mb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Welcome, <span className="font-semibold text-indigo-700">{username}</span> 👋
      </motion.p>

      {/* Instruction */}
      <motion.p
        className="text-lg text-gray-700 mb-10"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Choose your education type to begin tracking your academic journey.
      </motion.p>

      {/* Grid Cards */}
      <motion.div
        className="grid gap-8 md:grid-cols-2 w-full max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* School */}
        <Link to="/school">
          <motion.div
            className="backdrop-blur-md bg-white/60 border border-green-300 p-8 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-bold text-green-800 mb-2">🏫 School</h2>
            <p className="text-gray-700">
              Track your academic performance across various subjects and exams.
              Get insights into your grade trends, weekly tests, and prepare smarter.
            </p>
          </motion.div>
        </Link>

        {/* College */}
        <Link to="/college">
          <motion.div
            className="backdrop-blur-md bg-white/60 border border-blue-300 p-8 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-bold text-blue-800 mb-2">🎓 College</h2>
            <p className="text-gray-700">
              Manage your semester-wise grades, GPA, arrears, and overall CGPA.
              Stay on top of academic goals and visualize your academic growth.
            </p>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
