const express = require('express');
const router = express.Router();
const {
  storeSemester,
  getSemesters,
  deleteSemesterById,
  deleteSemesterByLabel,
  updateSemesterById,
} = require('../controllers/collegeController');
const { protect } = require('../middleware/authMiddleware');

// Save a new semester
router.post('/', protect, storeSemester);

// Get all semesters
router.get('/', protect, getSemesters);

// Delete by semester label (e.g., "Sem 1") — MUST COME BEFORE :id
router.delete('/label/:semester', protect, deleteSemesterByLabel);

// Delete by ObjectId
router.delete('/:id', protect, deleteSemesterById);

router.put('/:id', protect, updateSemesterById); 

module.exports = router;
