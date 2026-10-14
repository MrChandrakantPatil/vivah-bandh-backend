import logger from '../../../logger/logger.js';

import { updateProfileService } from './update.service.js';

import { PROFILE_ERRORS } from '../profile.errors.js';

export const updateProfileController = async (req, res) => {
  try {
    const response = await updateProfileService(req.userId, req.body ?? {});

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: response,
    });
  } catch (error) {
    if (error?.message === PROFILE_ERRORS.INVALID_USER_ID.code) {
      return res.status(401).json({
        success: false,
        message: PROFILE_ERRORS.INVALID_USER_ID.message,
      });
    }

    if (error?.message === PROFILE_ERRORS.PROFILE_NOT_FOUND.code) {
      return res.status(404).json({
        success: false,
        message: PROFILE_ERRORS.PROFILE_NOT_FOUND.message,
      });
    }

    if (error?.message === PROFILE_ERRORS.NO_UPDATABLE_FIELDS.code) {
      return res.status(400).json({
        success: false,
        message: PROFILE_ERRORS.NO_UPDATABLE_FIELDS.message,
      });
    }

    if (error?.name === 'ValidationError' || error?.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile data',
        errors:
          error.name === 'ValidationError'
            ? Object.values(error.errors).map((item) => ({
                field: item.path,
                message: item.message,
              }))
            : undefined,
      });
    }

    logger.error({ err: error }, 'Profile update error');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
