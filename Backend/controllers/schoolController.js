const SchoolExam = require('../models/SchoolExam');

const storeExam = async (req, res) => {
  try {
    const exam = await SchoolExam.create({ ...req.body, userId: req.user.id });
    res.status(201).json(exam);
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

const updateExam = async (req, res) => {
  try {
    const updated = await SchoolExam.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Exam not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const deleted = await SchoolExam.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { storeExam, getExams, updateExam, deleteExam };
