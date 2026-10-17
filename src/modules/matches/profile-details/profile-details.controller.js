import logger from '../../../logger/logger.js';
import { getProfileDetailsService } from './profile-details.service.js';
import { PROFILE_ERRORS } from '../../profile/profile.errors.js';

export const getProfileDetailsController = async (req, res) => {
  try {
    const response = await getProfileDetailsService(
        req.userId,
        req.params.userId,
    );

    return res.status(200).json({
      success: true,
      message: 'Profile details fetched successfully',
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

    logger.error({ err: error }, 'Profile fetch error');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
