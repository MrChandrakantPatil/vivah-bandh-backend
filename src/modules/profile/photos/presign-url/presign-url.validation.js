import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PHOTOS = 5;

const photoSchema = z.object({
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  fileSize: z.number().int().positive().max(MAX_FILE_SIZE, 'Each photo must not exceed 5 MB'),
});

export const presignPhotosSchema = z.object({
  files: z
    .array(photoSchema)
    .min(1, 'At least one photo is required')
    .max(MAX_PHOTOS, 'A maximum of 5 photos can be uploaded at once'),
});
