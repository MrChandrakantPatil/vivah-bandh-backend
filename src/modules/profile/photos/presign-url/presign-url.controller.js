import { requestPhotoUploads } from './presign-url.service.js';
import { presignPhotosSchema } from './presign-url.validation.js';

export async function createUploadUrl(req, res, next) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const result = presignPhotosSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await requestPhotoUploads(req.userId, result.data);

    return res.status(200).json({
      success: true,
      message: 'Upload URLs generated successfully',
      data,
    });
  } catch (error) {
    return next(error);
  }
}
