import express from 'express';

import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { getProfileController } from './get/get.controller.js';
import { updateProfileController } from './update/update.controller.js';
import { createUploadUrl } from './photos/presign-url/presign-url.controller.js';
import { deletePhoto } from './photos/delete/delete.controller.js';

const router = express.Router();

router.get('/', authenticate, getProfileController);
router.patch('/', authenticate, updateProfileController);

router.post('/photos/presign-url', authenticate, createUploadUrl);
router.delete('/photos', authenticate, deletePhoto);

export default router;
