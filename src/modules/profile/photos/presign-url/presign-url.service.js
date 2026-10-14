import { createPhotoUploadUrl } from '../../../../infrastructure/s3/s3.service.js';

export async function requestPhotoUploads(userId, payload) {
  if (typeof userId !== 'string' || !userId.trim()) {
    const error = new Error('Authenticated user ID is required');
    error.statusCode = 401;
    throw error;
  }

  const normalizedUserId = userId.trim();

  const uploads = await Promise.all(
    payload.files.map((file) =>
      createPhotoUploadUrl({
        userId: normalizedUserId,
        contentType: file.contentType,
        fileSize: file.fileSize,
      })
    )
  );

  return { uploads };
}
