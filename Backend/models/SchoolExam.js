const mongoose = require('mongoose');

const schoolExamSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  subjects: [
    {
      name: String,
      mark: Number,
      outOf: Number,
    }
  ],
  percentage: Number,
  failed: [String], // was Number, now array of subject names
}, { timestamps: true });

module.exports = mongoose.models.SchoolExam || mongoose.model('SchoolExam', schoolExamSchema);
