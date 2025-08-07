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

router.post('/', protect, storeSemester);
router.get('/', protect, getSemesters);
router.delete('/label/:semester', protect, deleteSemesterByLabel);
router.delete('/:id', protect, deleteSemesterById);
router.put('/:id', protect, updateSemesterById);

module.exports = router;
