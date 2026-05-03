const cron = require('node-cron');
const User = require('../models/User');
const { fetchLeetCodeStats, invalidateCache } = require('../services/leetcode.service');
const { computePoints } = require('../services/points.service');
const { computeStreak } = require('../services/streak.service');

const startCronJobs = (io) => {
  // Sync all users once every day at midnight (00:00)
  const cronExpression = '0 0 * * *';

  cron.schedule(cronExpression, async () => {
    console.log('⏰ Running midnight LeetCode sync...');

    try {
      const users = await User.find({
        leetcodeUsername: { $ne: '', $exists: true },
        onboarded: true,
      }).select('_id leetcodeUsername groups');

      let synced = 0;
      let failed = 0;

      for (const user of users) {
        try {
          await invalidateCache(user.leetcodeUsername);
          const stats = await fetchLeetCodeStats(user.leetcodeUsername);
          const points = computePoints(stats);
          const streak = computeStreak(stats.submissionCalendar);

          await User.findByIdAndUpdate(user._id, {
            $set: {
              stats: {
                totalSolved: stats.totalSolved,
                easySolved: stats.easySolved,
                mediumSolved: stats.mediumSolved,
                hardSolved: stats.hardSolved,
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
          });

          if (io) {
            user.groups.forEach(groupId => {
              io.to(`group:${groupId}`).emit('leaderboard:update', {
                groupId,
              });
            });
          }

          synced++;
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (err) {
          failed++;
          console.error(`Failed to sync ${user.leetcodeUsername}:`, err.message);
        }
      }

      console.log(`✅ Sync complete: ${synced} success, ${failed} failed`);
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });

  console.log('⏰ Cron job scheduled: daily at midnight (00:00)');
};

module.exports = { startCronJobs };
