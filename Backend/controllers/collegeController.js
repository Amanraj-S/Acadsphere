const CollegeSemester = require('../models/CollegeSemester');

exports.storeSemester = async (req, res) => {
  try {
    const semester = await CollegeSemester.create({ ...req.body, userId: req.user.id });
    res.json(semester);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSemesters = async (req, res) => {
  try {
    const semesters = await CollegeSemester.find({ userId: req.user.id });
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSemester = async (req, res) => {
  try {
    await CollegeSemester.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
