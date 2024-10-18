const express = require('express');
const { fetchData, fetchCategoryData } = require('../controllers/data');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/data', fetchData);
router.get('/category', fetchCategoryData);

module.exports = router;