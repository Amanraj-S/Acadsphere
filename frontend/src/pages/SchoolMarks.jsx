import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addSchoolExam,
  getSchoolExams,
  updateSchoolExam,
  deleteSchoolExam,
} from "../api/Semester";

const SchoolMarks = () => {
  const [currentSubjects, setCurrentSubjects] = useState([
    { name: "", mark: "", outOf: 100 },
  ]);
  const [exams, setExams] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSchoolExams();
        setExams(data || []);
      } catch (err) {
        toast.error("Failed to load school data from server.");
      }
    };
    fetchData();
  }, []);

  const getNextAllowedExamId = () => {
    const ids = exams.map((e) => e.id).sort((a, b) => a - b);
    for (let i = 1; i <= ids.length + 1; i++) {
      if (!ids.includes(i)) return i;
    }
    return ids.length + 1;
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...currentSubjects];
    updated[index][field] = value;
    setCurrentSubjects(updated);
  };

  const addSubject = () => {
    setCurrentSubjects([
      ...currentSubjects,
      { name: "", mark: "", outOf: 100 },
    ]);
  };

  const deleteSubject = (index) => {
    const updated = [...currentSubjects];
    updated.splice(index, 1);
    setCurrentSubjects(updated);
  };

  const calculatePercentage = () => {
    const total = currentSubjects.reduce(
      (sum, s) => sum + (parseFloat(s.mark) || 0),
      0
    );
    const max = currentSubjects.reduce(
      (sum, s) => sum + (parseFloat(s.outOf) || 0),
      0
    );
    return max > 0 ? ((total / max) * 100).toFixed(2) : 0;
  };

  const storeExam = async () => {
    const percentage = calculatePercentage();
    const failed = currentSubjects
      .filter((s) => parseFloat(s.mark) < s.outOf / 2)
      .map((s) => s.name);

    const newExam = {
      subjects: currentSubjects,
      percentage,
      failed,
    };

    try {
      let saved;
      if (editingId) {
        saved = await updateSchoolExam(editingId, newExam);
        setExams(exams.map((e) => (e._id === editingId ? saved : e)));
        toast.success(`Exam ${saved.id || ""} updated!`);
      } else {
        const id = getNextAllowedExamId();
        saved = await addSchoolExam({ ...newExam, id });
        setExams([...exams, saved]);
        toast.success(`Exam ${id} stored successfully!`);
      }

      setCurrentSubjects([{ name: "", mark: "", outOf: 100 }]);
      setEditingId(null);
    } catch (err) {
      toast.error("Failed to save exam data.");
    }
  };

  const handleEdit = (exam) => {
    setCurrentSubjects(
      exam.subjects.map((s) => ({ ...s, outOf: s.outOf || 100 }))
    );
    setEditingId(exam._id);
    toast.info(`Editing Exam ${exam.id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchoolExam(id);
      setExams(exams.filter((e) => e._id !== id));
      toast.success("Exam deleted.");
    } catch (err) {
      toast.error("Failed to delete exam.");
    }
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
      <h1 className="
        text-xl sm:text-2xl md:text-3xl lg:text-4xl 
        font-bold mb-4 sm:mb-6 md:mb-8 
        text-center text-indigo-800
      ">
        📘 School Marks Entry
      </h1>

      <div className="
        max-w-full mx-auto
        sm:max-w-lg
        md:max-w-2xl
        lg:max-w-4xl
        xl:max-w-5xl
      ">
        {currentSubjects.map((subj, index) => (
          <motion.div
            key={index}
            className="
              flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 
              items-start sm:items-center 
              bg-white/10 p-4 sm:p-5 rounded-lg 
              border border-white/20 backdrop-blur-lg
            "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Subject"
              value={subj.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
              className="
                bg-transparent text-white 
                border border-white/30 
                p-2 rounded w-full sm:w-1/3 
                placeholder-white/60 text-sm sm:text-base
              "
            />
            <input
              type="number"
              placeholder="Mark"
              value={subj.mark}
              onChange={(e) => handleInputChange(index, "mark", e.target.value)}
              className="
                bg-transparent text-white 
                border border-white/30 
                p-2 rounded w-full sm:w-1/4 
                placeholder-white/60 text-sm sm:text-base
              "
            />
            <select
              value={subj.outOf}
              onChange={(e) => handleInputChange(index, "outOf", e.target.value)}
              className="
                bg-transparent text-white 
                border border-white/30 
                p-2 rounded w-full sm:w-1/4 
                text-sm sm:text-base
              "
            >
              <option value={100}>/100</option>
              <option value={50}>/50</option>
            </select>
            <button
              onClick={() => deleteSubject(index)}
              className="text-red-500 hover:text-red-400 font-bold text-lg sm:text-xl w-full sm:w-auto text-center"
            >
              ✖
            </button>
          </motion.div>
        ))}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={addSubject}
            className="
              bg-blue-600 hover:bg-blue-500 
              text-white px-4 py-2 sm:px-5 sm:py-2.5 
              rounded-xl shadow-md 
              text-sm sm:text-base
              w-full sm:w-auto
            "
          >
            Add Subject
          </button>
          <button
            onClick={storeExam}
            className="
              bg-green-600 hover:bg-green-500 
              text-white px-4 py-2 sm:px-5 sm:py-2.5 
              rounded-xl shadow-md 
              text-sm sm:text-base
              w-full sm:w-auto
            "
          >
            {editingId ? "Update Exam" : "Store Exam"}
          </button>
        </div>

        <ToastContainer />

        {exams.map((exam, index) => (
          <motion.div
            key={index}
            className="
              mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 
              rounded-xl shadow-lg bg-white/10 
              text-white border border-white/20 
              backdrop-blur-lg
            "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="
              text-base sm:text-lg md:text-xl 
              font-semibold mb-3
            ">
              📊 Exam {exam.id}
            </h2>
            <p className="mb-2 text-sm sm:text-base">
              Percentage:{" "}
              <span className="font-bold text-cyan-300">{exam.percentage}%</span>{" "}
              | Fail Subjects: {exam.failed.join(", ") || "None"}
            </p>

            <ResponsiveContainer width="100%" height={200} className="min-h-[200px] sm:min-h-[250px]">
              <BarChart
                data={exam.subjects}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
                <XAxis dataKey="name" stroke="#fff" tick={{ fontSize: 12 }} />
                <YAxis stroke="#fff" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="mark" fill="#00FFFF" />
              </BarChart>
            </ResponsiveContainer>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4">
              <button
                onClick={() => handleEdit(exam)}
                className="
                  bg-yellow-500 hover:bg-yellow-400 
                  text-white px-4 py-1.5 sm:py-2 
                  rounded-xl text-sm sm:text-base
                  w-full sm:w-auto
                "
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(exam._id)}
                className="
                  bg-red-600 hover:bg-red-500 
                  text-white px-4 py-1.5 sm:py-2 
                  rounded-xl text-sm sm:text-base
                  w-full sm:w-auto
                "
              >
                🗑️ Delete
              </button>
            </div>
          </motion.div>
        ))}

        {exams.length > 1 && (
          <motion.div 
            className="mt-8 sm:mt-10 md:mt-12" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="
              text-lg sm:text-xl md:text-2xl 
              font-semibold mb-4 sm:mb-6 
              text-center
            ">
              📈 Overall Percentage Trend
            </h2>
            <ResponsiveContainer width="100%" height={200} className="min-h-[200px] sm:min-h-[250px]">
              <LineChart
                data={exams.map((e) => ({
                  name: `Exam ${e.id}`,
                  percentage: e.percentage,
                }))}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
                <XAxis dataKey="name" stroke="#fff" tick={{ fontSize: 12 }} />
                <YAxis stroke="#fff" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#00FA9A"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SchoolMarks;