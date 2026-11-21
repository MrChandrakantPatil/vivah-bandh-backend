import bcrypt from 'bcrypt';
import crypto from 'crypto';

import User from '../../../models/user.model.js';
import Sessions from '../../../models/session.model.js';

import { LOGIN_ERRORS } from './login.errors.js';
import { AUTH_CONFIG } from '../../../config/auth.config.js';

import { usernameIdentifier } from './login.utils.js';
import { generateAccessToken, hashRefreshToken } from '../../../utils/token.utils.js';

export const loginService = async ({ username, password, deviceId, userAgent, ipAddress }) => {
  const loginIdentifier = usernameIdentifier(username);

  if (!loginIdentifier) {
    throw new Error(LOGIN_ERRORS.INVALID_CREDENTIALS);
  }

  const query =
    loginIdentifier.type === 'email'
      ? { email: loginIdentifier.value }
      : { mobile: loginIdentifier.value };

  const user = await User.findOne(query).select('+passwordHash');

  if (!user) {
    throw new Error(LOGIN_ERRORS.INVALID_CREDENTIALS);
  }

  if (['inactive', 'blocked', 'deleted'].includes(user.status)) {
    throw new Error(LOGIN_ERRORS.INVALID_CREDENTIALS);
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new Error(LOGIN_ERRORS.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    await User.updateOne({ _id: user._id }, { $inc: { failedLoginAttempts: 1 } });

    throw new Error(LOGIN_ERRORS.INVALID_CREDENTIALS);
  }

  const now = new Date();

  user.lastLoginAt = now;
  user.lastActiveAt = now;
  user.loginCount += 1;
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;

  await user.save();

  const refreshToken = crypto.randomBytes(64).toString('hex');

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date(Date.now() + AUTH_CONFIG.REFRESH_TOKEN_MAX_AGE);

  const session = await Sessions.findOne({
    userId: user.userId,
    deviceId,
  });

  if (session) {
    session.refreshTokenHash = refreshTokenHash;
    session.userAgent = userAgent || 'Unknown';
    session.ipAddress = ipAddress || 'Unknown';
    session.expiresAt = expiresAt;
    session.lastUsedAt = now;
    session.revokedAt = null;

    await session.save();
  } else {
    await Sessions.create({
      userId: user.userId,
      deviceId,
      refreshTokenHash,
      userAgent: userAgent || 'Unknown',
      ipAddress: ipAddress || 'Unknown',
      expiresAt,
      lastUsedAt: now,
    });
  }

  const accessToken = generateAccessToken({
    userId: user.userId,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      userId: user.userId,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
    },
  };
};
