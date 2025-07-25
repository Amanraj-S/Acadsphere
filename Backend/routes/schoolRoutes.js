// backend/routes/schoolRoutes.js
const express = require('express');
const router = express.Router();

const { storeExam, getExams } = require('../controllers/schoolController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, storeExam);
router.get('/', protect, getExams);

module.exports = router;
