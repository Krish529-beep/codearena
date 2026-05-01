const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['sync', 'join_group', 'leave_group', 'milestone', 'create_group'],
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

activitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
