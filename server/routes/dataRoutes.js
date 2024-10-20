const express = require('express');
const { fetchData, fetchCategoryData } = require('../controllers/data');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/data', verifyToken, fetchData);
router.get('/category', verifyToken, fetchCategoryData);

module.exports = router;