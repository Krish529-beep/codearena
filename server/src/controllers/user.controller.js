const User = require('../models/User');
const Activity = require('../models/Activity');
const { fetchLeetCodeStats, validateUsername, invalidateCache } = require('../services/leetcode.service');
const { computePoints } = require('../services/points.service');
const { computeStreak } = require('../services/streak.service');

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -refreshToken')
      .populate('groups', 'name type');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('-password -refreshToken');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

const setLeetCodeUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const result = await validateUsername(username.trim());
    if (!result.valid) {
      return res.status(400).json({ message: result.error || 'Invalid LeetCode username' });
    }

    const stats = result.stats;
    const points = computePoints(stats);
    const streak = computeStreak(stats.submissionCalendar);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          leetcodeUsername: username.trim(),
          onboarded: true,
          stats: {
            totalSolved: stats.totalSolved,
            allTotal: stats.allTotal,
            easySolved: stats.easySolved,
            easyTotal: stats.easyTotal,
            mediumSolved: stats.mediumSolved,
            mediumTotal: stats.mediumTotal,
            hardSolved: stats.hardSolved,
            hardTotal: stats.hardTotal,
            totalPoints: points,
          },
          streak: {
            current: streak.current,
            longest: streak.longest,
            lastActiveDate: new Date(),
          },
          submissionCalendar: stats.submissionCalendar,
          lastSyncedAt: new Date(),
        },
      },
      { new: true }
    ).select('-password -refreshToken');

    await Activity.create({
      user: req.user._id,
      type: 'sync',
      data: { action: 'set_username', username: username.trim() },
    });

    res.json({ user, message: 'LeetCode username set successfully' });
  } catch (error) {
    console.error('Set username error:', error);
    res.status(500).json({ message: 'Failed to set LeetCode username' });
  }
};

const syncLeetCodeData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.leetcodeUsername) {
      return res.status(400).json({ message: 'No LeetCode username set' });
    }

    await invalidateCache(user.leetcodeUsername);
    const stats = await fetchLeetCodeStats(user.leetcodeUsername);
    const points = computePoints(stats);
    const streak = computeStreak(stats.submissionCalendar);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          stats: {
            totalSolved: stats.totalSolved,
            allTotal: stats.allTotal,
            easySolved: stats.easySolved,
            easyTotal: stats.easyTotal,
            mediumSolved: stats.mediumSolved,
            mediumTotal: stats.mediumTotal,
            hardSolved: stats.hardSolved,
            hardTotal: stats.hardTotal,
            totalPoints: points,
          },
          streak: {
            current: streak.current,
            longest: streak.longest,
            lastActiveDate: new Date(),
          },
          submissionCalendar: stats.submissionCalendar,
          lastSyncedAt: new Date(),
        },
      },
      { new: true }
    ).select('-password -refreshToken');

    await Activity.create({
      user: req.user._id,
      type: 'sync',
      data: { totalSolved: stats.totalSolved, points },
    });

    if (req.io) {
      const groups = updatedUser.groups || [];
      groups.forEach(groupId => {
        req.io.to(`group:${groupId}`).emit('user:synced', {
          userId: updatedUser._id,
          stats: updatedUser.stats,
          streak: updatedUser.streak,
        });
      });
    }

    res.json({ user: updatedUser, message: 'Data synced successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: error.message || 'Failed to sync data' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name avatar leetcodeUsername stats streak onboarded');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

module.exports = {
  getMe,
  updateProfile,
  setLeetCodeUsername,
  syncLeetCodeData,
  getUserProfile,
};
