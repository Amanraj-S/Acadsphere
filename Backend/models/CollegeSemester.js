// models/CollegeSemester.js
const mongoose = require('mongoose');

const CollegeSemesterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: String, required: true },
  gpa: { type: String },               // Optional GPA
  arrears: { type: Number },           // Optional arrears
  subjects: [
    {
      name: { type: String, required: true },
      mark: { type: Number, required: true },
      credit: { type: String }         // Optional credit field
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('CollegeSemester', CollegeSemesterSchema);
