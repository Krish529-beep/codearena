const express = require('express');
const {
  getMe,
  updateProfile,
  setLeetCodeUsername,
  syncLeetCodeData,
  getUserProfile,
} = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { syncLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateProfile);
router.post('/me/leetcode', authenticate, setLeetCodeUsername);
router.post('/me/sync', authenticate, syncLimiter, syncLeetCodeData);
router.get('/:id', authenticate, getUserProfile);

module.exports = router;
