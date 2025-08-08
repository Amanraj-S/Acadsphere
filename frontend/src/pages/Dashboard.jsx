import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); // clear username on logout
    navigate("/");
  };

  const username = localStorage.getItem("username") || "Student";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-start px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 relative">
      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        className="
          absolute z-20
          top-2 right-2
          sm:top-6 sm:right-6
          flex items-center gap-2
          px-4 py-3 sm:px-5 sm:py-2
          bg-white/30 border border-red-400
          text-red-500 backdrop-blur-md
          rounded-xl font-semibold shadow-xl
          hover:bg-red-600 hover:text-white
          hover:shadow-red-700/70
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
          transition-all duration-300
          text-base sm:text-lg
          active:scale-95
          select-none
        "
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        aria-label="Logout"
      >
        <LogOut size={24} />
        <span className="hidden xs:inline">Logout</span>
      </motion.button>

      {/* Title */}
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-indigo-800 mb-2 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
      >
        🎯 AcadSphere
      </motion.h1>

      {/* Welcome Text */}
      <motion.p
        className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-2 text-center px-2 sm:px-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Welcome, <span className="font-semibold text-indigo-500">{username}</span> 👋
      </motion.p>

      {/* Instructions */}
      <motion.p
        className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 text-center px-4 sm:px-0 max-w-3xl"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Choose your education type to begin tracking your academic journey.
      </motion.p>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-6xl px-2 sm:px-4 md:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* School */}
        <Link to="/school" aria-label="Go to School Section">
          <motion.div
            className="backdrop-blur-md bg-white/60 border border-green-300 p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer min-h-[180px] flex flex-col justify-between"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">🏫 School</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Track your academic performance across various subjects and exams.
              Get insights into your grade trends, weekly tests, and prepare smarter.
            </p>
          </motion.div>
        </Link>

        {/* College */}
        <Link to="/college" aria-label="Go to College Section">
          <motion.div
            className="backdrop-blur-md bg-white/60 border border-blue-300 p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer min-h-[180px] flex flex-col justify-between"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2">🎓 College</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Manage your semester-wise grades, GPA, arrears, and overall CGPA.
              Stay on top of academic goals and visualize your academic growth.
            </p>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
