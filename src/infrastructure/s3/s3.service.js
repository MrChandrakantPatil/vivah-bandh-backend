import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import { AWS_CONFIG } from '../../config/aws.config.js';

import { s3Client } from './s3.client.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const bucket = AWS_CONFIG.AWS_S3_BUCKET;

// Generate a presigned URL for uploading a photo.
export async function createPhotoUploadUrl({ userId, contentType, fileSize }) {
  if (typeof userId !== 'string' || !userId.trim()) {
    const error = new Error('User ID is required');
    error.statusCode = 400;
    throw error;
  }

  if (!ALLOWED_TYPES[contentType]) {
    const error = new Error('Unsupported photo type');
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(fileSize) || fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
    const error = new Error('Photo must not exceed 5 MB');
    error.statusCode = 400;
    throw error;
  }

  const key = `profile/${userId.trim()}/${randomUUID()}.${ALLOWED_TYPES[contentType]}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const expiresIn = 300;

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn,
  });

  return {
    uploadUrl,
    key,
    expiresIn,
  };
}

// Delete a photo from S3 using its object key.
export async function deletePhotoObject(key) {
  if (typeof key !== 'string' || !key.trim()) {
    const error = new Error('Photo key is required');
    error.statusCode = 400;
    throw error;
  }

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  return { key };
}
