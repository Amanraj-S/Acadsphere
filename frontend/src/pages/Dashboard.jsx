import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const username = localStorage.getItem("username") || "Student";

  return (
    <div className="
      min-h-screen bg-gradient-to-br from-black via-gray-900 to-black
      text-white flex flex-col items-center justify-start
      relative
      px-3 py-5
      sm:px-6 sm:py-8
      md:px-12 md:py-10
      "
      style={{overflowX: "hidden"}}
    >
      {/* LOGOUT BUTTON */}
      <motion.button
        onClick={handleLogout}
        // mobile-friendly tap area + floating
        className="
          fixed top-3 right-3 z-30
          flex items-center gap-2
          px-5 py-3
          bg-white/30 border border-red-400
          text-red-500
          backdrop-blur-xl
          rounded-2xl font-semibold shadow-xl
          hover:bg-red-600 hover:text-white
          hover:shadow-red-700/70
          transition-all duration-300
          text-base
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        "
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        aria-label="Logout"
      >
        <LogOut size={28} />
        <span className="hidden sm:inline">Logout</span>
      </motion.button>

      {/* TITLE */}
      <motion.h1
        className="
          mt-8 mb-2 text-2xl font-extrabold text-indigo-800 text-center
          sm:text-4xl md:text-5xl
        "
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
      >
        🎯 AcadSphere
      </motion.h1>

      {/* WELCOME TEXT */}
      <motion.p
        className="text-base sm:text-xl text-gray-200 mb-2 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Welcome, <span className="font-semibold text-indigo-500">{username}</span> 👋
      </motion.p>

      {/* INSTRUCTIONS */}
      <motion.p
        className="
          text-sm sm:text-base text-gray-400 mb-6 text-center px-1 max-w-lg
        "
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Choose your education type to begin tracking your academic journey.
      </motion.p>

      {/* CARDS - stack vertical on mobile */}
      <motion.div
        className="
          grid grid-cols-1 gap-4 w-full max-w-md
          sm:max-w-3xl sm:grid-cols-2 sm:gap-6 sm:px-0
          px-0
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* School Card */}
        <Link to="/school" className="w-full" aria-label="Go to School Section">
          <motion.div
            className="
              w-full h-full
              backdrop-blur-md bg-white/70
              border border-green-300
              p-5 sm:p-8
              rounded-2xl shadow-xl
              hover:scale-105 transform transition duration-300
              cursor-pointer min-h-[140px] sm:min-h-[180px]
              flex flex-col justify-between
            "
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-lg sm:text-2xl font-bold text-green-800 mb-2">🏫 School</h2>
            <p className="text-gray-700 text-xs sm:text-base leading-relaxed">
              Track your academic performance across various subjects and exams.
              Get insights into your grade trends, weekly tests, and prepare smarter.
            </p>
          </motion.div>
        </Link>

        {/* College Card */}
        <Link to="/college" className="w-full" aria-label="Go to College Section">
          <motion.div
            className="
              w-full h-full
              backdrop-blur-md bg-white/70
              border border-blue-300
              p-5 sm:p-8
              rounded-2xl shadow-xl
              hover:scale-105 transform transition duration-300
              cursor-pointer min-h-[140px] sm:min-h-[180px]
              flex flex-col justify-between
            "
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-lg sm:text-2xl font-bold text-blue-800 mb-2">🎓 College</h2>
            <p className="text-gray-700 text-xs sm:text-base leading-relaxed">
              Manage your semester-wise grades, GPA, arrears, and overall CGPA.
              Stay on top of academic goals and visualize your academic growth.
            </p>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
