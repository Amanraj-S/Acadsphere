import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addSchoolExam, getSchoolExams } from "../api/Semester"; // ✅ correct import

const SchoolMarks = () => {
  const [currentSubjects, setCurrentSubjects] = useState([{ name: "", mark: "", outOf: 100 }]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSchoolExams(); // ✅ correct API call
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
    setCurrentSubjects([...currentSubjects, { name: "", mark: "", outOf: 100 }]);
  };

  const deleteSubject = (index) => {
    const updated = [...currentSubjects];
    updated.splice(index, 1);
    setCurrentSubjects(updated);
  };

  const calculatePercentage = () => {
    const total = currentSubjects.reduce((sum, s) => sum + (parseFloat(s.mark) || 0), 0);
    const max = currentSubjects.reduce((sum, s) => sum + (parseFloat(s.outOf) || 0), 0);
    return max > 0 ? ((total / max) * 100).toFixed(2) : 0;
  };

  const storeExam = async () => {
    const percentage = calculatePercentage();
    const id = getNextAllowedExamId();
    const failed = currentSubjects.filter((s) => parseFloat(s.mark) < (s.outOf / 2)).map((s) => s.name);

    const newExam = {
      id,
      percentage,
      failed,
      subjects: currentSubjects
    };

    try {
      await addSchoolExam(newExam); // ✅ correct API call
      setExams([...exams, newExam]);
      setCurrentSubjects([{ name: "", mark: "", outOf: 100 }]);
      toast.success(`Exam ${id} stored successfully!`);
    } catch (err) {
      toast.error("Failed to store exam data.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">📘 School Marks Entry</h1>

      <div className="max-w-4xl mx-auto">
        {currentSubjects.map((subj, index) => (
          <motion.div
            key={index}
            className="flex gap-4 mb-4 items-center bg-white/10 p-4 rounded-lg border border-white/20 backdrop-blur-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Subject"
              value={subj.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
              className="bg-transparent text-white border border-white/30 p-2 rounded w-1/3 placeholder-white/60"
            />
            <input
              type="number"
              placeholder="Mark"
              value={subj.mark}
              onChange={(e) => handleInputChange(index, "mark", e.target.value)}
              className="bg-transparent text-white border border-white/30 p-2 rounded w-1/4 placeholder-white/60"
            />
            <select
              value={subj.outOf}
              onChange={(e) => handleInputChange(index, "outOf", e.target.value)}
              className="bg-transparent text-white border border-white/30 p-2 rounded w-1/4"
            >
              <option value={100}>/100</option>
              <option value={50}>/50</option>
            </select>
            <button
              onClick={() => deleteSubject(index)}
              className="text-red font-bold text-lg"
            >
              ✖
            </button>
          </motion.div>
        ))}

        <div className="flex gap-4 mb-8">
          <button
            onClick={addSubject}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl shadow-md"
          >
            Add Subject
          </button>
          <button
            onClick={storeExam}
            className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-xl shadow-md"
          >
            Store Exam
          </button>
        </div>

        <ToastContainer />

        {exams.map((exam, index) => (
          <motion.div
            key={index}
            className="mb-8 p-6 rounded-xl shadow-lg bg-white/10 text-white border border-white/20 backdrop-blur-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-3">📊 Exam {exam.id}</h2>
            <p className="mb-2">
              Percentage:{" "}
              <span className="font-bold text-cyan-300">{exam.percentage}%</span> | Fail Subjects:{" "}
              {exam.failed.join(", ") || "None"}
            </p>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={exam.subjects} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
                <Legend />
                <Bar dataKey="mark" fill="#00FFFF" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        ))}

        {exams.length > 1 && (
          <motion.div className="mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold mb-4 text-center">📈 Overall Percentage Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={exams.map((e) => ({ name: `Exam ${e.id}`, percentage: e.percentage }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
                <Line type="monotone" dataKey="percentage" stroke="#00FA9A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SchoolMarks;
