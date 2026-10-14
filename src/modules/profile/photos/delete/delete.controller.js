import { deleteProfilePhoto } from './delete.service.js';
import { deletePhotoSchema } from './delete.validation.js';

export async function deletePhoto(req, res, next) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const result = deletePhotoSchema.safeParse(req.body);

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

    const data = await deleteProfilePhoto(req.userId, result.data.photoKey);

    return res.status(200).json({
      success: true,
      message: 'Profile photo deleted successfully',
      data,
    });
  } catch (error) {
    return next(error);
  }
}
