import Profile from '../../../../models/profile.model.js';
import { deletePhotoObject } from '../../../../infrastructure/s3/s3.service.js';

export async function deleteProfilePhoto(userId, photoKey) {
  if (typeof userId !== 'string' || !userId.trim()) {
    const error = new Error('Authenticated user ID is required');
    error.statusCode = 401;
    throw error;
  }

  const normalizedUserId = userId.trim();
  const profile = await Profile.findOne({ userId: normalizedUserId });

  if (!profile) {
    const error = new Error('Profile not found');
    error.statusCode = 404;
    throw error;
  }

  const photos = profile.profilePhotos ?? [];

  // Only allow deletion of a photo belonging to this profile.
  if (!photos.includes(photoKey)) {
    const error = new Error('Photo not found in this profile');
    error.statusCode = 404;
    throw error;
  }

  // Extra ownership protection before calling S3.
  const expectedPrefix = `profile/${normalizedUserId}/`;

  if (!photoKey.startsWith(expectedPrefix)) {
    const error = new Error('Invalid photo key');
    error.statusCode = 400;
    throw error;
  }

  const updatedPhotos = photos.filter((key) => key !== photoKey);

  const updatedPrimaryPhoto =
    profile.primaryPhoto === photoKey ? (updatedPhotos[0] ?? null) : (profile.primaryPhoto ?? null);

  // Delete the S3 object first.
  await deletePhotoObject(photoKey);

  profile.profilePhotos = updatedPhotos;
  profile.primaryPhoto = updatedPrimaryPhoto;

  await profile.save();

  return {
    profilePhotos: profile.profilePhotos,
    primaryPhoto: profile.primaryPhoto,
  };
}
