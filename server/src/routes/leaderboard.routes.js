const express = require('express');
const { getGroupLeaderboard } = require('../controllers/leaderboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/group/:groupId', authenticate, getGroupLeaderboard);

module.exports = router;
