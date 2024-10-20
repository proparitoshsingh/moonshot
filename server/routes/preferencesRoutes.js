const express = require('express');
const { setPreferences, getPreferences, clearPreferences } = require('../controllers/preferences');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/preferences', verifyToken, setPreferences);
router.get('/preferences', verifyToken, getPreferences);
router.delete('/preferences', verifyToken, clearPreferences);

module.exports = router;
