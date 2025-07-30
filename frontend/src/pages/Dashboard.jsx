import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  // ✅ Get user's name from localStorage, fallback to "Student"
  const username = localStorage.getItem("name") || "Student";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name"); // ✅ Clear name on logout
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-start px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 md:py-8 relative">

      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 text-white border border-red-400 backdrop-blur-md rounded-lg sm:rounded-xl font-semibold shadow-lg hover:bg-red-600 hover:scale-105 transition-all duration-300 text-xs sm:text-sm md:text-base"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <LogOut size={14} className="sm:hidden" />
        <LogOut size={16} className="hidden sm:block md:hidden" />
        <LogOut size={18} className="hidden md:block" />
        <span className="hidden xs:inline">Logout</span>
        <span className="xs:hidden">Out</span>
      </motion.button>

      {/* Title */}
      <motion.h1
        className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-indigo-800 mb-1 sm:mb-2 text-center px-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
      >
        🎯 AcadSphere
      </motion.h1>

      {/* Welcome Text */}
      <motion.p
        className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-300 mb-1 sm:mb-2 text-center px-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Welcome, <span className="font-semibold text-indigo-500 break-words">{username}</span> 👋
      </motion.p>

      {/* Instructions */}
      <motion.p
        className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 md:mb-10 text-center px-3 sm:px-4 md:px-0 max-w-2xl"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Choose your education type to begin tracking your academic journey.
      </motion.p>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-5xl px-2 sm:px-4 md:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* School */}
        <Link to="/school" className="w-full">
          <motion.div
            className="backdrop-blur-md bg-white/60 border border-green-300 p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer h-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px] flex flex-col justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-green-800 mb-2 sm:mb-3 text-center sm:text-left">
              🏫 School
            </h2>
            <p className="text-gray-700 text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed text-center sm:text-left">
              Track your academic performance across various subjects and exams.
              Get insights into your grade trends, weekly tests, and prepare smarter.
            </p>
          </motion.div>
        </Link>

        {/* College */}
        <Link to="/college" className="w-full">
          <motion.div
            className="backdrop-blur-md bg-white/60 border border-blue-300 p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer h-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px] flex flex-col justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-2 sm:mb-3 text-center sm:text-left">
              🎓 College
            </h2>
            <p className="text-gray-700 text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed text-center sm:text-left">
              Manage your semester-wise grades, GPA, arrears, and overall CGPA.
              Stay on top of academic goals and visualize your academic growth.
            </p>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
