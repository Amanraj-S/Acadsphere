const express = require('express');
const router = express.Router();
const { storeSemester, getSemesters, deleteSemester } = require('../controllers/collegeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, storeSemester);
router.get('/', protect, getSemesters);
router.delete('/:id', protect, deleteSemester);

module.exports = router;
