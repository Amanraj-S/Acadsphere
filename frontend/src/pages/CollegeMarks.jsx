import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid
} from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { addCollegeSemester, getCollegeSemesters } from "../api/Semester";

const AddCollegeMarks = () => {
  const [currentSubjects, setCurrentSubjects] = useState([{ name: "", mark: "", credit: "" }]);
  const [semesters, setSemesters] = useState([]);
  const [editingSemesterId, setEditingSemesterId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCollegeSemesters();
        setSemesters(data || []);
      } catch (err) {
        toast.error("Failed to load semesters from server.");
      }
    };
    fetchData();
  }, []);

  const getNextAllowedSemester = () => {
    const semNumbers = semesters
      .map((sem) => parseInt(sem.semester.split(" ")[1]))
      .sort((a, b) => a - b);
    for (let i = 1; i <= semNumbers.length + 1; i++) {
      if (!semNumbers.includes(i)) return i;
    }
    return semNumbers.length + 1;
  };

  const semesterCount = getNextAllowedSemester();

  const handleInputChange = (index, field, value) => {
    const updatedSubjects = [...currentSubjects];
    updatedSubjects[index][field] = value;
    setCurrentSubjects(updatedSubjects);
  };

  const addSubject = () => {
    setCurrentSubjects([...currentSubjects, { name: "", mark: "", credit: "" }]);
  };

  const deleteSubject = (index) => {
    const updatedSubjects = [...currentSubjects];
    updatedSubjects.splice(index, 1);
    setCurrentSubjects(updatedSubjects);
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let weightedScore = 0;

    currentSubjects.forEach((subject) => {
      const mark = parseFloat(subject.mark);
      const credit = parseFloat(subject.credit);
      if (!isNaN(mark) && !isNaN(credit) && mark >= 50) {
        let gradePoint = 0;
        if (mark >= 90) gradePoint = 10;
        else if (mark >= 80) gradePoint = 9;
        else if (mark >= 70) gradePoint = 8;
        else if (mark >= 60) gradePoint = 7;
        else if (mark >= 50) gradePoint = 6;
        weightedScore += gradePoint * credit;
        totalCredits += credit;
      }
    });

    return totalCredits === 0 ? 0 : (weightedScore / totalCredits).toFixed(2);
  };

  const calculateCGPA = () => {
    if (semesters.length === 0) return 0;
    const total = semesters.reduce((sum, sem) => sum + parseFloat(sem.gpa), 0);
    return (total / semesters.length).toFixed(2);
  };

  const storeSemester = async () => {
    const gpa = calculateGPA();
    const arrears = currentSubjects.filter((sub) => {
      const mark = Number(sub.mark);
      return !isNaN(mark) && mark < 50;
    }).length;

    if (editingSemesterId) {
      try {
        await axios.put(
          `/api/college/${editingSemesterId}`,
          { subjects: currentSubjects, gpa, arrears },
          { withCredentials: true }
        );
        const updated = await getCollegeSemesters();
        setSemesters(updated);
        setCurrentSubjects([{ name: "", mark: "", credit: "" }]);
        setEditingSemesterId(null);
        toast.success("Semester updated successfully!");
      } catch (err) {
        toast.error("Failed to update semester.");
      }
      return;
    }

    const semesterLabel = `Sem ${semesterCount}`;
    const alreadyExists = semesters.some((s) => s.semester === semesterLabel);
    if (alreadyExists) {
      toast.error(`${semesterLabel} already exists.`);
      return;
    }

    const newSemester = {
      semester: semesterLabel,
      subjects: currentSubjects,
      gpa,
      arrears,
    };

    try {
      await addCollegeSemester(newSemester);
      const updated = await getCollegeSemesters();
      setSemesters(updated);
      setCurrentSubjects([{ name: "", mark: "", credit: "" }]);
      toast.success(`${semesterLabel} stored successfully!`);
    } catch (err) {
      toast.error("Failed to store semester on server.");
    }
  };

  const deleteSemester = async (id) => {
    try {
      await axios.delete(`/api/college/${id}`, { withCredentials: true });
      setSemesters(prev => prev.filter(sem => sem._id !== id));
      toast.success("Semester deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete semester from server.");
    }
  };

  const editSemester = (index) => {
    const sem = semesters[index];
    const copiedSubjects = sem.subjects.map((subj) => ({
      name: subj.name,
      mark: subj.mark,
      credit: subj.credit
    }));
    setCurrentSubjects(copiedSubjects);
    setEditingSemesterId(sem._id);
    toast.info(`Editing ${sem.semester}...`);
  };

  return (
    <div className="
      min-h-screen w-full
      bg-gradient-to-br from-black via-gray-900 to-black 
      text-white 
      px-4 py-6
      sm:px-6 sm:py-8
      md:px-8 md:py-10
      lg:px-12 lg:py-12
      xl:px-16 xl:py-14
    ">
      <ToastContainer />
      <h2 className="
        text-xl sm:text-2xl md:text-3xl lg:text-4xl 
        font-bold mb-4 sm:mb-6 md:mb-8 
        text-center text-indigo-800
      ">
        🎓 College Marks Tracker
      </h2>

      <motion.div
        className="
          bg-white/10 backdrop-blur-md 
          p-4 sm:p-5 md:p-6 
          rounded-2xl shadow-xl 
          max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 
          mx-auto
        "
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="
          text-base sm:text-lg md:text-xl lg:text-2xl 
          font-semibold mb-3 sm:mb-4
        ">
          {editingSemesterId ? "Edit Semester" : `Enter Semester ${semesterCount} Marks`}
        </h3>

        {currentSubjects.map((subject, index) => (
          <motion.div
            key={index}
            className="
              grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 
              mb-3 sm:mb-4
            "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <input
              className="
                bg-gray-900 text-white 
                p-2 sm:p-3 rounded-xl 
                border border-gray-700 
                w-full 
                text-sm sm:text-base
                placeholder-gray-400
              "
              type="text"
              placeholder="Subject Name"
              value={subject.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
            />
            <input
              className="
                bg-gray-900 text-white 
                p-2 sm:p-3 rounded-xl 
                border border-gray-700 
                w-full 
                text-sm sm:text-base
                placeholder-gray-400
              "
              type="number"
              placeholder="Mark /100"
              value={subject.mark}
              onChange={(e) => handleInputChange(index, "mark", e.target.value)}
            />
            <input
              className="
                bg-gray-900 text-white 
                p-2 sm:p-3 rounded-xl 
                border border-gray-700 
                w-full 
                text-sm sm:text-base
                placeholder-gray-400
              "
              type="number"
              placeholder="Credit"
              value={subject.credit}
              onChange={(e) => handleInputChange(index, "credit", e.target.value)}
            />
            <button
              onClick={() => deleteSubject(index)}
              className="
                bg-transparent hover:bg-red-600 
                text-white text-lg sm:text-xl 
                px-4 sm:px-6 py-2 sm:py-2.5 
                rounded-xl shadow-lg 
                hover:scale-105 transition-all duration-300
                w-full sm:w-auto
              "
            >
              ✖
            </button>
          </motion.div>
        ))}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
          <button
            onClick={addSubject}
            className="
              bg-blue-600 hover:bg-blue-500 
              transition px-4 sm:px-5 py-2 sm:py-2.5 
              rounded-xl shadow text-white 
              text-sm sm:text-base
              w-full sm:w-auto
            "
          >
            ➕ Add Subject
          </button>
          <button
            onClick={storeSemester}
            className="
              bg-green-600 hover:bg-green-500 
              transition px-4 sm:px-5 py-2 sm:py-2.5 
              rounded-xl shadow text-white 
              text-sm sm:text-base
              w-full sm:w-auto
            "
          >
            {editingSemesterId ? "✅ Update Semester" : `💾 Store Semester ${semesterCount}`}
          </button>
        </div>
      </motion.div>

      {semesters.length > 0 && (
        <>
          <h3 className="
            text-lg sm:text-xl md:text-2xl lg:text-3xl 
            font-bold mt-8 sm:mt-10 md:mt-12 
            text-center
          ">
            📚 Stored Semesters
          </h3>

          <div className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
            gap-4 sm:gap-6 md:gap-8 
            mt-4 sm:mt-6
            max-w-full sm:max-w-lg md:max-w-3xl lg:max-w-5xl 
            mx-auto
          ">
            {[...semesters]
              .sort((a, b) => parseInt(a.semester.split(" ")[1]) - parseInt(b.semester.split(" ")[1]))
              .map((sem, index) => (
                <motion.div
                  key={sem._id}
                  className="
                    bg-white/10 backdrop-blur-md 
                    p-4 sm:p-5 rounded-2xl shadow-xl
                    min-h-[150px] sm:min-h-[180px]
                  "
                  whileHover={{ scale: 1.03 }}
                >
                  <h4 className="
                    text-base sm:text-lg md:text-xl 
                    font-semibold mb-2 sm:mb-3
                  ">
                    {sem.semester}
                  </h4>
                  <p className="mb-2 text-sm sm:text-base">
                    🎓 GPA: <span className="text-green-400 font-semibold">{sem.gpa}</span> &nbsp;|&nbsp;
                    ❌ Arrears: <span className="text-red-400 font-semibold">{sem.arrears}</span>
                  </p>
                  <ul className="text-xs sm:text-sm mb-2 sm:mb-3">
                    {sem.subjects.map((sub, idx) => (
                      <li key={idx}>
                        {sub.name}: {sub.mark}/100 (Credit: {sub.credit})
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => editSemester(index)}
                      className="
                        bg-yellow-500 hover:bg-yellow-400 
                        text-white px-3 sm:px-4 py-1.5 sm:py-2 
                        rounded-xl text-sm sm:text-base
                        w-full sm:w-auto
                      "
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteSemester(sem._id)}
                      className="
                        bg-red-500 hover:bg-red-400 
                        text-white px-3 sm:px-4 py-1.5 sm:py-2 
                        rounded-xl text-sm sm:text-base
                        w-full sm:w-auto
                      "
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>

          <div className="
            mt-8 sm:mt-10 md:mt-12 
            bg-white/10 backdrop-blur-md 
            p-4 sm:p-5 md:p-6 
            rounded-xl shadow-xl 
            max-w-full sm:max-w-lg md:max-w-3xl lg:max-w-5xl 
            mx-auto
            overflow-x-auto
          ">
            <h3 className="
              text-base sm:text-lg md:text-xl lg:text-2xl 
              font-semibold mb-3 sm:mb-4
            ">
              📊 GPA Chart
            </h3>
            <div className="w-full min-w-[300px] sm:min-w-[400px]">
              <BarChart 
                width={600} 
                height={200} 
                data={semesters} 
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
                <XAxis dataKey="semester" stroke="#fff" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} stroke="#fff" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", fontSize: 12 }} />
                <Bar dataKey="gpa" fill="#00FFFF" barSize={30} />
              </BarChart>
            </div>
          </div>

          <div className="
            mt-8 sm:mt-10 md:mt-12 
            bg-white/10 backdrop-blur-md 
            p-4 sm:p-5 md:p-6 
            rounded-xl shadow-xl 
            max-w-full sm:max-w-lg md:max-w-3xl lg:max-w-5xl 
            mx-auto
            overflow-x-auto
          ">
            <h3 className="
              text-base sm:text-lg md:text-xl lg:text-2xl 
              font-semibold mb-3 sm:mb-4
            ">
              📈 GPA Trend
            </h3>
            <div className="w-full min-w-[300px] sm:min-w-[400px]">
              <LineChart 
                width={600} 
                height={200} 
                data={semesters} 
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="semester" stroke="#fff" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} stroke="#fff" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", fontSize: 12 }} />
                <Line type="monotone" dataKey="gpa" stroke="#4ade80" strokeWidth={2} />
              </LineChart>
            </div>
            <p className="
              text-sm sm:text-base md:text-lg 
              mt-3 sm:mt-4 font-bold
            ">
              🌟 CGPA: <span className="text-green-400">{calculateCGPA()}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AddCollegeMarks;