import { z } from 'zod';

export const deletePhotoSchema = z.object({
  photoKey: z.string().trim().min(1, 'Photo key is required').max(500, 'Invalid photo key'),
});
