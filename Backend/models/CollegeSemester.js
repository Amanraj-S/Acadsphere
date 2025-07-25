const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  semester: String,
  gpa: String,
  arrears: Number,
  subjects: [{ name: String, mark: String, credit: String }]
}, { timestamps: true });

module.exports = mongoose.model('CollegeSemester', semesterSchema);
