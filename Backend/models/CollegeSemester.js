const mongoose = require('mongoose');

const CollegeSemesterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: String, required: true },
  gpa: {
    type: Number,
    min: 0,
    max: 10,
    default: null,
  },
  arrears: {
    type: Number,
    min: 0,
    default: 0,
  },
  subjects: [
    {
      name: { type: String, required: true },
      mark: { type: Number, required: true, min: 0, max: 100 },
      credit: { type: Number, min: 0, default: 0 },
    },
  ],
}, { timestamps: true });

CollegeSemesterSchema.index({ userId: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('CollegeSemester', CollegeSemesterSchema);
