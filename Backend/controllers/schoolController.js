const SchoolExam = require('../models/SchoolExam');

const storeExam = async (req, res) => {
  try {
    const exam = await SchoolExam.create({ ...req.body, userId: req.user.id });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExams = async (req, res) => {
  try {
    const exams = await SchoolExam.find({ userId: req.user.id });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  storeExam,
  getExams
};
