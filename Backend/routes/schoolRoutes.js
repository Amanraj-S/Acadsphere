const express = require('express');
const router = express.Router();
const {
  storeExam,
  getExams,
  updateExam,
  deleteExam
} = require('../controllers/schoolController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, storeExam);
router.get('/', protect, getExams);
router.put('/:id', protect, updateExam);       // ✅ Edit
router.delete('/:id', protect, deleteExam);    // ✅ Delete

module.exports = router;
