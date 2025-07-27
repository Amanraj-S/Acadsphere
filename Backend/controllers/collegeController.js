const CollegeSemester = require('../models/CollegeSemester');

// Store a new semester
exports.storeSemester = async (req, res) => {
  try {
    const userId = req.user.id;
    const semesterData = { ...req.body, userId };

    const semester = await CollegeSemester.create(semesterData);
    res.json(semester);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all semesters for the logged-in user
exports.getSemesters = async (req, res) => {
  try {
    const userId = req.user.id;
    const semesters = await CollegeSemester.find({ userId });
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a semester by MongoDB _id
exports.deleteSemesterById = async (req, res) => {
  try {
    await CollegeSemester.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a semester by label like "Sem 1"
exports.deleteSemesterByLabel = async (req, res) => {
  try {
    const deleted = await CollegeSemester.findOneAndDelete({
      userId: req.user.id,
      semester: req.params.semester,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    res.json({ message: 'Semester deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update a semester by ID (edit subjects, gpa, arrears)
exports.updateSemesterById = async (req, res) => {
  try {
    const { subjects, gpa, arrears } = req.body;

    const updated = await CollegeSemester.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { subjects, gpa, arrears },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
