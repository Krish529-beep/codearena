const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const buildAuthUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  onboarded: user.onboarded,
  avatar: user.avatar,
  leetcodeUsername: user.leetcodeUsername,
  stats: user.stats,
  streak: user.streak,
  groups: user.groups || [],
  lastSyncedAt: user.lastSyncedAt || null,
  submissionCalendar: user.submissionCalendar || '{}',
});

const sendAuthResponse = async (res, user, message, statusCode = 200) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, cookieOptions);

  return res.status(statusCode).json({
    message,
    user: buildAuthUser(user),
    accessToken,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};

const register = async (req, res) => {
  try {
    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const { password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return sendAuthResponse(res, user, 'Registration successful', 201);
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const { password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return sendAuthResponse(res, user, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { OAuth2Client } = require('google-auth-library');
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      return res.status(501).json({ message: 'Google OAuth not configured' });
    }

    const { credential } = req.body;
    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
      return res.status(400).json({ message: 'Invalid Google account payload' });
    }

    const googleId = payload.sub;
    const email = payload.email.trim().toLowerCase();
    const name = payload.name?.trim() || email.split('@')[0];
    const picture = payload.picture || '';

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
      });
    } else {
      let didChange = false;
      if (!user.googleId) {
        user.googleId = googleId;
        didChange = true;
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
        didChange = true;
      }
      if (didChange) {
        await user.save();
      }
    }

    return sendAuthResponse(res, user, 'Google auth successful');
  } catch (error) {
    console.error('Google auth error:', error);

    if (error.message?.includes('Token used too late') || error.message?.includes('Wrong number of segments')) {
      return res.status(400).json({ message: 'Invalid Google credential' });
    }

    return res.status(500).json({ message: 'Google authentication failed' });
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== token) {
      clearRefreshCookie(res);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    return sendAuthResponse(res, user, 'Session refreshed');
  } catch {
    clearRefreshCookie(res);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (token) {
      try {
        const decoded = verifyRefreshToken(token);
        await User.findByIdAndUpdate(decoded.userId, { refreshToken: '' });
      } catch {}
    }

    clearRefreshCookie(res);
    return res.json({ message: 'Logged out successfully' });
  } catch {
    clearRefreshCookie(res);
    return res.json({ message: 'Logged out' });
  }
};

module.exports = { register, login, googleAuth, refresh, logout };
