import mongoose from 'mongoose';

// ==========================================
// User Schema
// ==========================================

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      immutable: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },

    status: {
      type: String,
      enum: ['verification_pending', 'active', 'inactive', 'blocked', 'deleted'],
      default: 'verification_pending',
    },

    mobileVerified: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    lastActiveAt: {
      type: Date,
      default: null,
    },

    loginCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    failedLoginAttempts: {
      type: Number,
      min: 0,
      default: 0,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// Indexes
// ==========================================

userSchema.index({ userId: 1 }, { unique: true, name: 'uq_user_user_id' });

userSchema.index({ email: 1 }, { unique: true, name: 'uq_user_email' });

userSchema.index({ mobile: 1 }, { unique: true, name: 'uq_user_mobile' });

userSchema.index({ status: 1, lastActiveAt: -1 }, { name: 'idx_user_status_activity' });

// ==========================================
// Model
// ==========================================

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
