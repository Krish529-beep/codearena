const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 60,
  },
  description: {
    type: String,
    default: '',
    maxlength: 500,
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    initialSolvedCount: {
      type: Number,
      default: 0,
    },
    initialPointsCount: {
      type: Number,
      default: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  maxMembers: {
    type: Number,
    default: 50,
  },
}, {
  timestamps: true,
});

groupSchema.index({ type: 1 });

module.exports = mongoose.model('Group', groupSchema);
