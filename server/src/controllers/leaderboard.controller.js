const Group = require('../models/Group');

const getGroupLeaderboard = async (req, res) => {
  try {
    const { sortBy = 'points' } = req.query;
    const group = await Group.findById(req.params.groupId)
      .populate('members.user', 'name avatar leetcodeUsername stats streak');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(
      m => m.user._id.toString() === req.user._id.toString()
    );

    if (group.type === 'private' && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let leaderboard = group.members
      .filter(m => m.user && m.user.stats)
      .map(m => ({
        userId: m.user._id,
        name: m.user.name,
        avatar: m.user.avatar,
        leetcodeUsername: m.user.leetcodeUsername,
        totalSolved: m.user.stats.totalSolved,
        easySolved: m.user.stats.easySolved,
        mediumSolved: m.user.stats.mediumSolved,
        hardSolved: m.user.stats.hardSolved,
        totalPoints: m.user.stats.totalPoints,
        currentStreak: m.user.streak?.current || 0,
        joinedAt: m.joinedAt,
      }));

    if (sortBy === 'solved') {
      leaderboard.sort((a, b) => b.totalSolved - a.totalSolved);
    } else {
      leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    }

    leaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    res.json({
      groupId: group._id,
      groupName: group.name,
      leaderboard,
      totalMembers: leaderboard.length,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};

module.exports = { getGroupLeaderboard };
