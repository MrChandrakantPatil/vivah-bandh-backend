import Sessions from '../../../models/session.model.js';
import User from '../../../models/user.model.js';

import { generateAccessToken, hashRefreshToken } from '../../../utils/token.utils.js';

import { REFRESH_ERRORS } from './refresh.errors.js';

export const refreshService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error(REFRESH_ERRORS.INVALID_REFRESH_TOKEN);
  }

  const now = new Date();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await Sessions.findOne({
    refreshTokenHash,
  });

  if (!session) {
    throw new Error(REFRESH_ERRORS.INVALID_REFRESH_TOKEN);
  }

  if (session.revokedAt) {
    throw new Error(REFRESH_ERRORS.REFRESH_TOKEN_REVOKED);
  }

  if (session.expiresAt <= now) {
    throw new Error(REFRESH_ERRORS.REFRESH_TOKEN_EXPIRED);
  }

  const user = await User.findOne({
    userId: session.userId,
  }).select('userId email mobile role status lockedUntil -_id');

  if (!user) {
    throw new Error(REFRESH_ERRORS.USER_NOT_FOUND);
  }

  // Account status check
  if (['inactive', 'blocked', 'deleted'].includes(user.status)) {
    session.revokedAt = now;
    await session.save();

    throw new Error(REFRESH_ERRORS.INVALID_REFRESH_TOKEN);
  }

  // Account lock check
  if (user.lockedUntil && user.lockedUntil > now) {
    throw new Error(REFRESH_ERRORS.INVALID_REFRESH_TOKEN);
  }

  // Update session activity
  session.lastUsedAt = now;

  await session.save();

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: user.userId,
  });

  return {
    accessToken,
    user: {
      userId: user.userId,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
    },
  };
};
