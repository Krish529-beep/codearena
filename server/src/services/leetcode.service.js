const axios = require('axios');
const { cache } = require('../utils/redis');

const ALFA_API = 'https://alfa-leetcode-api.onrender.com';
const CACHE_TTL = 3600;

/**
 * Fetches LeetCode stats for a user via alfa-leetcode-api.
 * Makes two parallel requests:
 *   GET /:username/solved  → problem counts per difficulty
 *   GET /:username/calendar → submission calendar & streak
 */
const fetchLeetCodeStats = async (username) => {
  const cacheKey = `leetcode:${username}`;
  const cached = await cache.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  try {
    const [solvedRes, calendarRes] = await Promise.all([
      axios.get(`${ALFA_API}/${encodeURIComponent(username)}/solved`, { timeout: 15000 }),
      axios.get(`${ALFA_API}/${encodeURIComponent(username)}/calendar`, { timeout: 15000 }),
    ]);

    const solvedData = solvedRes.data;
    const calendarData = calendarRes.data;

    // If the API returns an error payload (e.g. { errors: [...] })
    if (!solvedData || solvedData.errors) {
      throw new Error('User not found on LeetCode');
    }

    const stats = {
      username,
      profile: null,          // profile details not needed for stats
      totalSolved:    solvedData.solvedProblem   ?? 0,
      allTotal:       0,       // total problems on LeetCode (cosmetic, not provided by this endpoint)
      easySolved:     solvedData.easySolved      ?? 0,
      easyTotal:      0,
      mediumSolved:   solvedData.mediumSolved    ?? 0,
      mediumTotal:    0,
      hardSolved:     solvedData.hardSolved      ?? 0,
      hardTotal:      0,
      // submissionCalendar is returned as a JSON string by alfa-api (same format as the old GraphQL)
      submissionCalendar: calendarData?.submissionCalendar ?? '{}',
    };

    await cache.set(cacheKey, JSON.stringify(stats), CACHE_TTL);
    return stats;
  } catch (error) {
    if (error.message === 'User not found on LeetCode') {
      throw error;
    }
    if (error.response?.status === 404) {
      throw new Error('User not found on LeetCode');
    }
    if (error.response?.status === 429) {
      throw new Error('LeetCode API rate limited. Please try again later.');
    }
    throw new Error('Failed to fetch LeetCode data. Please try again.');
  }
};

const validateUsername = async (username) => {
  try {
    const stats = await fetchLeetCodeStats(username);
    return { valid: true, stats };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

const invalidateCache = async (username) => {
  await cache.del(`leetcode:${username}`);
};

module.exports = {
  fetchLeetCodeStats,
  validateUsername,
  invalidateCache,
};

