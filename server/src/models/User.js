const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  googleId: {
    type: String,
    sparse: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  leetcodeUsername: {
    type: String,
    trim: true,
    default: '',
  },
  stats: {
    totalSolved: { type: Number, default: 0 },
    allTotal: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    easyTotal: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    mediumTotal: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    hardTotal: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
  },
  submissionCalendar: {
    type: String,
    default: '{}',
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  }],
  lastSyncedAt: {
    type: Date,
    default: null,
  },
  refreshToken: {
    type: String,
    default: '',
  },
  onboarded: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

userSchema.index({ leetcodeUsername: 1 });

module.exports = mongoose.model('User', userSchema);
