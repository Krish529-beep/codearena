const { v4: uuidv4 } = require('uuid');

const generateInviteCode = () => {
  return uuidv4().slice(0, 8).toUpperCase();
};

const calculatePoints = (easy, medium, hard) => {
  return (easy * 5) + (medium * 10) + (hard * 15);
};

const calculateStreak = (submissionCalendar) => {
  if (!submissionCalendar) return { current: 0, longest: 0 };

  let calendar;
  try {
    calendar = typeof submissionCalendar === 'string'
      ? JSON.parse(submissionCalendar)
      : submissionCalendar;
  } catch {
    return { current: 0, longest: 0 };
  }

  const dates = Object.keys(calendar)
    .map(ts => {
      const date = new Date(parseInt(ts) * 1000);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .filter(ts => calendar[Math.floor(ts / 1000)] > 0 || true)
    .sort((a, b) => a - b);

  const uniqueDates = [...new Set(dates)];
  if (uniqueDates.length === 0) return { current: 0, longest: 0 };

  const ONE_DAY = 86400000;
  let longest = 1;
  let currentRun = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    if (uniqueDates[i] - uniqueDates[i - 1] === ONE_DAY) {
      currentRun++;
      longest = Math.max(longest, currentRun);
    } else {
      currentRun = 1;
    }
  }
  longest = Math.max(longest, currentRun);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - ONE_DAY);

  const lastDate = uniqueDates[uniqueDates.length - 1];
  let current = 0;

  if (lastDate === today.getTime() || lastDate === yesterday.getTime()) {
    current = 1;
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      if (uniqueDates[i + 1] - uniqueDates[i] === ONE_DAY) {
        current++;
      } else {
        break;
      }
    }
  }

  return { current, longest };
};

module.exports = { generateInviteCode, calculatePoints, calculateStreak };
