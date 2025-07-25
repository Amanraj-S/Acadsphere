const mongoose = require('mongoose');

const schoolExamSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  subjects: [
    {
      name: String,
      mark: Number,
      outOf: Number
    }
  ],
  percentage: Number,
  failed: [String], // ✅ fix: was Number, now an array of strings
}, { timestamps: true });

module.exports = mongoose.model('SchoolExam', schoolExamSchema);
