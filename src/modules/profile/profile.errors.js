export const PROFILE_ERRORS = {
  INVALID_USER_ID: {
    code: 'INVALID_USER_ID',
    message: 'Invalid user ID',
  },

  PROFILE_NOT_FOUND: {
    code: 'PROFILE_NOT_FOUND',
    message: 'Profile not found',
  },

  NO_UPDATABLE_FIELDS: {
    code: 'NO_UPDATABLE_FIELDS',
    message: 'No valid profile fields provided for update',
  },

  INVALID_PHOTO: {
    code: 'INVALID_PHOTO',
    message: 'Invalid photo',
  },

  PHOTO_NOT_FOUND: {
    code: 'PHOTO_NOT_FOUND',
    message: 'Photo not found',
  },

  PHOTO_LIMIT_REACHED: {
    code: 'PHOTO_LIMIT_REACHED',
    message: 'Maximum profile photo limit reached',
  },

  UNSUPPORTED_PHOTO_TYPE: {
    code: 'UNSUPPORTED_PHOTO_TYPE',
    message: 'Only JPEG, PNG, and WebP images are supported',
  },

  PHOTO_SIZE_EXCEEDED: {
    code: 'PHOTO_SIZE_EXCEEDED',
    message: 'Photo size must not exceed 5 MB',
  },

  PHOTO_UPLOAD_FAILED: {
    code: 'PHOTO_UPLOAD_FAILED',
    message: 'Failed to upload photo',
  },
};
