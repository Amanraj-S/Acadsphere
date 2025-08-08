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
        px-4 py-6
        sm:px-6 sm:py-8
        md:px-8 md:py-10
        lg:px-12 lg:py-12
        xl:px-16 xl:py-14
        2xl:px-24 2xl:py-16
      "
      style={{ overflowX: "hidden" }}
    >
      {/* LOGOUT BUTTON */}
      <motion.button
        onClick={handleLogout}
        className={`
          fixed top-4 right-4 z-30
          flex items-center gap-2
          px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3
          bg-gradient-to-r from-red-400 via-red-500 to-red-700
          text-white font-semibold
          border-none
          backdrop-blur-xl
          rounded-full shadow-lg
          hover:brightness-110 hover:scale-105
          active:scale-95
          transition-all duration-300
          text-sm sm:text-base md:text-lg
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          select-none
        `}
        initial={{ opacity: 0, y: -15, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5 }}
        aria-label="Logout"
      >
        <LogOut size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
        <span>Logout</span>
      </motion.button>

      {/* TITLE */}
      <motion.h1
        className="
          mt-12 mb-3 text-xl font-extrabold text-indigo-800 text-center
          sm:mt-14 sm:mb-4 sm:text-3xl
          md:mt-16 md:mb-5 md:text-4xl
          lg:text-5xl lg:mt-20 lg:mb-6
          xl:text-6xl
        "
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
      >
        🎯 AcadSphere
      </motion.h1>

      {/* WELCOME TEXT */}
      <motion.p
        className="
          text-sm sm:text-lg md:text-xl lg:text-2xl 
          text-gray-200 mb-3 sm:mb-4 md:mb-5 lg:mb-6 
          text-center
        "
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        Welcome, <span className="font-semibold text-indigo-500">{username}</span> 👋
      </motion.p>

      {/* INSTRUCTIONS */}
      <motion.p
        className="
          text-xs sm:text-sm md:text-base lg:text-lg 
          text-gray-400 mb-5 sm:mb-6 md:mb-8 lg:mb-10 
          text-center px-2 sm:px-4 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
        "
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Choose your education type to begin tracking your academic journey.
      </motion.p>

      {/* CARDS */}
      <motion.div
        className="
          grid
          grid-cols-1 gap-4 w-full max-w-xs
          sm:max-w-lg sm:gap-5
          md:max-w-3xl md:grid-cols-2 md:gap-6
          lg:max-w-4xl lg:gap-8
          xl:max-w-5xl
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
              p-4 sm:p-6 md:p-7 lg:p-8
              rounded-2xl shadow-lg
              hover:scale-105 hover:shadow-xl transform transition duration-300
              cursor-pointer min-h-[120px] sm:min-h-[150px] md:min-h-[160px] lg:min-h-[180px]
              flex flex-col justify-between
            "
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-green-800 mb-2">🏫 School</h2>
            <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
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
              p-4 sm:p-6 md:p-7 lg:p-8
              rounded-2xl shadow-lg
              hover:scale-105 hover:shadow-xl transform transition duration-300
              cursor-pointer min-h-[120px] sm:min-h-[150px] md:min-h-[160px] lg:min-h-[180px]
              flex flex-col justify-between
            "
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-blue-800 mb-2">🎓 College</h2>
            <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
              Manage your semester-wise grades, GPA, arrears, and overall CGPA.
              Stay on top of academic goals and visualize your academic growth.
            </p>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}