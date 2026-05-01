const axios = require('axios');
const { cache } = require('../utils/redis');

const LEETCODE_API = 'https://leetcode.com/graphql';
const CACHE_TTL = 3600;

const USER_STATS_QUERY = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      profile {
        realName
        ranking
        userAvatar
      }
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      submissionCalendar
    }
  }
`;

const fetchLeetCodeStats = async (username) => {
  const cacheKey = `leetcode:${username}`;
  const cached = await cache.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  try {
    const response = await axios.post(
      LEETCODE_API,
      {
        query: USER_STATS_QUERY,
        variables: { username },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 10000,
      }
    );

    const data = response.data?.data;

    if (!data?.matchedUser) {
      throw new Error('User not found on LeetCode');
    }

    const stats = parseStats(data);
    await cache.set(cacheKey, JSON.stringify(stats), CACHE_TTL);

    return stats;
  } catch (error) {
    if (error.message === 'User not found on LeetCode') {
      throw error;
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

const parseStats = (data) => {
  const submissions = data.matchedUser?.submitStats?.acSubmissionNum || [];
  const totals = data.allQuestionsCount || [];

  let easySolved = 0, easyTotal = 0;
  let mediumSolved = 0, mediumTotal = 0;
  let hardSolved = 0, hardTotal = 0;
  let totalSolved = 0, allTotal = 0;

  submissions.forEach(item => {
    if (item.difficulty === 'Easy') easySolved = item.count;
    if (item.difficulty === 'Medium') mediumSolved = item.count;
    if (item.difficulty === 'Hard') hardSolved = item.count;
    if (item.difficulty === 'All') totalSolved = item.count;
  });

  totals.forEach(item => {
    if (item.difficulty === 'Easy') easyTotal = item.count;
    if (item.difficulty === 'Medium') mediumTotal = item.count;
    if (item.difficulty === 'Hard') hardTotal = item.count;
    if (item.difficulty === 'All') allTotal = item.count;
  });

  return {
    username: data.matchedUser?.username,
    profile: data.matchedUser?.profile,
    totalSolved,
    allTotal,
    easySolved,
    easyTotal,
    mediumSolved,
    mediumTotal,
    hardSolved,
    hardTotal,
    submissionCalendar: data.matchedUser?.submissionCalendar || '{}',
  };
};

const invalidateCache = async (username) => {
  await cache.del(`leetcode:${username}`);
};

module.exports = {
  fetchLeetCodeStats,
  validateUsername,
  invalidateCache,
};
