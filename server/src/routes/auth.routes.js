const express = require('express');
const { register, login, googleAuth, refresh, logout } = require('../controllers/auth.controller');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { z } = require('zod');

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google', authLimiter, googleAuth);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
