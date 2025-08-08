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
    <div
      className="
        min-h-screen w-full
        bg-gradient-to-br from-black via-gray-900 to-black 
        text-white flex flex-col items-center justify-start
        relative
        px-3 py-5
        sm:px-6 sm:py-8
        md:px-12 md:py-10
        lg:px-24 xl:px-36
      "
      style={{ overflowX: "hidden" }}
    >
      {/* LOGOUT BUTTON */}
      <motion.button
        onClick={handleLogout}
        className={`
          fixed top-3 right-3 z-30
          flex items-center gap-2
          px-4 py-3 sm:px-5 sm:py-3
          bg-gradient-to-r from-red-400 via-red-500 to-red-700
          text-white font-semibold
          border-none
          backdrop-blur-xl
          rounded-full shadow-2xl
          hover:brightness-110 hover:scale-105
          active:scale-95
          transition-all duration-300
          text-base sm:text-lg
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          select-none
        `}
        initial={{ opacity: 0, y: -15, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5 }}
        aria-label="Logout"
      >
        <LogOut size={22} />
        <span>Logout</span>
      </motion.button>

      {/* TITLE */}
      <motion.h1
        className="
          mt-14 mb-2 text-2xl font-extrabold text-indigo-800 text-center
          sm:text-4xl md:text-5xl lg:text-6xl
        "
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
      >
        🎯 AcadSphere
      </motion.h1>

      {/* WELCOME TEXT */}
      <motion.p
        className="text-base sm:text-xl md:text-2xl text-gray-200 mb-2 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        Welcome, <span className="font-semibold text-indigo-500">{username}</span> 👋
      </motion.p>

      {/* INSTRUCTIONS */}
      <motion.p
        className="
          text-sm sm:text-base md:text-lg text-gray-400 mb-6 text-center px-2 max-w-lg
        "
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Choose your education type to begin tracking your academic journey.
      </motion.p>

      {/* CARDS - vertical on mobile, side-by-side on wider screens */}
      <motion.div
        className="
          grid
          grid-cols-1 gap-5 w-full max-w-sm
          sm:max-w-3xl sm:grid-cols-2 sm:gap-6 sm:px-0
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {/* School Card */}
        <Link to="/school" className="w-full" aria-label="Go to School Section">
          <motion.div
            className="
              w-full h-full
              backdrop-blur-md bg-gradient-to-br from-green-50 via-white to-green-200
              border border-green-400
              p-5 sm:p-7 md:p-8
              rounded-2xl shadow-xl
              hover:scale-105 hover:shadow-2xl transform transition duration-300
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
              backdrop-blur-md bg-gradient-to-br from-blue-50 via-white to-blue-200
              border border-blue-400
              p-5 sm:p-7 md:p-8
              rounded-2xl shadow-xl
              hover:scale-105 hover:shadow-2xl transform transition duration-300
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
