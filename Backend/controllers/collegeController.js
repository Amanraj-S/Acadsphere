const CollegeSemester = require('../models/CollegeSemester');

exports.storeSemester = async (req, res) => {
  try {
    const userId = req.user.id;
    const semesterData = { ...req.body, userId };

    const semester = await CollegeSemester.create(semesterData);
    res.status(201).json(semester);
  } catch (err) {
    console.error('Error storing semester:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getSemesters = async (req, res) => {
  try {
    const userId = req.user.id;
    const semesters = await CollegeSemester.find({ userId });
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSemesterById = async (req, res) => {
  try {
    await CollegeSemester.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
