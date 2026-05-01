const { calculatePoints } = require('../utils/helpers');

const computePoints = (stats) => {
  return calculatePoints(
    stats.easySolved || 0,
    stats.mediumSolved || 0,
    stats.hardSolved || 0
  );
};

module.exports = { computePoints };
