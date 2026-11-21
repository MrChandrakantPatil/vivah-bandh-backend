import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import logger from '../../../logger/logger.js';

import User from '../../../models/user.model.js';
import Profile from '../../../models/profile.model.js';

import { REGISTER_ERRORS } from './register.errors.js';
import { AUTH_CONFIG } from '../../../config/auth.config.js';

import { getNextUserSequence } from '../../../utils/counter.utils.js';

export const registerUserService = async ({
  profileFor,
  gender,
  name,
  dob,
  religion,
  community,
  email,
  mobile,
  password,
}) => {
  email = email.trim().toLowerCase();

  const mobileDigits = mobile.replace(/\D/g, '');
  mobile = `+91${mobileDigits}`;

  const session = await mongoose.startSession();

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        logger.warn('Registration rejected: email already exists');
        throw new Error(REGISTER_ERRORS.EMAIL_EXISTS);
      }

      if (existingUser.mobile === mobile) {
        logger.warn('Registration rejected: mobile already exists');
        throw new Error(REGISTER_ERRORS.MOBILE_EXISTS);
      }
    }

    const passwordHash = await bcrypt.hash(password, AUTH_CONFIG.BCRYPT_SALT_ROUNDS);

    const result = await session.withTransaction(async () => {
      const sequence = await getNextUserSequence(session);

      const profileId = `VB${String(sequence).padStart(6, '0')}`;

      const user = new User({
        userId: profileId,
        email,
        mobile,
        passwordHash,
      });

      await user.save({ session });

      const profile = new Profile({
        profileId,
        createdByUserId: user._id,
        profileFor,
        gender,
        name,
        dob,
        religiousBackground: {
          religion,
          community,
        },
      });

      await profile.save({ session });

      return { user, profile };
    });

    logger.info({ profileId: result.profile.profileId }, 'User registration successful');

    return {
      profileId: result.profile.profileId,
      email: result.user.email,
      mobile: result.user.mobile,
      role: result.user.role,
      status: result.user.status,
    };
  } catch (error) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      if (field === 'email') {
        throw new Error(REGISTER_ERRORS.EMAIL_EXISTS, { cause: error });
      }

      if (field === 'mobile') {
        throw new Error(REGISTER_ERRORS.MOBILE_EXISTS, { cause: error });
      }
    }

    throw error;
  } finally {
    await session.endSession();
  }
};
