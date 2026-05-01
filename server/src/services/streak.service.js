const { calculateStreak } = require('../utils/helpers');

const computeStreak = (submissionCalendar) => {
  return calculateStreak(submissionCalendar);
};

module.exports = { computeStreak };
