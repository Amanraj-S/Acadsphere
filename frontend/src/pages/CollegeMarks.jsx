import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid
} from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addCollegeSemester, getCollegeSemesters } from "../api/Semester"; // ✅ updated

const AddCollegeMarks = () => {
  const [currentSubjects, setCurrentSubjects] = useState([
    { name: "", mark: "", credit: "" },
  ]);
  const [semesters, setSemesters] = useState([]);

  // ✅ Load semesters from backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCollegeSemesters(); // ✅ updated
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
    const total = semesters.reduce(
      (sum, sem) => sum + parseFloat(sem.gpa),
      0
    );
    return (total / semesters.length).toFixed(2);
  };

  // ✅ Store semester to backend
  const storeSemester = async () => {
    const gpa = calculateGPA();

    const arrears = currentSubjects.filter((sub) => {
      const mark = Number(sub.mark);
      return !isNaN(mark) && mark < 50;
    }).length;

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
      await addCollegeSemester(newSemester); // ✅ updated
      setSemesters([...semesters, newSemester]);
      setCurrentSubjects([{ name: "", mark: "", credit: "" }]);
      toast.success(`${semesterLabel} stored successfully!`);
    } catch (err) {
      toast.error("Failed to store semester on server.");
    }
  };

  const deleteSemester = (index) => {
    const updated = [...semesters];
    updated.splice(index, 1);
    setSemesters(updated);
    toast.info("Semester deleted.");
  };

  const editSemester = (index) => {
    const sem = semesters[index];
    setCurrentSubjects(sem.subjects);
    const updated = [...semesters];
    updated.splice(index, 1);
    setSemesters(updated);
    toast.info(`Editing ${sem.semester}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <ToastContainer />
      <h2 className="text-4xl font-bold mb-8 text-center text-white">
        🎓 College Marks Tracker
      </h2>

      <motion.div
        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-2xl font-semibold text-white mb-4">
          Enter Semester {semesterCount} Marks
        </h3>

        {currentSubjects.map((subject, index) => (
          <motion.div
            key={index}
            className="grid grid-cols-4 gap-4 mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <input
              className="bg-gray-900 text-white p-3 rounded-xl border border-gray-700"
              type="text"
              placeholder="Subject Name"
              value={subject.name}
              onChange={(e) =>
                handleInputChange(index, "name", e.target.value)
              }
            />
            <input
              className="bg-gray-900 text-white p-3 rounded-xl border border-gray-700"
              type="number"
              placeholder="Mark /100"
              value={subject.mark}
              onChange={(e) =>
                handleInputChange(index, "mark", e.target.value)
              }
            />
            <input
              className="bg-gray-900 text-white p-3 rounded-xl border border-gray-700"
              type="number"
              placeholder="Credit"
              value={subject.credit}
              onChange={(e) =>
                handleInputChange(index, "credit", e.target.value)
              }
            />
            <button
              onClick={() => deleteSubject(index)}
              className="bg-transparent hover:bg-red-600 text-white text-xl px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              ✖
            </button>
          </motion.div>
        ))}

        <div className="flex gap-4 mt-4">
          <button
            onClick={addSubject}
            className="bg-blue-600 hover:bg-blue-500 transition px-5 py-2 rounded-xl shadow text-white"
          >
            ➕ Add Subject
          </button>
          <button
            onClick={storeSemester}
            className="bg-green-600 hover:bg-green-500 transition px-5 py-2 rounded-xl shadow text-white"
          >
            💾 Store Semester {semesterCount}
          </button>
        </div>
      </motion.div>

      {semesters.length > 0 && (
        <>
          <h3 className="text-3xl font-bold mt-10 text-white text-center">
            📚 Stored Semesters
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {semesters
              .sort(
                (a, b) =>
                  parseInt(a.semester.split(" ")[1]) -
                  parseInt(b.semester.split(" ")[1])
              )
              .map((sem, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl"
                  whileHover={{ scale: 1.03 }}
                >
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {sem.semester}
                  </h4>
                  <p className="mb-2 text-white">
                    🎓 GPA:{" "}
                    <span className="text-green-400 font-semibold">
                      {sem.gpa}
                    </span>{" "}
                    &nbsp;|&nbsp; ❌ Arrears:{" "}
                    <span className="text-red-400 font-semibold">
                      {sem.arrears}
                    </span>
                  </p>

                  <ul className="text-sm mb-2">
                    {sem.subjects.map((sub, idx) => (
                      <li key={idx}>
                        {sub.name}: {sub.mark}/100 (Credit: {sub.credit})
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editSemester(index)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-xl"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteSemester(index)}
                      className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-xl"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>

          <div className="mt-10 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              📊 GPA Chart
            </h3>
            <BarChart width={400} height={300} data={semesters}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
              <XAxis dataKey="semester" stroke="#fff" />
              <YAxis domain={[0, 10]} stroke="#fff" />
              <Tooltip />
              <Bar dataKey="gpa" fill="#00FFFF" barSize={40} />
            </BarChart>
          </div>

          <div className="mt-10 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              📈 CGPA Trend
            </h3>
            <LineChart width={600} height={300} data={semesters}>
              <XAxis dataKey="semester" stroke="#fff" />
              <YAxis domain={[0, 10]} stroke="#fff" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="gpa"
                stroke="#4ade80"
                strokeWidth={3}
              />
            </LineChart>
            <p className="text-lg mt-4 font-bold text-white">
              🌟 CGPA:{" "}
              <span className="text-green-400">{calculateCGPA()}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AddCollegeMarks;
